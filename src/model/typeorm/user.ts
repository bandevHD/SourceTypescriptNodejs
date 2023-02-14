import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column()
  @Exclude()
  password: string;
}
