import { Router } from 'express';

import { AuthController } from '../../controllers/auth.controller.js';
import { AuthService } from '../../services/auth.service.js';
import { loginRateLimiter } from '../../middlewares/rate-limit.middleware.js';
import { crearAdminInicial } from './admin-inicial.js';
import { usuarioRepository } from './dependencies.js';

const router = Router();

await crearAdminInicial(usuarioRepository);
const authService = new AuthService(usuarioRepository);
const authController = new AuthController(authService);

router.post('/registro', authController.registrar);
router.post(
  '/login',
  loginRateLimiter,
  authController.login
);
router.post('/refresh', authController.refresh);

export default router;