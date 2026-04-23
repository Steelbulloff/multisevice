import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'domen_region' })
export class LinksDomainRegion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  domain: string;
}
