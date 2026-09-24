import {
  CrearReporte,
  Reporte,
  ReporteRepository
} from '../interfaces/reporte.repository.js';

export class ReporteMemoryRepository
  implements ReporteRepository
{
  private reportes: Reporte[] = [];
  private siguienteId = 1;

  async crear(
    datos: CrearReporte
  ): Promise<Reporte> {
    const reporte: Reporte = {
      id: this.siguienteId++,
      ...datos
    };

    this.reportes.push(reporte);

    return reporte;
  }
}