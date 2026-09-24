import { Router } from 'express';

import authRoutes from './auth.routes.js';
import publicacionRoutes from './publicacion.routes.js';
import comentarioRoutes from './comentario.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', publicacionRoutes);
router.use('/', comentarioRoutes);

export default router;