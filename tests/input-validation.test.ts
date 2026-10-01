
import { describe, it, expect } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';

describe('Validación de entradas', () => {
  it('debe rechazar un correo enviado como objeto', async () => {
    const respuesta = await request(app)
      .post('/api/v1/auth/registro')
      .send({
        nombre: 'Usuario de prueba',
        correo: { $ne: null },
        password: '123456'
      });

    expect(respuesta.status).toBe(400);
  });

  it('debe rechazar un nombre enviado como objeto', async () => {
    const respuesta = await request(app)
      .post('/api/v1/auth/registro')
      .send({
        nombre: { $ne: null },
        correo: 'usuario@universidad.com',
        password: '123456'
      });

    expect(respuesta.status).toBe(400);
  });

  it('debe rechazar una contraseña enviada como objeto', async () => {
    const respuesta = await request(app)
      .post('/api/v1/auth/registro')
      .send({
        nombre: 'Usuario de prueba',
        correo: 'usuario2@universidad.com',
        password: { $ne: null }
      });

    expect(respuesta.status).toBe(400);
  });

  it('debe rechazar un correo como objeto en el login', async () => {
    const respuesta = await request(app)
      .post('/api/v1/auth/login')
      .send({
        correo: { $ne: null },
        password: '123456'
      });

    expect(respuesta.status).toBe(400);
  });

  it('debe rechazar una contraseña como objeto en el login', async () => {
    const respuesta = await request(app)
      .post('/api/v1/auth/login')
      .send({
        correo: 'login@universidad.com',
        password: { $ne: null }
      });

    expect(respuesta.status).toBe(400);
  });
});
