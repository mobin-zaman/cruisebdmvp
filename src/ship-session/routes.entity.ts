import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Ship } from './ship.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Routes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  routeName: string; //example: cox's bazaar to saint martin

  @Exclude()
  @Column()
  optionSelectorIdLeavingFrom: string;

  @Exclude()
  @Column()
  optionSelectorIdGoingTo: string;

  @Exclude()
  @Column()
  viewSeatSelector: string;

  //TODO: find out what eager:false do
  @ManyToOne(
    type => Ship,
    ship => ship.routes,
    { eager: false },
  )
  ship: Promise<Ship>;
}
