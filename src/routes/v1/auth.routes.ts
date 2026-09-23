import { Router } from 'express';

import { AuthController } from '../../controllers/auth.controller.js';
import { AuthService } from '../../services/auth.service.js';
import { UsuarioMemoryRepository } from '../../repositories/memory/usuario.memory.repository.js';

const router = Router();

const usuarioRepository = new UsuarioMemoryRepository();
const authService = new AuthService(usuarioRepository);
const authController = new AuthController(authService);

router.post('/registro', authController.registrar);

export default router;