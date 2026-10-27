import { PublicacionMemoryRepository } from '../../repositories/memory/publicacion.memory.repository.js';
import { ComentarioMemoryRepository } from '../../repositories/memory/comentario.memory.repository.js';
import { VotoMemoryRepository } from '../../repositories/memory/voto.memory.repository.js';
import { ReporteMemoryRepository } from '../../repositories/memory/reporte.memory.repository.js';
import { UsuarioMemoryRepository } from '../../repositories/memory/usuario.memory.repository.js';

export const publicacionRepository =
  new PublicacionMemoryRepository();

export const comentarioRepository =
  new ComentarioMemoryRepository();

export const votoRepository =
  new VotoMemoryRepository();

export const reporteRepository =
  new ReporteMemoryRepository();

export const usuarioRepository =
  new UsuarioMemoryRepository();
