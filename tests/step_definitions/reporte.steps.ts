import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import request from 'supertest';

import app from '../../src/app.js';

let respuestaReporte: request.Response;

let accessToken: string;

Given(
  'que existe una publicación para reportar',
  async function () {
    await request(app)
      .post('/api/v1/auth/registro')
      .send({
        nombre: 'Pedro',
        correo: 'reporte@universidad.com',
        password: '123456'
      });

    const respuestaLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        correo: 'reporte@universidad.com',
        password: '123456'
      });

    accessToken = respuestaLogin.body.accessToken;

    const respuesta =
      await request(app)
        .post('/api/v1/publicaciones')
        .set(
          'Authorization',
          `Bearer ${accessToken}`
        )
        .send({
          titulo: 'Publicación para reportar',
          contenido: 'Contenido de prueba'
        });

    this.publicacionId = respuesta.body.id;
  }
);

When(
  'el estudiante reporta la publicación con el motivo {string}',
  async function (motivo: string) {
    respuestaReporte = await request(app)
      .post(
        `/api/v1/publicaciones/${this.publicacionId}/reportes`
      )
      .send({
        motivo
      });
  }
);

When(
  'el estudiante intenta reportar la publicación inexistente con el motivo {string}',
  async function (motivo: string) {
    respuestaReporte = await request(app)
      .post('/api/v1/publicaciones/999/reportes')
      .send({
        motivo
      });
  }
);

When(
  'el estudiante intenta reportar la publicación sin especificar el motivo',
  async function () {
    respuestaReporte = await request(app)
      .post(
        `/api/v1/publicaciones/${this.publicacionId}/reportes`
      )
      .send({});
  }
);

Then(
  'el reporte debe registrarse correctamente',
  async function () {
    if (!respuestaReporte.body.id) {
      throw new Error(
        'El reporte no fue registrado correctamente'
      );
    }
  }
);

Then(
  'el reporte debe ser rechazado',
  async function () {
    if (respuestaReporte.status < 400) {
      throw new Error(
        'El reporte debería haber sido rechazado'
      );
    }
  }
);

Then(
  'la respuesta del reporte debe tener código {int}',
  async function (codigoEsperado: number) {
    if (respuestaReporte.status !== codigoEsperado) {
      throw new Error(
        `Se esperaba ${codigoEsperado}, pero se recibió ${respuestaReporte.status}`
      );
    }
  }
);


