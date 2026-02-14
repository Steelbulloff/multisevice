import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LinkStat } from './stat.entity';
import { User } from 'src/models/auth/entities';
@Entity({ name: 'Links' })
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
  userId: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
