export interface Comentario {
  id: number;
  publicacionId: number;
  contenido: string;
}

export interface CrearComentario {
  publicacionId: number;
  contenido: string;
}

export interface ComentarioRepository {
  crear(
    datos: CrearComentario
  ): Promise<Comentario>;
}