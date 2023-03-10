require('reflect-metadata');
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'voucher' })
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  title: string;

  @Column({ type: 'longtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  content: string;

  @Column({ type: 'longtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  description: string;

  @Column({ type: 'double', default: 0 })
  discount: number;

  @Column({ type: 'integer', default: 0 })
  quantity: number;

  @Column({ length: 50, default: null })
  startTimeAt: string;

  @Column({ length: 50, default: null })
  endTimeAt: string;

  @Column({ default: false })
  isInactive: boolean;

  @Column({ default: false })
  isDelete: boolean;

 
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @DeleteDateColumn()
  public delete_at: Date;
}
