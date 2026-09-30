import { NextFunction, Response } from 'express';

import { AuthenticatedRequest } from './auth.middleware.js';

export function requireRole(rolesPermitidos: string[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const rolUsuario = req.usuario?.rol;

    if (!rolUsuario) {
      res.status(401).json({
        mensaje: 'Usuario no autenticado'
      });

      return;
    }

    if (!rolesPermitidos.includes(rolUsuario)) {
      res.status(403).json({
        mensaje: 'No tienes permisos para realizar esta acción'
      });

      return;
    }

    next();
  };
}