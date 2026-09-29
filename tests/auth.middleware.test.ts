import { describe, it, expect } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';

describe('requireAuth', () => {
  it('debe rechazar una petición sin token JWT', async () => {
    const respuesta = await request(app)
      .post('/api/v1/publicaciones')
      .send({
        titulo: 'Publicación protegida',
        contenido: 'Contenido de prueba'
      });

    expect(respuesta.status).toBe(401);
  });
});