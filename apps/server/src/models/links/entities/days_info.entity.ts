import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LinkStat } from './stat.entity';
import { LinksDomenRegion } from './domen_region.entity';
@Index(['link_stat', 'date', 'domen'], { unique: true }) // Уникальность для пары стат+дата+домен
@Entity({ name: 'days_info' })
export class DaysInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  counter: number;

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => LinkStat, (link_stat) => link_stat.days_info, {
    onDelete: 'CASCADE',
  })
  link_stat: LinkStat;

  // Добавляем связь с доменом
  @ManyToOne(() => LinksDomenRegion, { nullable: true, onDelete: 'SET NULL' })
  domen: LinksDomenRegion;
}
