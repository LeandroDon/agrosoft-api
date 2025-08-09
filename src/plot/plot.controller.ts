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

    updatePlot(req: Request, res: Response) {
        // Logic to update an existing plot
    }

    deletePlot(req: Request, res: Response) {
        // Logic to delete a plot
    }
}