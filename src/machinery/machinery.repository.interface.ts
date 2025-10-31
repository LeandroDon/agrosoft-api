import { Machinery, MachineryStatus } from './machinery.entity';

export interface MachineryRepository {
  findAll(): Promise<Machinery[]>;
  findByStatus(status: MachineryStatus): Promise<Machinery[]>;
  findById(id: string): Promise<Machinery | null>;
  create(input: Omit<Machinery, 'id'>): Promise<Machinery>;
  update(id: string, input: Partial<Omit<Machinery, 'id'>>): Promise<Machinery | null>;
  delete(id: string): Promise<boolean>;
  report(): Promise<Array<{ status: MachineryStatus; count: number; hours: number }>>;
}
