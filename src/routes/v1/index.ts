import { Router } from 'express';

import authRoutes from './auth.routes.js';
import publicacionRoutes from './publicacion.routes.js';
import comentarioRoutes from './comentario.routes.js';
import votoRoutes from './voto.routes.js';
const router = Router();

router.use('/auth', authRoutes);
router.use('/', publicacionRoutes);
router.use('/', comentarioRoutes);
router.use('/', votoRoutes);
export default router;