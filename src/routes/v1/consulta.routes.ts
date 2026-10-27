import { Router } from 'express';

import { ConsultaController } from '../../controllers/consulta.controller.js';
import { ConsultaService } from '../../services/consulta.service.js';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

import {
  comentarioRepository,
  publicacionRepository,
  reporteRepository,
  usuarioRepository,
  votoRepository
} from './dependencies.js';

const router = Router();

const consultaService =
  new ConsultaService(
    publicacionRepository,
    comentarioRepository,
    votoRepository,
    reporteRepository,
    usuarioRepository
  );

const consultaController =
  new ConsultaController(consultaService);

router.get(
  '/resumen',
  consultaController.obtenerResumen
);

router.get(
  '/publicaciones',
  consultaController.listarPublicaciones
);

router.get(
  '/publicaciones/:publicacionId',
  consultaController.obtenerPublicacion
);

router.get(
  '/auth/perfil',
  requireAuth,
  consultaController.obtenerPerfil
);

router.get(
  '/usuarios',
  requireAuth,
  requireRole(['ADMIN']),
  consultaController.listarUsuarios
);

router.get(
  '/reportes',
  requireAuth,
  requireRole(['ADMIN']),
  consultaController.listarReportes
);

export default router;
