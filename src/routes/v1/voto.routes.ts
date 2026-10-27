import { Router } from 'express';

import { VotoController } from '../../controllers/voto.controller.js';
import { VotoService } from '../../services/voto.service.js';

import {
  votoRepository,
  publicacionRepository
} from './dependencies.js';

const router = Router();

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