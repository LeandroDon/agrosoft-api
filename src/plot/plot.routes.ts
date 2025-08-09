import { Router } from "express";
import { PlotController } from './plot.controller.js';

export const plotRouter = Router();
const plotController = new PlotController();

plotRouter.get('/', plotController.findAllPlots);
plotRouter.get('/:id', plotController.findPlotById);
plotRouter.post('/', sanitizePlotInput, plotController.addPlot);
plotRouter.put('/:id', sanitizePlotInput, plotController.updatePlot);
plotRouter.delete('/:id', plotController.deletePlot);  

function sanitizePlotInput(req:any, res:any, next:any) {

  req.body.sanitizedInput = {
    name: req.body.name,
    cadastralNumber: req.body.cadastralNumber,
    area: req.body.area,
    location: req.body.location,
    status: req.body.status,
    tasks: req.body.tasks,
    rainfall: req.body.rainfall,
  }
  
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

