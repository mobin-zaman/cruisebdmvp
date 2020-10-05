import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Ship extends BaseEntity{

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
}