import crypto from 'node:crypto'

export class Plot {
  constructor(
    public name: string,
    public cadastralNumber: string,
    public area: number,
    public location: string,
    public status: 'free' | 'planted' | 'harvested',
    public tasks: {
      type: 'planting' | 'spraying' | 'harvesting',
      date: Date,
      inputs: {
        name: string,
        type: 'seed' | 'fertilizer' | 'agrochemical',
        quantity: number,
        unit: string
      }[]
    }[] = [],
    public rainfall: {
      date: Date,
      millimeters: number
    }[] = [],
    public id: string = crypto.randomUUID()
  ) {}
}