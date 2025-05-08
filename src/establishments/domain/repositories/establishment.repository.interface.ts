import { Establishment } from '@prisma/client';

export interface IEstablishmentRepository {
  findById(id: number): Promise<Establishment | null>;
  findAll(): Promise<Establishment[]>;
  create(establishment: Partial<Establishment>): Promise<Establishment>;
  update(id: number, establishment: Partial<Establishment>): Promise<Establishment>;
  delete(id: number): Promise<void>;
} 