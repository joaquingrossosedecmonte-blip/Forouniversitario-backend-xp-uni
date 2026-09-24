import { Request, Response } from 'express';

import { PublicacionService } from '../services/publicacion.service.js';
import { AppError } from '../errors/app.error.js';

export class PublicacionController {
  constructor(
    private readonly publicacionService: PublicacionService
  ) {}

  crear = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { titulo, contenido } = req.body;

    if (!this.datosValidos(titulo, contenido)) {
      res.status(400).json({
        error: 'Título y contenido son obligatorios'
      });

      return;
    }

    const publicacion =
      await this.publicacionService.crearPublicacion({
        titulo,
        contenido
      });

    res.status(201).json(publicacion);
  };

  eliminar = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const publicacionId = Number(
        req.params.publicacionId
      );

      if (!Number.isInteger(publicacionId)) {
        res.status(400).json({
          error: 'El id de la publicación es obligatorio'
        });

        return;
      }

      await this.publicacionService.eliminarPublicacion(
        publicacionId
      );

      res.status(204).send();
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
    titulo: unknown,
    contenido: unknown
  ): boolean {
    return Boolean(titulo && contenido);
  }
}
