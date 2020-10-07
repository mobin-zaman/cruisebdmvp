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

@Entity()
export class Routes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  routeName: string; //example: cox's bazaar to saint martin

  @Column({
    select: false
  })
  optionSelectorIdLeavingFrom: string;

  @Column({
    select: false
  })
  optionSelectorIdGoingTo: string;

  @Column({
    select: false
  })
  viewSeatSelector: string;

  //TODO: find out what eager:false do
  @ManyToOne(
    type => Ship,
    ship => ship.destinations,
    { eager: false },
  )
  ship: Ship;
}
