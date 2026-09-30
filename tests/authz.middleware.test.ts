import { describe, it, expect, vi } from 'vitest';
import type {
  Response,
  NextFunction
} from 'express';

import type {
  AuthenticatedRequest
} from '../src/middlewares/auth.middleware.js';

import request from 'supertest';
import jwt from 'jsonwebtoken';

import { requireRole } from '../src/middlewares/role.middleware.js';
import app from '../src/app.js';

const crearToken = (
  usuario: {
    id: number;
    correo: string;
    rol: string;
  }
): string => {
  return jwt.sign(
    {
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol
    },
    process.env.JWT_SECRET ?? 'secreto-desarrollo'
  );
};

describe('requireRole', () => {
  it('debe rechazar a un usuario USER cuando la ruta requiere ADMIN', () => {
    const req = {
      usuario: {
        id: 1,
        correo: 'usuario@universidad.com',
        rol: 'USER'
      }
    } as AuthenticatedRequest;

    const status = vi.fn().mockReturnThis();
    const json = vi.fn();

    const res = {
      status,
      json
    } as unknown as Response;

    const next = vi.fn() as unknown as NextFunction;

    requireRole(['ADMIN'])(req, res, next);

    expect(status).toHaveBeenCalledWith(403);

    expect(json).toHaveBeenCalledWith({
      mensaje: 'No tienes permisos para realizar esta acción'
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('debe permitir a un usuario ADMIN cuando la ruta requiere ADMIN', () => {
    const req = {
      usuario: {
        id: 2,
        correo: 'admin@universidad.com',
        rol: 'ADMIN'
      }
    } as AuthenticatedRequest;

    const status = vi.fn().mockReturnThis();
    const json = vi.fn();

    const res = {
      status,
      json
    } as unknown as Response;

    const next = vi.fn() as unknown as NextFunction;

    requireRole(['ADMIN'])(req, res, next);

    expect(next).toHaveBeenCalled();

    expect(status).not.toHaveBeenCalled();
    expect(json).not.toHaveBeenCalled();
  });

  it('debe rechazar con 401 cuando no existe un usuario autenticado', () => {
    const req = {} as AuthenticatedRequest;

    const status = vi.fn().mockReturnThis();
    const json = vi.fn();

    const res = {
      status,
      json
    } as unknown as Response;

    const next = vi.fn() as unknown as NextFunction;

    requireRole(['ADMIN'])(req, res, next);

    expect(status).toHaveBeenCalledWith(401);

    expect(json).toHaveBeenCalledWith({
      mensaje: 'Usuario no autenticado'
    });

    expect(next).not.toHaveBeenCalled();
  });
});

describe('Autorización integrada en ruta ADMIN', () => {
  it('debe rechazar el acceso sin token', async () => {
    const respuesta = await request(app)
      .post('/api/v1/admin/prueba');

    expect(respuesta.status).toBe(401);
  });

  it('debe rechazar a un usuario USER con 403', async () => {
    const tokenUsuario = crearToken({
      id: 1,
      correo: 'usuario@universidad.com',
      rol: 'USER'
    });

    const respuesta = await request(app)
      .post('/api/v1/admin/prueba')
      .set(
        'Authorization',
        `Bearer ${tokenUsuario}`
      );

    expect(respuesta.status).toBe(403);
  });

  it('debe permitir a un usuario ADMIN con 200', async () => {
    const tokenAdmin = crearToken({
      id: 2,
      correo: 'admin@universidad.com',
      rol: 'ADMIN'
    });

    const respuesta = await request(app)
      .post('/api/v1/admin/prueba')
      .set(
        'Authorization',
        `Bearer ${tokenAdmin}`
      );

    expect(respuesta.status).toBe(200);

    expect(respuesta.body).toEqual({
      mensaje: 'Acceso administrativo permitido'
    });
  });
});

describe(
  'Autorización integrada en eliminación de publicaciones',
  () => {
    it('debe rechazar a un usuario USER con 403', async () => {
      const tokenUsuario = crearToken({
        id: 1,
        correo: 'usuario@universidad.com',
        rol: 'USER'
      });

      const respuesta = await request(app)
        .delete('/api/v1/publicaciones/1')
        .set(
          'Authorization',
          `Bearer ${tokenUsuario}`
        );

      expect(respuesta.status).toBe(403);
    });

    it('debe permitir a un usuario ADMIN eliminar una publicación', async () => {
      const tokenUsuario = crearToken({
        id: 1,
        correo: 'usuario@universidad.com',
        rol: 'USER'
      });

      const crearRespuesta = await request(app)
        .post('/api/v1/publicaciones')
        .set(
          'Authorization',
          `Bearer ${tokenUsuario}`
        )
        .send({
          titulo: 'Publicación de prueba',
          contenido: 'Contenido de prueba'
        });

      expect(crearRespuesta.status).toBe(201);

      const publicacionId = crearRespuesta.body.id;

      const tokenAdmin = crearToken({
        id: 2,
        correo: 'admin@universidad.com',
        rol: 'ADMIN'
      });

      const respuesta = await request(app)
        .delete(
          `/api/v1/publicaciones/${publicacionId}`
        )
        .set(
          'Authorization',
          `Bearer ${tokenAdmin}`
        );

      expect(respuesta.status).toBe(204);
    });
  }
);