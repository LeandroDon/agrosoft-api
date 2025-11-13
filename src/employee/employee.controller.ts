import { Request, Response } from 'express';
import { Employee } from './employee.entity.js';
import { EmployeePostgresRepository } from './employee.postgres.repository.js';

const employeeRepository = new EmployeePostgresRepository();

export class EmployeeController {
    async deleteEmployee(req: Request, res: Response) {
  const employeeId = req.params.id;

  const deleted = await employeeRepository.delete(employeeId);
  if (!deleted) {
    res.status(404).json({
      errorMessage: 'Employee not found',
      errorCode: 'EMPLOYEE_NOT_FOUND'
    });
    return;
  }

  res.json({ message: 'Employee deleted successfully', data: deleted });
}
    addEventuality(arg0: string, addEventuality: any) {
      throw new Error("Method not implemented.");
    }

    async findAllEmployees(req: Request, res: Response) {
        const employees = await employeeRepository.findAll();
        res.json(employees);
    }

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
        res.json(employee);
    }

    async addEmployee(req: Request, res: Response) {
        const input = req.body.sanitizedInput;
        const newEmployee = new Employee(
            input.fullname,
            input.role,
            input.seniority,
            input.availablehours,
            input.salary,
            input.overtimehours,
            input.performancescore,
            input.assignedtasks,
            input.id
        );

        await employeeRepository.add(newEmployee);
        res.status(201).json(newEmployee);
    }

    async updateEmployee(req: Request, res: Response) {
        const employeeId = req.params.id;
const input = req.body.sanitizedInput;

const updatedEmployee = new Employee(
  input.fullname,
  input.role,
  input.seniority,
  input.availablehours,
  input.salary,
  input.overtimehours,
  input.performancescore,
  input.assignedtasks,
  employeeId
);

const updated = await employeeRepository.update(employeeId, updatedEmployee);
        if (!updated) {
            res.status(404).json({
                errorMessage: 'Employee not found',
                errorCode: 'EMPLOYEE_NOT_FOUND'
            });
            return;
        }

        res.json(updated);
    }

    async patchEmployee(req: Request, res: Response) {
  const employeeId = req.params.id;
  const updates = req.body.sanitizedInput;

  const updated = await employeeRepository.partialUpdate(employeeId, updates);
  if (!updated) {
    res.status(404).json({
      errorMessage: 'Employee not found',
      errorCode: 'EMPLOYEE_NOT_FOUND'
    });
    return;
  }

  res.json({ message: 'Employee updated', data: updated });
}

  async deactivateEmployee(req: Request, res: Response) {
  const employeeId = req.params.id;
  const employee = await employeeRepository.findOne(employeeId);

  if (!employee) {
    res.status(404).json({
      errorMessage: 'Employee not found',
      errorCode: 'EMPLOYEE_NOT_FOUND'
    });
    return;
  }

  await employeeRepository.deactivate(employeeId);
  res.json({ message: 'Employee deactivated successfully' });
}

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
