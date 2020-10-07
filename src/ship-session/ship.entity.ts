import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Routes } from './routes.entity';
import { SeatCategory } from './seat-category.entity';
import {Exclude} from 'class-transformer';

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
  @Exclude()
  @Column()
  username: string;

  //NOTE: this {select: false} options allows to hide this field from the select result
  @Exclude()
  @Column()
  password: string;

  @OneToMany(
    type => Routes,
    route => route.ship,
    { eager: true },
  )
  routes: Routes[];

  @OneToMany(
    type => SeatCategory,
    seatCategory => seatCategory.ship,
    { eager: false },
  )
  seatCategories: SeatCategory[];
}
