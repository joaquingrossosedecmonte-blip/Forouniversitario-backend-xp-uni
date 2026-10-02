import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

router.post(
  '/admin/prueba',
  requireAuth,
  requireRole(['ADMIN']),
  (_req, res) => {
    res.status(200).json({
      mensaje: 'Acceso administrativo permitido'
    });
  }
);

export default router;