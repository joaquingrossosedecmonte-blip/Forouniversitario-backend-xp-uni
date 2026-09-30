import { Router } from 'express';

import { PublicacionController } from '../../controllers/publicacion.controller.js';
import { PublicacionService } from '../../services/publicacion.service.js';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

import { publicacionRepository } from './dependencies.js';

const router = Router();

const publicacionService =
  new PublicacionService(publicacionRepository);

const publicacionController =
  new PublicacionController(publicacionService);

router.post(
  '/publicaciones',
  requireAuth,
  publicacionController.crear
);

router.delete(
  '/publicaciones/',
  requireAuth,
  requireRole(['ADMIN']),
  publicacionController.eliminar
);

router.delete(
  '/publicaciones/:publicacionId',
  requireAuth,
  requireRole(['ADMIN']),
  publicacionController.eliminar
);

export default router;