import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 100, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  firstName: string;

  @Column({ length: 100, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  lastName: string;

  @Column()
  @Exclude()
  password: string;
}
