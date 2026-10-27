import { Router } from 'express';

import authRoutes from './auth.routes.js';
import publicacionRoutes from './publicacion.routes.js';
import comentarioRoutes from './comentario.routes.js';
import votoRoutes from './voto.routes.js';
import reporteRoutes from './reporte.routes.js';
import adminRoutes from './admin.routes.js';
import consultaRoutes from './consulta.routes.js';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    mensaje: 'API Foro Universitario funcionando',
    version: 'v1'
  });
});

router.use('/auth', authRoutes);
router.use('/', publicacionRoutes);
router.use('/', comentarioRoutes);
router.use('/', votoRoutes);
router.use('/', reporteRoutes);
router.use('/', adminRoutes);
router.use('/', consultaRoutes);

export default router;
