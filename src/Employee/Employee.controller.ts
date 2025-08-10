


import { Request, Response } from 'express';
import { Employee } from './Employee.entity.js';
import { EmployeePostgresRepository } from './Employee.postgres.repository.js';

// Repository instance
const employeeRepository = new EmployeePostgresRepository();

export class EmployeeController {
    deleteEmployee(arg0: string, deleteEmployee: any) {
      throw new Error("Method not implemented.");
    }
    addEventuality(arg0: string, addEventuality: any) {
      throw new Error("Method not implemented.");
    }

    // Get all employees
    async findAllEmployees(req: Request, res: Response) {
        const employees = await employeeRepository.findAll();
        res.json(employees);
    }

    // Get employee by ID
    async findEmployeeById(req: Request, res: Response) {
        const employeeId = req.params.id;
        const employee = await employeeRepository.findOne(employeeId);
        if (!employee) {
            res.status(404).json({
                errorMessage: 'Employee not found',
                errorCode: 'EMPLOYEE_NOT_FOUND'
            });
            return;
        }
        res.json({ data: employee });
    }

    // Add new employee
    async addEmployee(req: Request, res: Response) {
        const input = req.body;
        const newEmployee = new Employee(
            input.fullName,
            input.role,
            input.seniority,
            input.availableHours,
            input.overtimeHours,
            input.performanceScore,
            input.assignedTasks || []
        );

        await employeeRepository.add(newEmployee);
        res.status(201).json({ data: newEmployee });
    }

    // Update employee details
    async updateEmployee(req: Request, res: Response) {
        const employeeId = req.params.id;
        const updates = req.body;

        const updated = await employeeRepository.update(employeeId, updates);
        if (!updated) {
            res.status(404).json({
                errorMessage: 'Employee not found',
                errorCode: 'EMPLOYEE_NOT_FOUND'
            });
            return;
        }

        res.json({ data: updated });
    }

    // Deactivate employee
    async deactivateEmployee(req: Request, res: Response) {
        const employeeId = req.params.id;
        const deactivated = await employeeRepository.deactivate(employeeId);
        if (!deactivated) {
            res.status(404).json({
                errorMessage: 'Employee not found',
                errorCode: 'EMPLOYEE_NOT_FOUND'
            });
            return;
        }

        res.json({ message: 'Employee deactivated successfully' });
    }

    // Reassign task
    async reassignTask(req: Request, res: Response) {
        const employeeId = req.params.id;
        const { taskIndex, newTask } = req.body;

        const employee = await employeeRepository.findOne(employeeId);
        if (!employee) {
            res.status(404).json({
                errorMessage: 'Employee not found',
                errorCode: 'EMPLOYEE_NOT_FOUND'
            });
            return;
        }

        employee.reassignTask(taskIndex, newTask);
        await employeeRepository.update(employeeId, employee);

        res.json({ message: 'Task reassigned', data: employee });
    }

    // Log overtime
    async logOvertime(req: Request, res: Response) {
        const employeeId = req.params.id;
        const { hours } = req.body;

        const employee = await employeeRepository.findOne(employeeId);
        if (!employee) {
            res.status(404).json({
                errorMessage: 'Employee not found',
                errorCode: 'EMPLOYEE_NOT_FOUND'
            });
            return;
        }

        employee.logOvertime(hours);
        await employeeRepository.update(employeeId, employee);

        res.json({ message: 'Overtime logged', data: employee });
    }

    // Register eventuality
    async registerEventuality(req: Request, res: Response) {
        const employeeId = req.params.id;
        const { type, description, date } = req.body;

        const employee = await employeeRepository.findOne(employeeId);
        if (!employee) {
            res.status(404).json({
                errorMessage: 'Employee not found',
                errorCode: 'EMPLOYEE_NOT_FOUND'
            });
            return;
        }

        await employeeRepository.addEventuality(employeeId, { type, description, date });

        res.json({ message: 'Eventuality registered' });
    }
}
