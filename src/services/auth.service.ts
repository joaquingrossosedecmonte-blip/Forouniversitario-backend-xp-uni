import bcrypt from 'bcrypt';

import {
  Usuario,
  UsuarioRepository
} from '../repositories/interfaces/usuario.repository.js';

interface RegistrarUsuarioInput {
  nombre: string;
  correo: string;
  password: string;
}

export class AuthService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository
  ) {}

  async registrarUsuario(
    datos: RegistrarUsuarioInput
  ): Promise<Usuario> {
    const usuarioExistente =
      await this.usuarioRepository.buscarPorCorreo(
        datos.correo
      );

    if (usuarioExistente) {
      throw new Error('El correo ya está registrado');
    }

    const passwordHash = await bcrypt.hash(
      datos.password,
      10
    );

    return this.usuarioRepository.crear({
      nombre: datos.nombre,
      correo: datos.correo,
      passwordHash
    });
  }
}