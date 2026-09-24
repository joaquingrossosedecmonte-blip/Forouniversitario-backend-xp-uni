export interface Publicacion {
  id: number;
  titulo: string;
  contenido: string;
}

export interface CrearPublicacion {
  titulo: string;
  contenido: string;
}

export interface PublicacionRepository {
  buscarPorId(
    id: number
  ): Promise<Publicacion | undefined>;

  crear(
    datos: CrearPublicacion
  ): Promise<Publicacion>;
}