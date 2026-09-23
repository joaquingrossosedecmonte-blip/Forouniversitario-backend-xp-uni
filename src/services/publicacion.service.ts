import {
  Publicacion,
  PublicacionRepository
} from '../repositories/interfaces/publicacion.repository.js';

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
}