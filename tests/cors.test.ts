import { describe, it, expect } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';

describe('Configuración CORS', () => {
  it('debe permitir el origen autorizado', async () => {
    const respuesta = await request(app)
      .options('/api/v1/publicaciones')
      .set('Origin', 'http://localhost:4200')
      .set('Access-Control-Request-Method', 'POST');

    expect(respuesta.headers['access-control-allow-origin'])
      .toBe('http://localhost:4200');
  });

  it('no debe permitir un origen no autorizado', async () => {
    const respuesta = await request(app)
      .options('/api/v1/publicaciones')
      .set('Origin', 'http://sitio-no-autorizado.com')
      .set('Access-Control-Request-Method', 'POST');

    expect(respuesta.headers['access-control-allow-origin'])
      .not.toBe('http://sitio-no-autorizado.com');
  });
});