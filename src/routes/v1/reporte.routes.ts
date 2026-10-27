import { Router } from 'express';

import { ReporteController } from '../../controllers/reporte.controller.js';
import { ReporteService } from '../../services/reporte.service.js';

import {
  reporteRepository,
  publicacionRepository
} from './dependencies.js';

const router = Router();

const reporteService =
  new ReporteService(
    reporteRepository,
    publicacionRepository
  );

const reporteController =
  new ReporteController(reporteService);

router.post(
  '/publicaciones/:publicacionId/reportes',
  reporteController.crear
);

export default router;