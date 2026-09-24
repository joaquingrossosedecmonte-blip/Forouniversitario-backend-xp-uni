import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import request from 'supertest';

import app from '../../src/app.js';

let respuestaComentario: request.Response;

Given(
  'que existe una publicación para comentar',
  async function () {
    await request(app)
      .post('/api/v1/publicaciones')
      .send({
        titulo: 'Publicación para comentar',
        contenido: 'Contenido de prueba'
      });
  }
);

Given(
  'que no existe la publicación con id {int}',
  async function (_id: number) {
    // La publicación no existe porque todavía no se implementa la lógica.
  }
);

When(
  'el estudiante comenta la publicación con el contenido {string}',
  async function (contenido: string) {
    respuestaComentario = await request(app)
      .post('/api/v1/publicaciones/1/comentarios')
      .send({
        contenido
      });
  }
);

When(
  'el estudiante intenta comentar la publicación sin contenido',
  async function () {
    respuestaComentario = await request(app)
      .post('/api/v1/publicaciones/1/comentarios')
      .send({});
  }
);

When(
  'el estudiante intenta comentar la publicación inexistente con el contenido {string}',
  async function (contenido: string) {
    respuestaComentario = await request(app)
      .post('/api/v1/publicaciones/999/comentarios')
      .send({
        contenido
      });
  }
);

Then(
  'el comentario debe crearse correctamente',
  async function () {
    if (!respuestaComentario.body.id) {
      throw new Error(
        'El comentario no fue creado correctamente'
      );
    }
  }
);

Then(
  'el comentario debe ser rechazado',
  async function () {
    if (respuestaComentario.status < 400) {
      throw new Error(
        'El comentario debería haber sido rechazado'
      );
    }
  }
);

Then(
  'la respuesta del comentario debe tener código {int}',
  async function (codigoEsperado: number) {
    if (respuestaComentario.status !== codigoEsperado) {
      throw new Error(
        `Se esperaba ${codigoEsperado}, pero se recibió ${respuestaComentario.status}`
      );
    }
  }
);