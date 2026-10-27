import express, { NextFunction, Request, Response } from 'express';
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

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

app.use(
  (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (error instanceof SyntaxError) {
      res.status(400).json({
        error: 'El cuerpo de la petición no es un JSON válido'
      });

      return;
    }

    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
);

export default app;
