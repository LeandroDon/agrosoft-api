import { PlotRepository } from "./plot.repository.interface.js";
import { Plot } from "./plot.entity.js";
import { Client } from "pg";

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'agrosoft',
  password: 'postgres',
  port: 5432,
});

client.connect();

export class PlotPostgresRepository implements PlotRepository {

  async findAll(): Promise<Plot[] | undefined> {
    try {
      const res = await client.query('SELECT * FROM plots');
      return res.rows as Plot[];
    } catch (error) {
      console.error('Error finding all plots:', error);
      return undefined;
    }
  }

  async findOne(id: string): Promise<Plot | undefined> {
  try {
    const res = await client.query('SELECT * FROM plots WHERE id = $1', [id]);
    return res.rows.length > 0 ? res.rows[0] as Plot : undefined;
  } catch (error) {
    console.error(`Error finding plot by ID (${id}):`, error);
    return undefined;
  }
}

  async add(plot: Plot): Promise<Plot | undefined> {
  try {
    const res = await client.query(
      `INSERT INTO plots (id, name, cadastralnumber, area, location, status, tasks, rainfall)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        plot.id,
        plot.name,
        plot.cadastralNumber,
        plot.area,
        plot.location,
        plot.status,
        JSON.stringify(plot.tasks),
        JSON.stringify(plot.rainfall)
      ]
    );

    return res.rows.length > 0 ? res.rows[0] as Plot : undefined;
  } catch (error) {
    console.error('Error adding plot:', error);
    return undefined;
  }
}

  async update(id: string, updatedPlot: Plot): Promise<Plot | undefined> {
  try {
    const res = await client.query(
      `UPDATE plots SET name = $1, cadastralnumber = $2, area = $3, location = $4, status = $5, tasks = $6, rainfall = $7
       WHERE id = $8 RETURNING *`,
      [
        updatedPlot.name,
        updatedPlot.cadastralNumber,
        updatedPlot.area,
        updatedPlot.location,
        updatedPlot.status,
        JSON.stringify(updatedPlot.tasks),
        JSON.stringify(updatedPlot.rainfall),
        id
      ]
    );

    if (!res.rows || res.rows.length === 0) {
      console.warn(`No plot updated for id: ${id}`);
      return undefined;
    }

    return res.rows[0] as Plot;
  } catch (error) {
    console.error(`Error updating plot (${id}):`, error);
    return undefined;
  }
}

  async partialUpdate(id: string, updates: Partial<Plot>): Promise<Plot | undefined> {
  try {
    const keys = Object.keys(updates);
    if (keys.length === 0) {
      console.warn(`No fields provided for partial update of plot ${id}`);
      return undefined;
    }

    const values = keys.map((key) => {
      const value = (updates as any)[key];
      return typeof value === 'object' ? JSON.stringify(value) : value;
    });

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const query = `UPDATE plots SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;

    const res = await client.query(query, [...values, id]);

    if (!res.rows || res.rows.length === 0) {
      console.warn(`No plot partially updated for id: ${id}`);
      return undefined;
    }

    return res.rows[0] as Plot;
  } catch (error) {
    console.error(`Error partially updating plot (${id}):`, error);
    return undefined;
  }
}

  async delete(id: string): Promise<Plot | undefined> {
    try {
      const res = await client.query('DELETE FROM plots WHERE id = $1 RETURNING *', [id]);

      if (res.rowCount === 0) {
        console.warn(`No plot deleted for id: ${id}`);
        return undefined;
      }

      return res.rows[0] as Plot;
    } catch (error) {
      console.error(`Error deleting plot (${id}):`, error);
      return undefined;
    }
  }
}