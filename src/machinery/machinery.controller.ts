import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { MachineryPostgresRepository } from './machinery.postgres.repository';

const repository = new MachineryPostgresRepository();

const statusEnum = z.enum(['active','maintenance','retired']);
const createSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  status: statusEnum,
  hours_used: z.coerce.number().int().nonnegative().default(0),
  purchase_date: z.coerce.date()
});
const updateSchema = createSchema.partial();

export class MachineryController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try { res.json(await repository.findAll()); } catch (e) { next(e); }
  }

  async getByStatus(req: Request<{ status: string }>, res: Response, next: NextFunction) {
    try {
      const status = statusEnum.parse(req.params.status);
      res.json(await repository.findByStatus(status));
    } catch (e) { next(e); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createSchema.parse(req.body);
      const newMachinery = await repository.create(dto);
      res.status(201).json(newMachinery);
    } catch (e) { next(e); }
  }

  async update(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const id = z.coerce.number().int().positive().parse(req.params.id);
      const dto = updateSchema.parse(req.body);
      const updated = await repository.update(id, dto);
      if (!updated) return res.sendStatus(404);
      res.json(updated);
    } catch (e) { next(e); }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const id = z.coerce.number().int().positive().parse(req.params.id);
      const ok = await repository.delete(id);
      res.sendStatus(ok ? 204 : 404);
    } catch (e) { next(e); }
  }

  async report(_req: Request, res: Response, next: NextFunction) {
    try { res.json(await repository.report()); } catch (e) { next(e); }
  }
}
