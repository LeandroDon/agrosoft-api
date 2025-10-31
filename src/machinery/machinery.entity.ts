import crypto from 'node:crypto'

export type MachineryStatus = 'active' | 'maintenance' | 'retired';

export class Machinery {
  public id: string;
  name: string;
  brand: string;
  model: string;
  status: MachineryStatus;
  /** horas acumuladas */
  hours_used: number;
  /** fecha de compra */
  purchase_date: Date;

  constructor(
    name: string,
    brand: string,
    model: string,
    status: MachineryStatus,
    hours_used: number,
    purchase_date: Date | string,
    id?: string 
  ) {
    this.id = id ?? crypto.randomUUID();
    this.name = name;
    this.brand = brand;
    this.model = model;
    this.status = status;
    this.hours_used = Number(hours_used) || 0;
    this.purchase_date =
      purchase_date instanceof Date
        ? purchase_date
        : new Date(purchase_date);
  }
}
