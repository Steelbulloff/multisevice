import { Links } from 'src/models/links/entities/links.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'date_of_created',
    nullable: true,
  })
  dateOfCreated?: Date;

  @OneToMany(() => Links, (links) => links.userId, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  links: Links[];
}
