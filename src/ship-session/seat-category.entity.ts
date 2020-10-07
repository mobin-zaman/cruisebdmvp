import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ship } from './ship.entity';

@Entity()
/**
 * This is also called class of a ship
 * class - category of the ship
 * deck - the floor of the ship
 */
export class SeatCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryName: string;

  @Column()
  categoryButtonSelector: string;

  @ManyToOne(
    type => Ship,
    ship => ship.destinations,
    { eager: false , nullable: false},
  )
  ship: Ship;

}
