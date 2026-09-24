import { Request, Response } from 'express';

import { VotoService } from '../services/voto.service.js';
import { AppError } from '../errors/app.error.js';

export class VotoController {
  constructor(
    private readonly votoService: VotoService
  ) {}

  crear = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const publicacionId = Number(
        req.params.publicacionId
      );

      const { tipo } = req.body;

      if (!this.datosValidos(tipo)) {
        res.status(400).json({
          error: 'El tipo de voto es obligatorio'
        });

        return;
      }

      const voto =
        await this.votoService.crearVoto({
          publicacionId,
          tipo
        });

      res.status(201).json(voto);
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
    tipo: unknown
  ): boolean {
    return Boolean(tipo);
  }
}