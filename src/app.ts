import express from 'express';
import cors from 'cors';

import apiRoutes from './routes/v1/index.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200'
  })
);
app.use(express.json());

app.use('/api/v1', apiRoutes);

export default app;