import {
  Voto,
  VotoRepository
} from '../repositories/interfaces/voto.repository.js';

import {
  PublicacionRepository
} from '../repositories/interfaces/publicacion.repository.js';

import { AppError } from '../errors/app.error.js';

export class VotoService {
  constructor(
    private readonly votoRepository: VotoRepository,
    private readonly publicacionRepository: PublicacionRepository
  ) {}

  async crearVoto(
    datos: {
      publicacionId: number;
      tipo: string;
    }
  ): Promise<Voto> {
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

    return this.votoRepository.crear({
      publicacionId: datos.publicacionId,
      tipo: datos.tipo
    });
  }
}