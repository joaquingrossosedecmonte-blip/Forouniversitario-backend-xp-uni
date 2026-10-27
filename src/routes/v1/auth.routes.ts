import { Router } from 'express';

import { AuthController } from '../../controllers/auth.controller.js';
import { AuthService } from '../../services/auth.service.js';
import { UsuarioMemoryRepository } from '../../repositories/memory/usuario.memory.repository.js';
import { loginRateLimiter } from '../../middlewares/rate-limit.middleware.js';
import { crearAdminInicial } from './admin-inicial.js';

const router = Router();

const usuarioRepository = new UsuarioMemoryRepository();
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