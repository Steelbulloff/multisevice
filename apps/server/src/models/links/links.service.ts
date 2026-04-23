import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { CreateLinkDto, CreateTagDto, DeleteLinksDto, GetLinkDto } from './dto';
import { ConfigService } from '@nestjs/config';
import {
  DaysInfo,
  Links,
  LinksDomainRegion,
  LinksTags,
  LinkStat,
} from './entities';

@Injectable()
export class LinksService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Links) private linksRepository: Repository<Links>,
    @InjectRepository(LinkStat)
    private linkStatRepository: Repository<LinkStat>,
    @InjectRepository(DaysInfo)
    private daysInfoRepository: Repository<DaysInfo>,

    @InjectRepository(LinksDomainRegion)
    private linksDomainRegionRepository: Repository<LinksDomainRegion>,

    @InjectRepository(LinksTags)
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

    // TODO:Сделать автоматическое создание дефолтного домена с значением сервера
    const allDomains = await this.linksDomainRegionRepository.find();

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

      // // 3.3. Инициализируем дневную статистику
      // const today = new Date();
      // today.setHours(0, 0, 0, 0);

      // await manager.save(
      //   manager.create(DaysInfo, {
      //     counter: 0,
      //     date: today, // Используем новое поле date
      //     link_stat: stat,
      //     createdAt: new Date(), // Для аудита сохраняем точное время
      //   }),
      // );

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

  async getLinkInfo(id: number, userId: number, query?: GetLinkDto) {
    const { dateList, domainId } = query || {};

    // Загружаем ссылку со статистикой и доменами
    const link = await this.linksRepository.findOne({
      where: { id, user: { id: userId } },
      relations: [
        'statistic',
        'statistic.days_info',
        'statistic.days_info.domain', // важно: подгружаем связанный домен
        'domen_region',
      ],
    });

    if (!link) {
      throw new HttpException('Link not found', HttpStatus.NOT_FOUND);
    }

    let days = link.statistic.days_info;

    // Фильтр по датам
    if (dateList?.length) {
      const dateSet = new Set(dateList);
      days = days.filter((day) =>
        dateSet.has(day.date.toISOString().split('T')[0]),
      );
    } else {
      // Последние 30 дней по умолчанию
      const today = new Date();
      const cutoff = new Date();
      cutoff.setDate(today.getDate() - 30);
      days = days.filter((day) => day.date >= cutoff && day.date <= today);
    }

    // Группировка по дате
    const grouped = new Map<
      string,
      {
        globalCounter: number;
        domainCounters: Map<number, number>;
      }
    >();

    for (const dayInfo of days) {
      const dateKey = dayInfo.date.toISOString().split('T')[0];
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, { globalCounter: 0, domainCounters: new Map() });
      }
      const entry = grouped.get(dateKey)!;
      entry.globalCounter += dayInfo.counter;

      const domId = dayInfo.domain?.id;
      if (domId) {
        const prev = entry.domainCounters.get(domId) || 0;
        entry.domainCounters.set(domId, prev + dayInfo.counter);
      }
    }

    // Формируем результат
    const daysInfoResult = Array.from(grouped.entries()).map(([date, data]) => {
      // Если запрошен конкретный домен – добавим отдельное поле
      const domainCounter = domainId
        ? data.domainCounters.get(domainId) || 0
        : undefined;
      return {
        date,
        globalCounter: data.globalCounter,
        ...(domainId && { domainCounter }),
        // Если нужны все домены – отдаём объект
        ...(!domainId && {
          domainCounters: Object.fromEntries(data.domainCounters),
        }),
      };
    });

    return {
      id: link.id,
      name: link.name,
      origin: link.origin,
      short_link: link.short_link,
      domains: link.domen_region,
      totalCounter: daysInfoResult.reduce((sum, d) => sum + d.globalCounter, 0),
      daysInfo: daysInfoResult,
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
      ? await this.linksDomainRegionRepository.findOneBy({ domain: host })
      : null;
    console.log(domainEntity);

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
          domain: domainEntity ? { id: domainEntity.id } : { id: undefined },
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
            domain: domainEntity || undefined, // undefined для TypeORM превратится в NULL в БД
          }),
        );
      }
    });

    return link.origin;
  }

  // TODO: Проверка на существование по нижнему регистру???
  async createTag(tag: CreateTagDto, userId: number): Promise<LinksTags> {
    const existingTag = await this.linksTagsRepository.findOne({
      where: {
        name: tag.name,
        user: { id: userId },
      },
    });
    if (existingTag) {
      throw new HttpException(
        'Тэг с таким именем уже существует',
        HttpStatus.CONFLICT,
      );
    }

    const newTag = await this.linksTagsRepository.save({
      name: tag.name,
      user: { id: userId },
    });
    return newTag;
  }
}
