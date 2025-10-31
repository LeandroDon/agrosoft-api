import { Router } from "express";
import { EmployeeController } from './employee.controller.js';

export const employeeRouter = Router();
const employeeController = new EmployeeController();

employeeRouter.get('/', employeeController.findAllEmployees);
employeeRouter.get('/:id', employeeController.findEmployeeById);
employeeRouter.post('/', sanitizeEmployeeInput, employeeController.addEmployee);
employeeRouter.put('/:id', sanitizeEmployeeInput, employeeController.updateEmployee);
employeeRouter.patch('/:id', employeeController.patchEmployee);
employeeRouter.delete('/:id', employeeController.deleteEmployee);

employeeRouter.post('/:id/overtime', employeeController.logOvertime);

employeeRouter.post('/:id/eventualities', employeeController.addEventuality);

function sanitizeEmployeeInput(req: any, res: any, next: any) {
  req.body.sanitizedInput = {
    fullName: req.body.fullName,
    role: req.body.role,
    seniority: req.body.seniority,
    availableHours: req.body.availableHours,
    salary: req.body.salary,
    overtimeHours: req.body.overtimeHours,
    performanceScore: req.body.performanceScore,
    assignedTasks: req.body.assignedTasks,
    id: req.body.id
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}