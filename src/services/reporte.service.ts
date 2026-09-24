import {
  Reporte,
  ReporteRepository
} from '../repositories/interfaces/reporte.repository.js';

import {
  PublicacionRepository
} from '../repositories/interfaces/publicacion.repository.js';

import { AppError } from '../errors/app.error.js';

export class ReporteService {
  constructor(
    private readonly reporteRepository: ReporteRepository,
    private readonly publicacionRepository: PublicacionRepository
  ) {}

  async crearReporte(
    datos: {
      publicacionId: number;
      motivo: string;
    }
  ): Promise<Reporte> {
    const publicacion =
      await this.publicacionRepository.buscarPorId(
        datos.publicacionId
      );

    if (!publicacion) {
      throw new AppError(
        'La publicación no existe',
        404
      );
    }

    return this.reporteRepository.crear({
      publicacionId: datos.publicacionId,
      motivo: datos.motivo
    });
  }
}