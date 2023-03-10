import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './user';

@ObjectType()
@Entity({ name: 'phone' })
export class Phone extends BaseEntity {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  phoneNumber: number;

  @Field()
  @Column()
  userId: string;

  @Field((_type) => User)
  @ManyToOne(() => User, (user) => user.phones)
  user: User;
}
