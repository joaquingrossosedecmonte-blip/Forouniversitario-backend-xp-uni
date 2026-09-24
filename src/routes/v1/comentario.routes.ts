import { Router } from 'express';

import { ComentarioController } from '../../controllers/comentario.controller.js';
import { ComentarioService } from '../../services/comentario.service.js';
import { ComentarioMemoryRepository } from '../../repositories/memory/comentario.memory.repository.js';

import { publicacionRepository } from './dependencies.js';

const router = Router();

const comentarioRepository =
  new ComentarioMemoryRepository();

const comentarioService =
  new ComentarioService(
    comentarioRepository,
    publicacionRepository
  );

const comentarioController =
  new ComentarioController(comentarioService);

router.post(
  '/publicaciones/:publicacionId/comentarios',
  comentarioController.crear
);

export default router;