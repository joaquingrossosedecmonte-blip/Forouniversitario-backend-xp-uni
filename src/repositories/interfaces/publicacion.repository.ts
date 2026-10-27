export interface Publicacion {
  id: number;
  titulo: string;
  contenido: string;
  autorId?: number;
  creadoEn: string;
}

export interface CrearPublicacion {
  titulo: string;
  contenido: string;
  autorId?: number;
}

export interface PublicacionRepository {
  buscarPorId(
    id: number
  ): Promise<Publicacion | undefined>;

  crear(
    datos: CrearPublicacion
  ): Promise<Publicacion>;

  eliminar(
    id: number
  ): Promise<void>;

  listar(): Promise<Publicacion[]>;
}