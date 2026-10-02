import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  usuario?: {
    id: number;
    correo: string;
    rol: string;
  };
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Token de autenticación requerido'
    });

    return;
  }

  const token = authorization.substring(7);

  const secret =
    process.env.JWT_SECRET ?? 'secreto-desarrollo';

  try {
    const payload = jwt.verify(token, secret);

    if (
      typeof payload === 'string' ||
      !payload.sub ||
      !payload.correo ||
      !('rol' in payload) ||
      typeof payload.rol !== 'string'
    ) {
      res.status(401).json({
        error: 'Token inválido'
      });

      return;
    }

    req.usuario = {
      id: Number(payload.sub),
      correo: String(payload.correo),
      rol: payload.rol
    };

    next();
  } catch {
    res.status(401).json({
      error: 'Token inválido o expirado'
    });
  }
}