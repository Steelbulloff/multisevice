import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LinkStat } from './stat.entity';
import { User } from 'src/models/auth/entities';
import { LinksDomainRegion } from './domen_region.entity';
import { LinksTags } from './tags.entity';
@Entity({ name: 'links' })
export class Links {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  origin: string;

  @Column({ unique: true })
  short_link: string;

  @OneToOne(() => LinkStat, (statistic) => statistic.link, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  statistic: LinkStat;

  @ManyToOne(() => User, (user) => user.links, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => LinksDomainRegion, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'links_domen_region' }) // имя таблицы опционально
  domen_region: LinksDomainRegion[];

  @ManyToMany(() => LinksTags, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'links_tags_links' })
  tags: LinksTags[];
}
