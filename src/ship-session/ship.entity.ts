import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Routes } from './routes.entity';

@Entity()
@Unique(['shipName', 'shipAdminPageUrl'])
export class Ship extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shipName: string;

  @Column()
  shipAdminPageUrl: string;

  //NOTE: this {select: false} options allows to hide this field from the select result
  @Column({
    select: false
  })
  username: string;

  //NOTE: this {select: false} options allows to hide this field from the select result
  @Column({
    select: false
  })
  password: string;

  @OneToMany(
    type => Routes,
    route => route.ship,
    { eager: true },
  )
  destinations: Routes[];
}
