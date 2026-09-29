import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
  Usuario,
  UsuarioRepository
} from '../repositories/interfaces/usuario.repository.js';

import { AppError } from '../errors/app.error.js';

interface RegistrarUsuarioInput {
  nombre: string;
  correo: string;
  password: string;
}

interface IniciarSesionInput {
  correo: string;
  password: string;
}

export class AuthService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository
  ) { }

  async registrarUsuario(
    datos: RegistrarUsuarioInput
  ): Promise<Usuario> {
    const usuarioExistente =
      await this.usuarioRepository.buscarPorCorreo(
        datos.correo
      );

    if (usuarioExistente) {
      throw new AppError(
        'El correo ya está registrado',
        409
      );
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

  async iniciarSesion(
    datos: IniciarSesionInput
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    usuario: Usuario;
  }> {
    const usuario =
      await this.usuarioRepository.buscarPorCorreo(
        datos.correo
      );

    if (!usuario) {
      throw new AppError(
        'Credenciales inválidas',
        401
      );
    }

    const passwordValida = await bcrypt.compare(
      datos.password,
      usuario.passwordHash
    );

    if (!passwordValida) {
      throw new AppError(
        'Credenciales inválidas',
        401
      );
    }

    const accessToken = this.generarAccessToken(usuario);
    const refreshToken = this.generarRefreshToken(usuario);

    return {
      accessToken,
      refreshToken,
      usuario
    };
  }
  async renovarAccessToken(
    refreshToken: string
  ): Promise<string> {
    const secret =
      process.env.JWT_REFRESH_SECRET ??
      process.env.JWT_SECRET ??
      'secreto-desarrollo';

    try {
      const payload = jwt.verify(
        refreshToken,
        secret
      );

      if (
        typeof payload === 'string' ||
        !payload.sub
      ) {
        throw new AppError(
          'Refresh token inválido',
          401
        );
      }

      const usuario =
        await this.usuarioRepository.buscarPorCorreo(
          payload.correo as string
        );

      if (!usuario) {
        throw new AppError(
          'Usuario no encontrado',
          401
        );
      }

      return this.generarAccessToken(usuario);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'Refresh token inválido o expirado',
        401
      );
    }
  }
  private generarAccessToken(usuario: Usuario): string {
    const secret =
      process.env.JWT_SECRET ?? 'secreto-desarrollo';

    return jwt.sign(
      {
        sub: usuario.id,
        correo: usuario.correo
      },
      secret,
      {
        expiresIn: '15m'
      }
    );
  }

  private generarRefreshToken(usuario: Usuario): string {
    const secret =
      process.env.JWT_REFRESH_SECRET ??
      process.env.JWT_SECRET ??
      'secreto-desarrollo';

    return jwt.sign(
      {
        sub: usuario.id,
        correo: usuario.correo
      },
      secret,
      {
        expiresIn: '7d'
      }
    );
  }
}