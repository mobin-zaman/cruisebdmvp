import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique   } from 'typeorm';

@Entity()
@Unique(['firebase_uid'])
//test@tukurtukur.com -
// ItFbIc0gAJUns9HiSIEWDkSM0lj2
export class Admin extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  firebase_uid: string;

}
