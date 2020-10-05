import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
