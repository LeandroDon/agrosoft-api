import express from 'express';
import { plotRouter } from './src/plot/plot.routes';

const app = express();

app.use(express.json())

app.use('/api/plots', plotRouter);

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})
