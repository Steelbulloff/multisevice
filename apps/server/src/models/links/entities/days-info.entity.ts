import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LinkStat } from './stat.entity';
@Index(['link_stat', 'createdAt'], { unique: true })
@Entity({ name: 'days_info' })
export class DaysInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  counter: number;

  @Column({ type: 'date' }) // Храним только дату без времени
  date: Date;

  @CreateDateColumn()
  createdAt: Date; // Оставляем для аудита

  @ManyToOne(() => LinkStat, (link_stat) => link_stat.days_info, {
    onDelete: 'CASCADE',
  })
  link_stat: LinkStat;
}
