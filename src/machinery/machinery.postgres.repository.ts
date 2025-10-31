import { Client } from 'pg';
import { Machinery, MachineryStatus } from './machinery.entity.js';
import { MachineryRepository } from './machinery.repository.interface.js';

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'agrosoft',
  password: 'postgres',
  port: 5432,
});

client.connect();

const UPDATABLE_COLUMNS = new Set([
  'name', 'brand', 'model', 'status', 'hours_used', 'purchase_date'
]);

function rowToEntity(row: any): Machinery {
  return new Machinery(
    row.name,
    row.brand,
    row.model,
    row.status as MachineryStatus,
    Number(row.hours_used) || 0,
    row.purchase_date,
    row.id // UUID como string
  );
}

export class MachineryPostgresRepository implements MachineryRepository {
  async findAll(): Promise<Machinery[]> {
    const { rows } = await client.query('SELECT * FROM machinery ORDER BY purchase_date DESC');
    return rows.map(rowToEntity);
  }

  async findByStatus(status: MachineryStatus): Promise<Machinery[]> {
    const { rows } = await client.query('SELECT * FROM machinery WHERE status = $1', [status]);
    return rows.map(rowToEntity);
  }

  async findById(id: string): Promise<Machinery | null> {
  const { rows } = await client.query('SELECT * FROM machinery WHERE id = $1', [id]);
  return rows[0] ? rowToEntity(rows[0]) : null;
}

  async create(entity: Machinery): Promise<Machinery> {
  const query = `
    INSERT INTO machinery (id, name, brand, model, status, hours_used, purchase_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [
    entity.id,
    entity.name,
    entity.brand,
    entity.model,
    entity.status,
    entity.hours_used,
    entity.purchase_date
  ];
  const { rows } = await client.query(query, values);
  return rowToEntity(rows[0]);
}

  async update(id: string, input: Partial<Omit<Machinery, 'id'>>): Promise<Machinery | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    for (const key of Object.keys(input)) {
      if (key in existing && input[key as keyof typeof input] !== undefined) {
        (existing as any)[key] = input[key as keyof typeof input];
      }
    }

    const query = `
      UPDATE machinery
      SET name = $1, brand = $2, model = $3, status = $4, hours_used = $5, purchase_date = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [
      existing.name,
      existing.brand,
      existing.model,
      existing.status,
      existing.hours_used,
      existing.purchase_date,
      existing.id
    ];
    const { rows } = await client.query(query, values);
    return rows[0] ? rowToEntity(rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await client.query('DELETE FROM machinery WHERE id = $1', [id]);
    return (rowCount ?? 0) > 0;
  }

  async report(): Promise<Array<{ status: MachineryStatus; count: number; hours: number }>> {
    const { rows } = await client.query(`
      SELECT status, COUNT(*) AS count, SUM(hours_used)::int AS hours
      FROM machinery
      GROUP BY status
    `);
    return rows;
  }

  async partialUpdate(id: string, updates: Partial<Machinery>): Promise<Machinery | null> {
    const normalized: Record<string, any> = { ...updates };

    if (normalized.hoursUsed !== undefined && normalized.hours_used === undefined) {
      normalized.hours_used = normalized.hoursUsed;
      delete normalized.hoursUsed;
    }
    if (normalized.purchaseDate !== undefined && normalized.purchase_date === undefined) {
      normalized.purchase_date = normalized.purchaseDate;
      delete normalized.purchaseDate;
    }

    const sets: string[] = [];
    const values: any[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(normalized)) {
      if (value === undefined || !UPDATABLE_COLUMNS.has(key)) continue;
      sets.push(`${key} = $${i++}`);
      if (key === 'hours_used') values.push(Number(value) || 0);
      else if (key === 'purchase_date') values.push(value instanceof Date ? value : new Date(value));
      else values.push(value);
    }

    if (sets.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `UPDATE machinery SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`;
    const { rows } = await client.query(query, values);
    return rows[0] ? rowToEntity(rows[0]) : null;
  }
}