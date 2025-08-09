import express from 'express';
import { plotRouter } from './src/plot/plot.routes';
import { employeeRouter } from './Employee/Employee.routes.js';

const app = express();

app.use(express.json())

app.use('/api/plots', plotRouter);
app.use('/api/employees', employeeRouter);

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})
