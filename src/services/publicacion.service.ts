import {
  Publicacion,
  PublicacionRepository
} from '../repositories/interfaces/publicacion.repository.js';

import { AppError } from '../errors/app.error.js';

interface CrearPublicacionInput {
  titulo: string;
  contenido: string;
}

export class PublicacionService {
  constructor(
    private readonly publicacionRepository: PublicacionRepository
  ) {}

  async crearPublicacion(
    datos: CrearPublicacionInput
  ): Promise<Publicacion> {
    return this.publicacionRepository.crear({
      titulo: datos.titulo,
      contenido: datos.contenido
    });
  }

  async eliminarPublicacion(
    id: number
  ): Promise<void> {
    const publicacion =
      await this.publicacionRepository.buscarPorId(id);

    if (!publicacion) {
      throw new AppError(
        'La publicación no existe',
        404
      );
    }

    await this.publicacionRepository.eliminar(id);
  }
}