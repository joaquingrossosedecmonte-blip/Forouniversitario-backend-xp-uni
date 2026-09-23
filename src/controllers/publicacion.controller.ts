import { Request, Response } from 'express';

import { PublicacionService } from '../services/publicacion.service.js';

export class PublicacionController {
  constructor(
    private readonly publicacionService: PublicacionService
  ) {}

  crear = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { titulo, contenido } = req.body;

    if (!titulo || !contenido) {
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
}