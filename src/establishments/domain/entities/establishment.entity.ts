import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@users/domain/entities/user.entity';
import { Merchant } from '@merchants/domain/entities/merchant.entity';

@Entity('establishments')
export class Establishment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  revenue: number;

  @Column({ name: 'employee_count' })
  employeeCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @ManyToOne(() => Merchant, merchant => merchant.establishments)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;
} 