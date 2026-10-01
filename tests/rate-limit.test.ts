import { describe, it, expect } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';

describe('Rate limiting del login', () => {
  it('debe bloquear temporalmente después de demasiados intentos', async () => {
    const respuestas = [];

    for (let i = 0; i < 6; i++) {
      const respuesta = await request(app)
        .post('/api/v1/auth/login')
        .send({
          correo: 'usuario@universidad.com',
          password: 'password-incorrecta'
        });

      respuestas.push(respuesta);
    }

    const ultimaRespuesta = respuestas.at(-1);

    expect(ultimaRespuesta?.status).toBe(429);
  });
    
  });
