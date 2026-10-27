import {
  Comentario,
  ComentarioRepository,
  CrearComentario
} from '../interfaces/comentario.repository.js';

export class ComentarioMemoryRepository
  implements ComentarioRepository
{
  private comentarios: Comentario[] = [];
  private siguienteId = 1;

  async crear(
    datos: CrearComentario
  ): Promise<Comentario> {
    const comentario: Comentario = {
      id: this.siguienteId++,
      ...datos,
      creadoEn: new Date().toISOString()
    };

    this.comentarios.push(comentario);

    return comentario;
  }

  async listar(): Promise<Comentario[]> {
    return [...this.comentarios];
  }
}
