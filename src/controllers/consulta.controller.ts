import { Request, Response } from 'express';

import { ConsultaService } from '../services/consulta.service.js';
import { AppError } from '../errors/app.error.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export class ConsultaController {
  constructor(
    private readonly consultaService: ConsultaService
  ) {}

  listarPublicaciones = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    const publicaciones =
      await this.consultaService.listarPublicaciones();

    res.status(200).json(publicaciones);
  };

  obtenerPublicacion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const publicacionId = Number(
        req.params.publicacionId
      );

      if (!Number.isInteger(publicacionId)) {
        res.status(400).json({
          error: 'El id de la publicación no es válido'
        });

        return;
      }

      const publicacion =
        await this.consultaService.obtenerPublicacion(
          publicacionId
        );

      res.status(200).json(publicacion);
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

  listarUsuarios = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    const usuarios =
      await this.consultaService.listarUsuarios();

    res.status(200).json(usuarios);
  };

  listarReportes = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    const reportes =
      await this.consultaService.listarReportes();

    res.status(200).json(reportes);
  };

  obtenerResumen = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    const resumen =
      await this.consultaService.obtenerResumen();

    res.status(200).json(resumen);
  };

  obtenerPerfil = (
    req: AuthenticatedRequest,
    res: Response
  ): void => {
    res.status(200).json(req.usuario);
  };
}
