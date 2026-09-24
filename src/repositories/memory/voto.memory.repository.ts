import {
  CrearVoto,
  Voto,
  VotoRepository
} from '../interfaces/voto.repository.js';

export class VotoMemoryRepository
  implements VotoRepository
{
  private votos: Voto[] = [];
  private siguienteId = 1;

  async crear(
    datos: CrearVoto
  ): Promise<Voto> {
    const voto: Voto = {
      id: this.siguienteId++,
      ...datos
    };

    this.votos.push(voto);

    return voto;
  }
}