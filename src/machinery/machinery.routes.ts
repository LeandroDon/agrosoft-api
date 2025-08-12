import { Router } from 'express';
import { MachineryController } from './machinery.controller';

const router = Router();
const c = new MachineryController();

router.get('/', c.getAll.bind(c));
router.get('/status/:status', c.getByStatus.bind(c));
router.post('/', c.create.bind(c));
router.put('/:id', c.update.bind(c));
router.delete('/:id', c.delete.bind(c));
router.get('/report', c.report.bind(c));

export default router;
