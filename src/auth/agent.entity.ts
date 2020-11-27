import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique}  from 'typeorm';

@Entity()
@Unique(['firebase_uid'])

export class Agent extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  firebase_uid: string;

  @Column()
  email: string;

  @Column()
  phoneNumber:string;

  


}
