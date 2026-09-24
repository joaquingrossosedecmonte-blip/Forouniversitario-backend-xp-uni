export interface Voto {
  id: number;
  publicacionId: number;
  tipo: string;
}

export interface CrearVoto {
  publicacionId: number;
  tipo: string;
}

export interface VotoRepository {
  crear(
    datos: CrearVoto
  ): Promise<Voto>;
}