import { Request, Response } from 'express';

import { AuthService } from '../services/auth.service.js';

export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  registrar = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { nombre, correo, password } = req.body;

      if (!nombre || !correo || !password) {
        res.status(400).json({
          error: 'Nombre, correo y contraseña son obligatorios'
        });

        return;
      }

      const usuario = await this.authService.registrarUsuario({
        nombre,
        correo,
        password
      });

      res.status(201).json({
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'El correo ya está registrado'
      ) {
        res.status(409).json({
          error: error.message
        });

        return;
      }

      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  };
}