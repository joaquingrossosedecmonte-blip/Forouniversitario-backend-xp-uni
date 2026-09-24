import { Request, Response } from 'express';

import { ReporteService } from '../services/reporte.service.js';
import { AppError } from '../errors/app.error.js';

export class ReporteController {
  constructor(
    private readonly reporteService: ReporteService
  ) {}

  crear = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const publicacionId = Number(
        req.params.publicacionId
      );

      const { motivo } = req.body;

      if (!this.datosValidos(motivo)) {
        res.status(400).json({
          error: 'El motivo es obligatorio'
        });

        return;
      }

      const reporte =
        await this.reporteService.crearReporte({
          publicacionId,
          motivo
        });

      res.status(201).json(reporte);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.message
        });

        return;
      }

      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  };

  private datosValidos(
    motivo: unknown
  ): boolean {
    return Boolean(motivo);
  }
}