import { Plot } from "./plot.entity.js";

export interface PlotRepository {
    findAll(): Promise<Plot[] | undefined>;
    findOne(id: string): Promise<Plot | undefined>;
    add(plot: Plot): Promise<Plot | undefined>;
    update(id: string, plot: Plot): Promise<Plot | undefined>;
    partialUpdate(id: string, updates: Partial<Plot>): Promise<Plot | undefined>;
    delete(id: string): Promise<Plot | undefined>;
}

