import { Agency } from 'src/agency/agency.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
} from 'typeorm';

@Entity()
@Unique(['firebase_uid'])
export class Agent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  firebase_uid: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  phoneNumber: string;

  @Column({
    nullable: false,
  })
  initialPassword: string;

  @ManyToOne(
    type => Agency,
    agency => agency.agents,
  )
  agency: Agency;
}
