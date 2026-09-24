import { Router } from 'express';

import { VotoController } from '../../controllers/voto.controller.js';
import { VotoService } from '../../services/voto.service.js';
import { VotoMemoryRepository } from '../../repositories/memory/voto.memory.repository.js';

import { publicacionRepository } from './dependencies.js';

const router = Router();

const votoRepository =
  new VotoMemoryRepository();

const votoService =
  new VotoService(
    votoRepository,
    publicacionRepository
  );

const votoController =
  new VotoController(votoService);

router.post(
  '/publicaciones/:publicacionId/votos',
  votoController.crear
);

export default router;