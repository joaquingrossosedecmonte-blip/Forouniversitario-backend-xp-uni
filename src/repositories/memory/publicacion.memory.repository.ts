import {
  CrearPublicacion,
  Publicacion,
  PublicacionRepository
} from '../interfaces/publicacion.repository.js';

export class PublicacionMemoryRepository
  implements PublicacionRepository
{
  private publicaciones: Publicacion[] = [];
  private siguienteId = 1;

  async crear(
    datos: CrearPublicacion
  ): Promise<Publicacion> {
    const publicacion: Publicacion = {
      id: this.siguienteId++,
      ...datos
    };

    this.publicaciones.push(publicacion);

    return publicacion;
  }
}