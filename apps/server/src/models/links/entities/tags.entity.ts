import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Links } from './links.entity';
import { User } from 'src/models/auth/entities';

@Entity({ name: 'links_tags' })
export class LinksTags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => User, (user) => user.links, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user' })
  user: User;

  @ManyToMany(() => Links, (link) => link.tags)
  links: Links[];
}
