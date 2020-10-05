import {
  BaseEntity,
  Column,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Routes } from './routes.entity';

@Entity()
@Unique(['shipName', 'shipUrl'])
export class Ship extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shipName: string;

  @Column()
  shipUrl: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(type=> Routes, route=> route.ship, {eager:true})
  destinations: Routes[];
}
