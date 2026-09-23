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
  crear(
    datos: CrearPublicacion
  ): Promise<Publicacion>;
}