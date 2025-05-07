import { Merchant } from '@prisma/client';

export interface IMerchantRepository {
  findById(id: number): Promise<Merchant | null>;
  findAll(): Promise<Merchant[]>;
  create(merchant: Partial<Merchant>): Promise<Merchant>;
  update(id: number, merchant: Partial<Merchant>): Promise<Merchant>;
  delete(id: number): Promise<void>;
} 