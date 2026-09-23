import { Router } from 'express';

import { PublicacionController } from '../../controllers/publicacion.controller.js';
import { PublicacionService } from '../../services/publicacion.service.js';
import { PublicacionMemoryRepository } from '../../repositories/memory/publicacion.memory.repository.js';

const router = Router();

const publicacionRepository =
  new PublicacionMemoryRepository();

const publicacionService =
  new PublicacionService(publicacionRepository);

const publicacionController =
  new PublicacionController(publicacionService);

router.post(
  '/publicaciones',
  publicacionController.crear
);

export default router;