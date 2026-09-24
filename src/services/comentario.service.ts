import {
  Comentario,
  ComentarioRepository
} from '../repositories/interfaces/comentario.repository.js';

import { PublicacionRepository } from '../repositories/interfaces/publicacion.repository.js';

import { AppError } from '../errors/app.error.js';

export class ComentarioService {
  constructor(
    private readonly comentarioRepository: ComentarioRepository,
    private readonly publicacionRepository: PublicacionRepository
  ) {}

  async crearComentario(
    datos: {
      publicacionId: number;
      contenido: string;
    }
  ): Promise<Comentario> {
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

    return this.comentarioRepository.crear({
      publicacionId: datos.publicacionId,
      contenido: datos.contenido
    });
  }
}