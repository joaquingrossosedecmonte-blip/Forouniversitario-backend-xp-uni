import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import request from 'supertest';

import app from '../../src/app.js';

let respuestaEliminacion: request.Response;

Given(
  'que existe una publicación para eliminar',
  async function () {
    await request(app)
      .post('/api/v1/publicaciones')
      .send({
        titulo: 'Publicación para eliminar',
        contenido: 'Contenido de prueba'
      });
  }
);

When(
  'el administrador elimina la publicación',
  async function () {
    respuestaEliminacion = await request(app)
      .delete('/api/v1/publicaciones/1');
  }
);

When(
  'el administrador intenta eliminar la publicación inexistente',
  async function () {
    respuestaEliminacion = await request(app)
      .delete('/api/v1/publicaciones/999');
  }
);

When(
  'el administrador intenta eliminar una publicación sin especificar el id',
  async function () {
    respuestaEliminacion = await request(app)
      .delete('/api/v1/publicaciones/');
  }
);

Then(
  'la publicación debe eliminarse correctamente',
  async function () {
    if (respuestaEliminacion.status !== 204) {
      throw new Error(
        'La publicación no fue eliminada correctamente'
      );
    }
  }
);

Then(
  'la eliminación debe ser rechazada',
  async function () {
    if (respuestaEliminacion.status < 400) {
      throw new Error(
        'La eliminación debería haber sido rechazada'
      );
    }
  }
);

Then(
  'la respuesta de eliminación debe tener código {int}',
  async function (codigoEsperado: number) {
    if (respuestaEliminacion.status !== codigoEsperado) {
      throw new Error(
        `Se esperaba ${codigoEsperado}, pero se recibió ${respuestaEliminacion.status}`
      );
    }
  }
);