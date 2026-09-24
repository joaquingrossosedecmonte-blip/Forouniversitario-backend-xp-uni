import { Request, Response } from 'express';

import { ComentarioService } from '../services/comentario.service.js';
import { AppError } from '../errors/app.error.js';

export class ComentarioController {
  constructor(
    private readonly comentarioService: ComentarioService
  ) {}

  crear = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const publicacionId = Number(
        req.params.publicacionId
      );

      const { contenido } = req.body;

      if (!this.datosValidos(contenido)) {
        res.status(400).json({
          error: 'El contenido es obligatorio'
        });

        return;
      }

      const comentario =
        await this.comentarioService.crearComentario({
          publicacionId,
          contenido
        });

      res.status(201).json(comentario);
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
    contenido: unknown
  ): boolean {
    return Boolean(contenido);
  }
}