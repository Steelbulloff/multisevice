import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'domen_region' })
export class LinksDomenRegion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  domen: string;
}
