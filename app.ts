import express from 'express';
import { plotRouter } from './src/plot/plot.routes';
import { employeeRouter } from './src/employee/employee.routes';
import {machineryRouter } from './src/machinery/machinery.routes';

const app = express();

app.use(express.json())

app.use('/api/plots', plotRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/machinery', machineryRouter);


app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})


