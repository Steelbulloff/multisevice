import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LinkStat } from './stat.entity';
import { User } from 'src/models/auth/entities';
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
}
