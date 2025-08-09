import { PlotRepository } from "./plot.repository.interface.js";
import { Plot } from "./plot.entity.js";
import { Client } from "pg";

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'plots',
    password: 'postgres',
    port: 5432,
});

export class PlotPostgresRepository implements PlotRepository {

    constructor() {
        client.connect();
    }

    async findAll(): Promise<Plot[] | undefined> {
        const res = await client.query('SELECT * FROM plots');
        return res.rows as Plot[] || undefined;
    }

    async findOne(id: string): Promise<Plot | undefined> {
        const res = await client.query('SELECT * FROM plots WHERE id = $1', [id]);
        return res.rows[0] as Plot || undefined;
    }

    async add(plot: Plot): Promise<Plot | undefined> {
        try {
            const res = await client.query(
                'INSERT INTO plots (id, name, cadastralnumber, area, location, status, tasks, rainfall) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
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
            return res.rows[0];
        } catch (error) {
            console.error('Error adding plot:', error);
            return undefined;
        }
    }


    async update(id: string, plot: Plot): Promise<Plot | undefined> {
        try {
            const res = await client.query(
                'UPDATE plots SET name = $1, cadastralnumber = $2, area = $3, location = $4, status = $5, tasks = $6, rainfall = $7 WHERE id = $8 RETURNING *',
                [plot.name, plot.cadastralNumber, plot.area, plot.location, plot.status, plot.tasks, plot.rainfall, id]
            );
            return res.rows[0];
        } catch (error) {
            console.error('Error updating plot:', error);
            return undefined;
        }
    }

    async partialUpdate(id: string, updates: Partial<Plot>): Promise<Plot | undefined> {
        try {
            const keys = Object.keys(updates);
            const values = Object.values(updates);
            const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
            const query = `UPDATE plots SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
            
            const res = await client.query(query, [...values, id]);
            return res.rows[0];
        } catch (error) {
            console.error('Error partially updating plot:', error);
            return undefined;
        }
    }

    async delete(id: string): Promise<Plot | undefined> {
        try {
            const res = await client.query('DELETE FROM plots WHERE id = $1 RETURNING *', [id]);
            return res.rows[0];
        } catch (error) {
            console.error('Error deleting plot:', error);
            return undefined;
        }
    }
}