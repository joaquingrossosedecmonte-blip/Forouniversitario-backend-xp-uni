import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import request from 'supertest';

import app from '../../src/app.js';

let respuestaPublicacion: request.Response;

Given(
  'que existe un usuario registrado para crear publicaciones',
  async function () {
    await request(app)
      .post('/api/v1/auth/registro')
      .send({
        nombre: 'Pedro',
        correo: 'publicacion@universidad.com',
        password: '123456'
      });
  }
);

When(
  'el estudiante crea una publicación con título {string} y contenido {string}',
  async function (
    titulo: string,
    contenido: string
  ) {
    respuestaPublicacion = await request(app)
      .post('/api/v1/publicaciones')
      .send({
        titulo,
        contenido
      });
  }
);

When(
  'el estudiante intenta crear una publicación sin título y con contenido {string}',
  async function (contenido: string) {
    respuestaPublicacion = await request(app)
      .post('/api/v1/publicaciones')
      .send({
        contenido
      });
  }
);

When(
  'el estudiante intenta crear una publicación con título {string} y sin contenido',
  async function (titulo: string) {
    respuestaPublicacion = await request(app)
      .post('/api/v1/publicaciones')
      .send({
        titulo
      });
  }
);

Then(
  'la publicación debe crearse correctamente',
  async function () {
    if (!respuestaPublicacion.body.id) {
      throw new Error(
        'La publicación no fue creada correctamente'
      );
    }
  }
);

Then(
  'la publicación debe ser rechazada',
  async function () {
    if (respuestaPublicacion.status < 400) {
      throw new Error(
        'La publicación debería haber sido rechazada'
      );
    }
  }
);

Then(
  'la respuesta de la publicación debe tener código {int}',
  async function (codigoEsperado: number) {
    if (respuestaPublicacion.status !== codigoEsperado) {
      throw new Error(
        `Se esperaba ${codigoEsperado}, pero se recibió ${respuestaPublicacion.status}`
      );
    }
  }
);