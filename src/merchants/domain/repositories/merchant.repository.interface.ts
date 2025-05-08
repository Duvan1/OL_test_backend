import { IMerchant } from '../entities/merchant.entity';

export interface IMerchantRepository {
  findById(id: number): Promise<IMerchant | null>;
  findAll(): Promise<IMerchant[]>;
  findAllPaginated(skip: number, take: number, filters?: any): Promise<IMerchant[]>;
  count(filters?: any): Promise<number>;
  create(merchantData: Partial<IMerchant>): Promise<IMerchant>;
  update(id: number, merchantData: Partial<IMerchant>): Promise<IMerchant>;
  delete(id: number): Promise<void>;
} 