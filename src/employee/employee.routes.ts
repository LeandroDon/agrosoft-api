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
  const sanitizedInput: any = {
    fullname: req.body.fullname,
    role: req.body.role,
    seniority: req.body.seniority,
    availablehours: req.body.availablehours,
    salary: req.body.salary,
    overtimehours: req.body.overtimehours,
    performancescore: req.body.performancescore,
    assignedtasks: req.body.assignedtasks
  };

  if (req.method === 'POST') {
    sanitizedInput.id = req.body.id ?? crypto.randomUUID();
  }

  Object.keys(sanitizedInput).forEach((key) => {
    if (sanitizedInput[key] === undefined) {
      delete sanitizedInput[key];
    }
  });

  req.body.sanitizedInput = sanitizedInput;
  next();
}