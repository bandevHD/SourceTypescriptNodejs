import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinTable } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Phone } from './phone';

@ObjectType()
@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ length: 100 })
  firstName: string;

  @Field()
  @Column({ length: 100 })
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Phone, (phone) => phone.user, {
    cascade: true,
    lazy: true,
  })
  // @JoinTable()
  phones: Phone[];
}
