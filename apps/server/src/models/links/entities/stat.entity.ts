import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DaysInfo } from './days_info.entity';
import { Links } from './links.entity';
@Entity('link_stat')
export class LinkStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  global_counter: number;

  @OneToOne(() => Links, (link) => link.statistic, { onDelete: 'CASCADE' })
  @JoinColumn()
  link: Links;

  @OneToMany(() => DaysInfo, (days_info) => days_info.link_stat, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  days_info: DaysInfo[];
}
