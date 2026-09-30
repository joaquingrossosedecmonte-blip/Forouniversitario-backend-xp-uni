import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../../src/app.js';

let respuestaEliminacion: request.Response;

const crearTokenAdmin = (): string => {
  return jwt.sign(
    {
      sub: 2,
      correo: 'admin@universidad.com',
      rol: 'ADMIN'
    },
    process.env.JWT_SECRET ?? 'secreto-desarrollo'
  );
};

Given(
  'que existe una publicación para eliminar',
  async function () {
    const tokenAdmin = crearTokenAdmin();

    const respuestaCreacion = await request(app)
      .post('/api/v1/publicaciones')
      .set(
        'Authorization',
        `Bearer ${tokenAdmin}`
      )
      .send({
        titulo: 'Publicación para eliminar',
        contenido: 'Contenido de prueba'
      });

    if (respuestaCreacion.status !== 201) {
      throw new Error(
        `No se pudo crear la publicación. Se recibió ${respuestaCreacion.status}`
      );
    }
  }
);

When(
  'el administrador elimina la publicación',
  async function () {
    const tokenAdmin = crearTokenAdmin();

    respuestaEliminacion = await request(app)
      .delete('/api/v1/publicaciones/1')
      .set(
        'Authorization',
        `Bearer ${tokenAdmin}`
      );
  }
);

When(
  'el administrador intenta eliminar la publicación inexistente',
  async function () {
    const tokenAdmin = crearTokenAdmin();

    respuestaEliminacion = await request(app)
      .delete('/api/v1/publicaciones/999')
      .set(
        'Authorization',
        `Bearer ${tokenAdmin}`
      );
  }
);

When(
  'el administrador intenta eliminar una publicación sin especificar el id',
  async function () {
    const tokenAdmin = crearTokenAdmin();

    respuestaEliminacion = await request(app)
      .delete('/api/v1/publicaciones/')
      .set(
        'Authorization',
        `Bearer ${tokenAdmin}`
      );
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