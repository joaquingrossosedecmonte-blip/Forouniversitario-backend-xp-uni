import { PublicacionRepository } from '../repositories/interfaces/publicacion.repository.js';
import {
  Comentario,
  ComentarioRepository
} from '../repositories/interfaces/comentario.repository.js';
import { VotoRepository } from '../repositories/interfaces/voto.repository.js';
import { ReporteRepository } from '../repositories/interfaces/reporte.repository.js';
import { UsuarioRepository } from '../repositories/interfaces/usuario.repository.js';

import { AppError } from '../errors/app.error.js';

export interface PublicacionDetalle {
  id: number;
  titulo: string;
  contenido: string;
  creadoEn: string;
  autor: {
    id: number;
    nombre: string;
  } | null;
  comentarios: Comentario[];
  votos: {
    total: number;
    positivos: number;
    negativos: number;
  };
  reportes: number;
}

export interface UsuarioResumen {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  publicaciones: number;
}

export interface ReporteDetalle {
  id: number;
  publicacionId: number;
  motivo: string;
  publicacionTitulo: string | null;
}

export class ConsultaService {
  constructor(
    private readonly publicacionRepository: PublicacionRepository,
    private readonly comentarioRepository: ComentarioRepository,
    private readonly votoRepository: VotoRepository,
    private readonly reporteRepository: ReporteRepository,
    private readonly usuarioRepository: UsuarioRepository
  ) {}

  async listarPublicaciones(): Promise<PublicacionDetalle[]> {
    const [
      publicaciones,
      comentarios,
      votos,
      reportes,
      usuarios
    ] = await Promise.all([
      this.publicacionRepository.listar(),
      this.comentarioRepository.listar(),
      this.votoRepository.listar(),
      this.reporteRepository.listar(),
      this.usuarioRepository.listar()
    ]);

    return publicaciones
      .map((publicacion) => {
        const autor = usuarios.find(
          (usuario) => usuario.id === publicacion.autorId
        );

        const votosPublicacion = votos.filter(
          (voto) => voto.publicacionId === publicacion.id
        );

        const negativos = votosPublicacion.filter(
          (voto) => voto.tipo === 'negativo'
        ).length;

        return {
          id: publicacion.id,
          titulo: publicacion.titulo,
          contenido: publicacion.contenido,
          creadoEn: publicacion.creadoEn,
          autor: autor
            ? { id: autor.id, nombre: autor.nombre }
            : null,
          comentarios: comentarios.filter(
            (comentario) =>
              comentario.publicacionId === publicacion.id
          ),
          votos: {
            total: votosPublicacion.length,
            positivos: votosPublicacion.length - negativos,
            negativos
          },
          reportes: reportes.filter(
            (reporte) => reporte.publicacionId === publicacion.id
          ).length
        };
      })
      .reverse();
  }

  async obtenerPublicacion(
    id: number
  ): Promise<PublicacionDetalle> {
    const publicaciones = await this.listarPublicaciones();

    const publicacion = publicaciones.find(
      (item) => item.id === id
    );

    if (!publicacion) {
      throw new AppError(
        'La publicación no existe',
        404
      );
    }

    return publicacion;
  }

  async listarUsuarios(): Promise<UsuarioResumen[]> {
    const [usuarios, publicaciones] = await Promise.all([
      this.usuarioRepository.listar(),
      this.publicacionRepository.listar()
    ]);

    return usuarios.map((usuario) => ({
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      publicaciones: publicaciones.filter(
        (publicacion) => publicacion.autorId === usuario.id
      ).length
    }));
  }

  async listarReportes(): Promise<ReporteDetalle[]> {
    const [reportes, publicaciones] = await Promise.all([
      this.reporteRepository.listar(),
      this.publicacionRepository.listar()
    ]);

    return reportes
      .map((reporte) => ({
        id: reporte.id,
        publicacionId: reporte.publicacionId,
        motivo: reporte.motivo,
        publicacionTitulo:
          publicaciones.find(
            (publicacion) =>
              publicacion.id === reporte.publicacionId
          )?.titulo ?? null
      }))
      .reverse();
  }

  async obtenerResumen(): Promise<{
    publicaciones: number;
    comentarios: number;
    votos: number;
    usuarios: number;
  }> {
    const [publicaciones, comentarios, votos, usuarios] =
      await Promise.all([
        this.publicacionRepository.listar(),
        this.comentarioRepository.listar(),
        this.votoRepository.listar(),
        this.usuarioRepository.listar()
      ]);

    return {
      publicaciones: publicaciones.length,
      comentarios: comentarios.length,
      votos: votos.length,
      usuarios: usuarios.length
    };
  }
}
