import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique   } from 'typeorm';

@Entity()
@Unique(['agencyName'])
export class Agency extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  agencyName: string;

  //TODO: add the create by admin id column 
}
