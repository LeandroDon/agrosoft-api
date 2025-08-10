import { EmployeeRepository } from "./Employee.repository.interface.js";
import { Employee } from "./Employee.entity.js";
import { Client } from "pg";

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'employees',
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

    // Get all employees
    async findAll(): Promise<Employee[] | undefined> {
        const res = await client.query('SELECT * FROM employees');
        return res.rows as Employee[] || undefined;
    }

    // Get employee by ID
    async findOne(id: string): Promise<Employee | undefined> {
        const res = await client.query('SELECT * FROM employees WHERE id = $1', [id]);
        return res.rows[0] as Employee || undefined;
    }

    // Add new employee
    async add(employee: Employee): Promise<Employee | undefined> {
        try {
            const res = await client.query(
                `INSERT INTO employees 
                (full_name, role, seniority, available_hours, overtime_hours, performance_score, assigned_tasks) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [
                    employee.fullName,
                    employee.role,
                    employee.seniority,
                    employee.availableHours,
                    employee.overtimeHours,
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

    // Update full employee record
    async update(id: string, employee: Employee): Promise<Employee | undefined> {
        try {
            const res = await client.query(
                `UPDATE employees SET 
                full_name = $1, role = $2, seniority = $3, available_hours = $4, 
                overtime_hours = $5, performance_score = $6, assigned_tasks = $7 
                WHERE id = $8 RETURNING *`,
                [
                    employee.fullName,
                    employee.role,
                    employee.seniority,
                    employee.availableHours,
                    employee.overtimeHours,
                    employee.performanceScore,
                    employee.assignedTasks,
                    id
                ]
            );
            return res.rows[0];
        } catch (error) {
            console.error('Error updating employee:', error);
            return undefined;
        }
    }

    // Partial update (only selected fields)
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

    // Delete (or deactivate) employee
    async delete(id: string): Promise<Employee | undefined> {
        try {
            const res = await client.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
            return res.rows[0];
        } catch (error) {
            console.error('Error deleting employee:', error);
            return undefined;
        }
    }

    // Add overtime (optional helper)
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

    // Register eventuality
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
