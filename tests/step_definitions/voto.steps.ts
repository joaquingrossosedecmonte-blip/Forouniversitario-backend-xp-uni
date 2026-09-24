import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import request from 'supertest';

import app from '../../src/app.js';

let respuestaVoto: request.Response;

Given(
  'que existe una publicación para votar',
  async function () {
    const respuesta =
      await request(app)
        .post('/api/v1/publicaciones')
        .send({
          titulo: 'Publicación para votar',
          contenido: 'Contenido de prueba'
        });

    this.publicacionId = respuesta.body.id;
  }
);

When(
  'el estudiante vota la publicación con tipo {string}',
  async function (tipo: string) {
    respuestaVoto = await request(app)
      .post(
        `/api/v1/publicaciones/${this.publicacionId}/votos`
      )
      .send({
        tipo
      });
  }
);

When(
  'el estudiante intenta votar la publicación inexistente con tipo {string}',
  async function (tipo: string) {
    respuestaVoto = await request(app)
      .post('/api/v1/publicaciones/999/votos')
      .send({
        tipo
      });
  }
);

When(
  'el estudiante intenta votar la publicación sin especificar el tipo',
  async function () {
    respuestaVoto = await request(app)
      .post(
        `/api/v1/publicaciones/${this.publicacionId}/votos`
      )
      .send({});
  }
);

Then(
  'el voto debe registrarse correctamente',
  async function () {
    if (!respuestaVoto.body.id) {
      throw new Error(
        'El voto no fue registrado correctamente'
      );
    }
  }
);

Then(
  'el voto debe ser rechazado',
  async function () {
    if (respuestaVoto.status < 400) {
      throw new Error(
        'El voto debería haber sido rechazado'
      );
    }
  }
);

Then(
  'la respuesta del voto debe tener código {int}',
  async function (codigoEsperado: number) {
    if (respuestaVoto.status !== codigoEsperado) {
      throw new Error(
        `Se esperaba ${codigoEsperado}, pero se recibió ${respuestaVoto.status}`
      );
    }
  }
);

