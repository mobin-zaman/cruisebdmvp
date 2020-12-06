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
import { Ticket } from 'src/ticket/ticket.entity';

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

  @Exclude()
  @Column()
  boardingPointSelector: string;

  @Exclude()
  @Column()
  boardingPointOption: string;

  @Exclude()
  @Column()
  droppingPointSelector: string;

  @Exclude()
  @Column()
  droppingPointOption: string;

  @Exclude()
  @Column()
  customerNameSelector: string;

  @Exclude()
  @Column()
  mobileNumberSelector: string;

  @Exclude()
  @Column()
  purchaseButtonSelector: string;

  //TODO: find out what eager:false do
  @ManyToOne(
    type => Ship,
    ship => ship.routes,
    { eager: false },
  )
  ship: Promise<Ship>;

  @OneToMany(
    type=> Ticket,
    ticket => ticket.route
  )
  tickets: Promise<Ticket[]>
}
