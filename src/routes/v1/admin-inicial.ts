import bcrypt from 'bcrypt';

import { UsuarioRepository } from '../../repositories/interfaces/usuario.repository.js';

// Los usuarios viven en memoria y el registro siempre crea rol USER,
// así que se crea un administrador al arrancar para poder probar
// las rutas protegidas por rol (por ejemplo desde Postman).
export async function crearAdminInicial(
  usuarioRepository: UsuarioRepository
): Promise<void> {
  const correo = process.env.ADMIN_CORREO;
  const password = process.env.ADMIN_PASSWORD;

  if (!correo || !password) {
    return;
  }

  const existente =
    await usuarioRepository.buscarPorCorreo(correo);

  if (existente) {
    return;
  }

  await usuarioRepository.crear({
    nombre: process.env.ADMIN_NOMBRE ?? 'Administrador',
    correo,
    passwordHash: await bcrypt.hash(password, 10),
    rol: 'ADMIN'
  });
}
