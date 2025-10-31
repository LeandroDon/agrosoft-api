import { EmployeeRepository } from "./employee.repository.interface.js";
import { Employee } from "./employee.entity.js";
import { Client } from "pg";

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'agrosoft',
    password: 'postgres',
    port: 5432,
});

export class EmployeePostgresRepository implements EmployeeRepository {
    deactivate(employeeId: any) {
        throw new Error('Method not implemented.');
    }

    constructor() {
        client.connect();
    }

    async findAll(): Promise<Employee[] | undefined> {
        const res = await client.query('SELECT * FROM employees');
        return res.rows as Employee[] || undefined;
    }

    async findOne(id: string): Promise<Employee | undefined> {
        const res = await client.query('SELECT * FROM employees WHERE id = $1', [id]);
        return res.rows[0] as Employee || undefined;
    }

    async add(employee: Employee): Promise<Employee | undefined> {
        try {
            const res = await client.query(
                `INSERT INTO employees (
                id, fullname, role, seniority, availablehours,
                overtimehours, salary, performancescore, assignedtasks
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                [
                    employee.id,
                    employee.fullName,
                    employee.role,
                    employee.seniority,
                    employee.availableHours,
                    employee.overtimeHours,
                    employee.salary,
                    employee.performanceScore,
                    employee.assignedTasks
            ]
    );
            return res.rows[0];
        } catch (error) {
            console.error('Error adding employee:', error);
            return undefined;
        }
    }

    async update(id: string, employee: Employee): Promise<Employee | undefined> {
        try {
            const res = await client.query(
                `UPDATE employees SET 
                fullname = $1, role = $2, seniority = $3, availablehours = $4, salary = $5, 
                overtimehours = $6, performancescore = $7, assignedtasks = $8 
                WHERE id = $9 RETURNING *`,
                [
                    employee.fullName,
                    employee.role,
                    employee.seniority,
                    employee.availableHours,
                    employee.salary,
                    employee.overtimeHours,
                    employee.performanceScore,
                    employee.assignedTasks,
                    employee.id
                ]
            );
            return res.rows[0];
        } catch (error) {
            console.error('Error updating employee:', error);
            return undefined;
        }
    }

    async partialUpdate(id: string, updates: Partial<Employee>): Promise<Employee | undefined> {
        try {
            const keys = Object.keys(updates);
            const values = Object.values(updates);
            const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
            const query = `UPDATE employees SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;

            const res = await client.query(query, [...values, id]);
            return res.rows[0];
        } catch (error) {
            console.error('Error partially updating employee:', error);
            return undefined;
        }
    }

    async delete(id: string): Promise<Employee | undefined> {
        try {
            const res = await client.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
            return res.rows[0];
        } catch (error) {
            console.error('Error deleting employee:', error);
            return undefined;
        }
    }

    async logOvertime(id: string, hours: number): Promise<Employee | undefined> {
        try {
            const res = await client.query(
                `UPDATE employees SET overtime_hours = overtime_hours + $1 WHERE id = $2 RETURNING *`,
                [hours, id]
            );
            return res.rows[0];
        } catch (error) {
            console.error('Error logging overtime:', error);
            return undefined;
        }
    }

    async addEventuality(employeeId: string, event: { type: string; description: string; date: string }): Promise<boolean> {
        try {
            await client.query(
                `INSERT INTO eventualities (employee_id, type, description, date) VALUES ($1, $2, $3, $4)`,
                [employeeId, event.type, event.description, event.date]
            );
            return true;
        } catch (error) {
            console.error('Error adding eventuality:', error);
            return false;
        }
    }
}
