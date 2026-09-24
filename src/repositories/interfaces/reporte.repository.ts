export interface Reporte {
  id: number;
  publicacionId: number;
  motivo: string;
}

export interface CrearReporte {
  publicacionId: number;
  motivo: string;
}

export interface ReporteRepository {
  crear(
    datos: CrearReporte
  ): Promise<Reporte>;
}