import { Request, Response } from 'express';
import { Machinery } from './machinery.entity.js';
import { MachineryPostgresRepository } from './machinery.postgres.repository.js';

const machineryRepository = new MachineryPostgresRepository();

export class MachineryController {

    async findAllMachinery(_req: Request, res: Response) {
    const list = await machineryRepository.findAll();
    res.json(list);
  }

    async findMachineryById(req: Request, res: Response) {
    const machineryId = req.params.id;
    const item = await machineryRepository.findById(machineryId);
    if (!item) {
      return res.status(404).json({
        errorMessage: 'Machinery not found',
        errorCode: 'MACHINERY_NOT_FOUND'
      });
    }
    res.json({ data: item });
  }

    async addMachinery(req: Request, res: Response) {
    const input = req.body;

    const hours =
      input.hours_used ?? input.hoursUsed ?? 0;
    const purchaseDate =
      input.purchase_date ?? input.purchaseDate;

    const newMachinery = new Machinery(
      input.name,
      input.brand,
      input.model,
      input.status,       // 'active' | 'maintenance' | 'retired'
      hours,
      purchaseDate
    );

    await machineryRepository.create(newMachinery);
    res.status(201).json({ data: newMachinery });
  }

   async updateMachinery(req: Request, res: Response) {
    try {
      const machineryId = req.params.id;
      const input = req.body;

      const existing = await machineryRepository.findById(machineryId);
      if (!existing) {
        return res.status(404).json({
          errorMessage: 'Machinery not found',
          errorCode: 'MACHINERY_NOT_FOUND'
        });
      }

      existing.name = input.name;
      existing.brand = input.brand;
      existing.model = input.model;
      existing.status = input.status;
      existing.hours_used = input.hours_used ?? input.hoursUsed ?? existing.hours_used;
      existing.purchase_date = input.purchase_date ?? input.purchaseDate ?? existing.purchase_date;

      const updated = await machineryRepository.update(machineryId, existing);
      if (!updated) {
        return res.status(500).json({
          errorMessage: 'Update failed',
          errorCode: 'MACHINERY_UPDATE_FAILED'
        });
      }

      res.status(200).json({ data: updated });
    } catch (err) {
      console.error('Error updating machinery:', err);
      res.status(500).json({
        errorMessage: 'Internal server error',
        errorCode: 'MACHINERY_UPDATE_ERROR'
      });
    }
  }

  async deleteMachinery(req: Request, res: Response) {
    try {
      const machineryId = req.params.id;
      const deleted = await machineryRepository.delete(machineryId);
      if (!deleted) {
        return res.status(404).json({ errorMessage: 'Machinery not found' });
      }
      res.status(200).json({ data: deleted });
    } catch (err) {
      console.error('Error deleting machinery:', err);
      res.status(500).json({
        errorMessage: 'Error deleting machinery',
        errorCode: 'MACHINERY_DELETE_ERROR'
      });
    }
  }

  async patchMachinery(req: Request, res: Response) {
    try {
      const machineryId = req.params.id;
      const updates = req.body;

      if (updates.hoursUsed !== undefined && updates.hours_used === undefined) {
        updates.hours_used = updates.hoursUsed;
      }
      if (updates.purchaseDate !== undefined && updates.purchase_date === undefined) {
        updates.purchase_date = updates.purchaseDate;
      }

      const updated = await machineryRepository.partialUpdate(machineryId, updates);

      if (!updated) {
        return res.status(404).json({
          errorMessage: 'Machinery not found or no fields updated',
          errorCode: 'MACHINERY_PATCH_FAILED'
        });
      }

      res.status(200).json({ data: updated });
    } catch (err) {
      console.error('Error patching machinery:', err);
      res.status(500).json({
        errorMessage: 'Internal server error',
        errorCode: 'MACHINERY_PATCH_ERROR'
      });
    }
  }
}
