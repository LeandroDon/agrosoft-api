export type MachineryStatus = 'active'|'maintenance'|'retired';

export interface Machinery {
  id: number;
  name: string;
  brand: string;
  model: string;
  status: MachineryStatus;
  hours_used: number;
  purchase_date: Date;
}

export interface MachineryRepository {
  findAll(): Promise<Machinery[]>;
  findByStatus(status: MachineryStatus): Promise<Machinery[]>;
  create(input: Omit<Machinery, 'id'>): Promise<Machinery>;
  update(id: number, input: Partial<Omit<Machinery, 'id'>>): Promise<Machinery | null>;
  delete(id: number): Promise<boolean>;
  report(): Promise<any>;
}
