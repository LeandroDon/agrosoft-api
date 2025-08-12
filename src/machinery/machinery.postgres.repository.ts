import { Pool } from 'pg';
import { Machinery, MachineryRepository, MachineryStatus } from './machinery.repository';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export class MachineryPostgresRepository implements MachineryRepository {
  async findAll(): Promise<Machinery[]> {
    const { rows } = await pool.query('SELECT * FROM machinery ORDER BY id');
    return rows;
  }

  async findByStatus(status: MachineryStatus) {
    const { rows } = await pool.query('SELECT * FROM machinery WHERE status = $1', [status]);
    return rows;
  }

  async create(input: Omit<Machinery, 'id'>) {
    const q = `INSERT INTO machinery (name,brand,model,status,hours_used,purchase_date)
               VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
    const v = [input.name, input.brand, input.model, input.status, input.hours_used, input.purchase_date];
    const { rows } = await pool.query(q, v);
    return rows[0];
  }

  async update(id: number, input: Partial<Omit<Machinery, 'id'>>) {
    const current = await pool.query('SELECT * FROM machinery WHERE id=$1', [id]);
    if (!current.rowCount) return null;
    const m = { ...current.rows[0], ...input };
    const { rows } = await pool.query(
      `UPDATE machinery SET name=$1,brand=$2,model=$3,status=$4,hours_used=$5,purchase_date=$6 WHERE id=$7 RETURNING *`,
      [m.name, m.brand, m.model, m.status, m.hours_used, m.purchase_date, id]
    );
    return rows[0];
  }

  async delete(id: number) {
    const r = await pool.query('DELETE FROM machinery WHERE id=$1', [id]);
    return r.rowCount > 0;
  }

  async report() {
    const { rows } = await pool.query(
      `SELECT status, COUNT(*)::int as count, COALESCE(SUM(hours_used),0)::int as hours
       FROM machinery GROUP BY status ORDER BY status`
    );
    return rows;
  }
}
