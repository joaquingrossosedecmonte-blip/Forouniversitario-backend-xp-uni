import { Router } from 'express';

import authRoutes from './auth.routes.js';
import publicacionRoutes from './publicacion.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', publicacionRoutes);

export default router;