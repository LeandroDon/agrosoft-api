import { Router } from 'express';
import { MachineryController } from './machinery.controller.js';

export const machineryRouter = Router();
const c = new MachineryController();

machineryRouter.get('/', c.findAllMachinery.bind(c));
machineryRouter.get('/:id', c.findMachineryById.bind(c));
machineryRouter.post('/', c.addMachinery.bind(c));
machineryRouter.put('/:id', c.updateMachinery.bind(c));
machineryRouter.patch('/:id', c.patchMachinery.bind(c));
machineryRouter.delete('/:id', c.deleteMachinery.bind(c));

export default machineryRouter;


