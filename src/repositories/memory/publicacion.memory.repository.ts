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

  async buscarPorId(
    id: number
  ): Promise<Publicacion | undefined> {
    return this.publicaciones.find(
      (publicacion) => publicacion.id === id
    );
  }

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