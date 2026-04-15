import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { CreateLinkDto, DeleteLinksDto, GetLinkDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { DaysInfo, Links, LinksDomenRegion, LinkStat } from './entities';
import { LinksTags } from './entities/tags.entity';

@Injectable()
export class LinksService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Links) private linksRepository: Repository<Links>,
    @InjectRepository(LinkStat)
    private linkStatRepository: Repository<LinkStat>,
    @InjectRepository(DaysInfo)
    private daysInfoRepository: Repository<DaysInfo>,
    @InjectRepository(LinksDomenRegion)
    private linksDomenRegionRepository: Repository<LinksDomenRegion>,
    private linksTagsRepository: Repository<LinksTags>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  // TODO:Подготовить добавление/удаление/редактирование тегов для ссылок
  async createLink(data: CreateLinkDto, userId: number): Promise<Links> {
    // 1. Проверка на существующую ссылку
    const existingLink = await this.linksRepository.findOne({
      where: {
        origin: data.origin,
        user: { id: userId },
      },
    });

    if (existingLink) {
      throw new HttpException(
        'Ссылка с таким URL уже существует',
        HttpStatus.CONFLICT,
      );
    }

    // 2. Генерация уникального короткого кода
    let shortPath: string;
    let exists: Links | null;

    do {
      shortPath = uuidv4().slice(0, 6);
      exists = await this.linksRepository.findOne({
        where: { short_link: shortPath },
      });
    } while (exists);

    const allDomains = await this.linksDomenRegionRepository.find();
    console.log(allDomains);

    // 3. Создание и сохранение в транзакции
    const result = await this.dataSource.transaction(async (manager) => {
      // 3.1. Сохраняем основную ссылку
      const link = await manager.save(
        manager.create(Links, {
          name: data.name,
          origin: data.origin,
          short_link: shortPath,
          user: { id: userId },
          domen_region: allDomains,
        }),
      );

      // 3.2. Создаём статистику
      const stat = await manager.save(
        manager.create(LinkStat, {
          global_counter: 0,
          link,
        }),
      );

      // 3.3. Инициализируем дневную статистику
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await manager.save(
        manager.create(DaysInfo, {
          counter: 0,
          date: today, // Используем новое поле date
          link_stat: stat,
          createdAt: new Date(), // Для аудита сохраняем точное время
        }),
      );

      return link;
    });

    // 4. Формируем результат
    return {
      ...result,
      short_link: result.short_link,
    };
  }

  async getLinks(userId: number) {
    const links = await this.linksRepository.find({
      where: {
        user: { id: userId }, // 🔥 вот ключевая строка
      },
      relations: ['statistic', 'statistic.days_info', 'domen_region'],
    });

    return links.map((link) => ({
      id: link.id,
      name: link.name,
      origin: link.origin,
      short_link: link.short_link,
      domains: link.domen_region,
      statistic: link.statistic,
      createdAt: link.createdAt,
    }));
  }

  async getLinkInfo(id: number, userId: number, GetLinkDto?: GetLinkDto) {
    const { dateList } = GetLinkDto || {};

    let dateSet: Set<string> | null = null;

    if (dateList && dateList.length > 0) {
      dateSet = new Set(dateList);
    }

    const link = await this.linksRepository.findOne({
      where: {
        id,
        user: { id: userId }, // 🔐 защита
      },
      relations: ['statistic', 'statistic.days_info', 'domen_region'],
    });

    if (!link) {
      throw new HttpException('Link not found', HttpStatus.NOT_FOUND);
    }

    const filteredDaysInfo = link.statistic.days_info.filter((day) => {
      const dayStr = day.date.toISOString().split('T')[0]; // Используем поле date
      if (dateSet) {
        return dateSet.has(dayStr);
      } else {
        const today = new Date();
        const cutoff = new Date();
        cutoff.setDate(today.getDate() - 30);
        return day.date >= cutoff && day.date <= today; // Используем поле date
      }
    });

    const totalCounter = filteredDaysInfo.reduce(
      (sum, day) => sum + day.counter,
      0,
    );

    return {
      id: link.id,
      name: link.name,
      origin: link.origin,
      short_link: link.short_link,
      domains: link.domen_region,
      totalCounter,
      daysInfo: filteredDaysInfo,
    };
  }

  async removeLinks({ ids }: DeleteLinksDto, userId: number) {
    if (!ids?.length) {
      throw new HttpException(
        'No IDs provided for deletion',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.linksRepository.delete({
      id: In(ids),
      user: { id: userId }, // 🔐 защита
    });
  }

  private readonly recentRedirects = new Map<string, number>();

  private hasRecentlyRedirected(ip: string, shortPath: string): boolean {
    const key = `${ip}_${shortPath}`;
    const now = Date.now();
    const lastTime = this.recentRedirects.get(key);
    if (lastTime && now - lastTime < 3000) return true;
    this.recentRedirects.set(key, now);
    return false;
  }

  async getOriginalUrlAndIncreaseCounter(
    shortPath: string,
    ip: string,
    host: string,
  ): Promise<string> {
    if (this.hasRecentlyRedirected(ip, shortPath)) {
      console.log(`⛔ Игнорируем повторный запрос с IP ${ip} на ${shortPath}`);
      const fallbackLink = await this.linksRepository.findOneBy({
        short_link: shortPath,
      });
      return fallbackLink?.origin || '/';
    }

    const link = await this.linksRepository.findOne({
      where: { short_link: shortPath },
      relations: ['statistic'],
    });

    if (!link) {
      throw new HttpException('Short link not found', HttpStatus.NOT_FOUND);
    }
    const domainEntity = host
      ? await this.linksDomenRegionRepository.findOneBy({ domen: host })
      : null;

    const statId = link.statistic.id;

    // Увеличиваем глобальный счётчик
    await this.linkStatRepository.increment(
      { id: statId },
      'global_counter',
      1,
    );

    // Выполняем транзакцию для дня
    await this.dataSource.transaction(async (manager) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Обнуляем время для сравнения дат

      const existing = await manager.findOne(DaysInfo, {
        where: {
          link_stat: { id: link.statistic.id },
          date: today,
          domen: domainEntity ? { id: domainEntity.id } : { id: undefined },
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (existing) {
        await manager.update(DaysInfo, existing.id, {
          counter: () => 'counter + 1',
        });
      } else {
        await manager.save(
          manager.create(DaysInfo, {
            counter: 1,
            date: today,
            link_stat: link.statistic,
            domen: domainEntity || undefined, // undefined для TypeORM превратится в NULL в БД
          }),
        );
      }
    });

    return link.origin;
  }
}
