import { Request, Response } from 'express';
import { Plot } from './plot.entity.js';
import { PlotPostgresRepository } from './plot.postgres.repository.js';

const plotRepository = new PlotPostgresRepository();

export class PlotController {

  async findAllPlots(req: Request, res: Response) {
    const plots = await plotRepository.findAll();
    res.json(plots);
  }

  async findPlotById(req: Request, res: Response) {
    const plotId = req.params.id;
    const plot = await plotRepository.findOne(plotId);
    if (!plot) {
      res.status(404).json({
        errorMessage: 'Plot not found',
        errorCode: 'PLOT_NOT_FOUND'
      });
      return;
    }
    res.json({ data: plot });
  }

  async addPlot(req: Request, res: Response) {
    const input = req.body;
    const newPlot = new Plot(
      input.name,
      input.cadastralNumber,
      input.area,
      input.location,
      input.status,
      input.tasks,
      input.rainfall
    );
    await plotRepository.add(newPlot);
    res.status(201).json({ data: newPlot });
  }

  async updatePlot(req: Request, res: Response) {
  try {
    const plotId = req.params.id;
    const input = req.body;

    const existingPlot = await plotRepository.findOne(plotId);
    if (!existingPlot) {
      return res.status(404).json({
        errorMessage: 'Plot not found',
        errorCode: 'PLOT_NOT_FOUND'
      });
    }

    existingPlot.name = input.name;
    existingPlot.cadastralNumber = input.cadastralNumber;
    existingPlot.area = input.area;
    existingPlot.location = input.location;
    existingPlot.status = input.status;
    existingPlot.tasks = input.tasks;
    existingPlot.rainfall = input.rainfall;

    const updated = await plotRepository.update(plotId, existingPlot);


    if (!updated) {
      return res.status(500).json({
        errorMessage: 'Update failed',
        errorCode: 'PLOT_UPDATE_FAILED'
      });
    }

    res.status(200).json({ data: updated });

  } catch (err) {
    console.error('Error updating plot:', err);
    res.status(500).json({
      errorMessage: 'Internal server error',
      errorCode: 'PLOT_UPDATE_ERROR'
    });
  }
}

  async deletePlot(req: Request, res: Response) {
    try {
      const plotId = req.params.id;
      const deleted = await plotRepository.delete(plotId);
      if (!deleted) {
        res.status(404).json({ errorMessage: 'Plot not found' });
        return;
      }
      res.status(200).json({ data: deleted });
    } catch (err) {
      console.error('Error deleting plot:', err);
      res.status(500).json({
        errorMessage: 'Error deleting plot',
        errorCode: 'PLOT_DELETE_ERROR'
      });
    }
  }
async patchPlot(req: Request, res: Response) {
  try {
    const plotId = req.params.id;
    const updates = req.body;

    const updated = await plotRepository.partialUpdate(plotId, updates);

    if (!updated) {
      return res.status(404).json({
        errorMessage: 'Plot not found or no fields updated',
        errorCode: 'PLOT_PATCH_FAILED'
      });
    }

    res.status(200).json({ data: updated });

  } catch (err) {
    console.error('Error patching plot:', err);
    res.status(500).json({
      errorMessage: 'Internal server error',
      errorCode: 'PLOT_PATCH_ERROR'
    });
  }
}
}