import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Links } from './entities/links.entity';
import { LinkStat } from './entities/stat.entity';
import { DaysInfo } from './entities/days-info.entity';
import { CreateLinkDto, DeleteLinksDto, GetLinkDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinksService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Links) private linksRepository: Repository<Links>,
    @InjectRepository(LinkStat)
    private linkStatRepository: Repository<LinkStat>,
    @InjectRepository(DaysInfo)
    private daysInfoRepository: Repository<DaysInfo>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async createLink(data: CreateLinkDto, userId: number): Promise<Links> {
    // 1. Проверка на существующую ссылку
    const existingLink = await this.linksRepository.findOne({
      where: { origin: data.origin },
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

    // 3. Создание и сохранение в транзакции
    const result = await this.dataSource.transaction(async (manager) => {
      // 3.1. Сохраняем основную ссылку
      const link = await manager.save(
        manager.create(Links, {
          name: data.name,
          origin: data.origin,
          short_link: shortPath,
          user: { id: userId },
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
      short_link: `${this.configService.get('APP_URL')}${result.short_link}`,
    };
  }

  async getLinks() {
    const links = await this.linksRepository.find({
      relations: ['statistic', 'statistic.days_info'],
    });

    const fullLinks = links.map((link) => ({
      ...link,
      short_link: `${this.configService.get('APP_URL')}/${link.short_link}`,
    }));

    return fullLinks;
  }

  async getLinkInfo(id: number, GetLinkDto?: GetLinkDto) {
    const { dateList } = GetLinkDto || {};

    let dateSet: Set<string> | null = null;

    if (dateList && dateList.length > 0) {
      dateSet = new Set(dateList);
    }

    const link = await this.linksRepository.findOne({
      where: { id },
      relations: ['statistic', 'statistic.days_info'],
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
      short_link: `${this.configService.get('APP_URL')}/${link.short_link}`,
      totalCounter,
      daysInfo: filteredDaysInfo,
    };
  }

  async removeLinks({ ids }: DeleteLinksDto) {
    if (!ids || ids.length === 0) {
      throw new HttpException(
        'No IDs provided for deletion',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.linksRepository.delete(ids);
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

      const todayString = today.toISOString().split('T')[0];

      const existing = await manager
        .createQueryBuilder(DaysInfo, 'd')
        .setLock('pessimistic_write')
        .where('d.linkStatId = :statId', { statId })
        .andWhere('d.date = :today', { today }) // Используем поле date для поиска
        .getOne();

      if (existing) {
        await manager.update(DaysInfo, existing.id, {
          counter: () => 'counter + 1',
        });
      } else {
        const newInfo = manager.create(DaysInfo, {
          counter: 1,
          date: today, // ✅ Добавляем обязательное поле date
          link_stat: link.statistic,
          createdAt: new Date(),
        });
        await manager.save(DaysInfo, newInfo);
      }
    });

    return link.origin;
  }
}
