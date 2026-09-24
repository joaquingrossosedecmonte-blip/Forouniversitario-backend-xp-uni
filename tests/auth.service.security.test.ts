import bcrypt from 'bcrypt';

import { AuthService } from '../src/services/auth.service.js';
import { UsuarioMemoryRepository } from '../src/repositories/memory/usuario.memory.repository.js';

const repository =
  new UsuarioMemoryRepository();

const authService =
  new AuthService(repository);

const passwordOriginal =
  '123456';

const usuario =
  await authService.registrarUsuario({
    nombre: 'Seguridad',
    correo: 'seguridad@universidad.com',
    password: passwordOriginal
  });

if (usuario.passwordHash === passwordOriginal) {
  throw new Error(
    'La contraseña fue almacenada en texto plano'
  );
}

const passwordValida =
  await bcrypt.compare(
    passwordOriginal,
    usuario.passwordHash
  );

if (!passwordValida) {
  throw new Error(
    'El hash no permite validar la contraseña original'
  );
}

console.log(
  'HT-01: la contraseña fue almacenada mediante hashing seguro'
);