import { Router } from "express";
import { EmployeeController } from './employee.controller.js';

export const employeeRouter = Router();
const employeeController = new EmployeeController();

// Rutas principales
employeeRouter.get('/', employeeController.findAllEmployees);
employeeRouter.get('/:id', employeeController.findEmployeeById);
employeeRouter.post('/', sanitizeEmployeeInput, employeeController.addEmployee);
employeeRouter.put('/:id', sanitizeEmployeeInput, employeeController.updateEmployee);
employeeRouter.delete('/:id', employeeController.deleteEmployee);

//  Ruta para registrar horas extra
employeeRouter.post('/:id/overtime', employeeController.logOvertime);

// Ruta para registrar eventualidades
employeeRouter.post('/:id/eventualities', employeeController.addEventuality);

// Middleware de sanitización
function sanitizeEmployeeInput(req: any, res: any, next: any) {
  req.body.sanitizedInput = {
    name: req.body.name,
    position: req.body.position,
    department: req.body.department,
    salary: req.body.salary,
    overtimeHours: req.body.overtimeHours,
    eventualities: req.body.eventualities,
  };

  // Eliminar campos undefined
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}
