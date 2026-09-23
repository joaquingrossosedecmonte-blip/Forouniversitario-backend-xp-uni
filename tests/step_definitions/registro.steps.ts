import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import request from 'supertest';

import app from '../../src/app.js';

let respuesta: request.Response;

Given(
  'que no existe un usuario con el correo {string}',
  async function (_correo: string) {
    // El repositorio comienza vacío.
  }
);

Given(
  'que ya existe un usuario con el correo {string}',
  async function (correo: string) {
    await request(app)
      .post('/api/v1/auth/registro')
      .send({
        nombre: 'Juan',
        correo,
        password: '123456'
      });
  }
);

When(
  'el estudiante se registra con nombre {string} correo {string} y contraseña {string}',
  async function (
    nombre: string,
    correo: string,
    contraseña: string
  ) {
    respuesta = await request(app)
      .post('/api/v1/auth/registro')
      .send({
        nombre,
        correo,
        password: contraseña
      });
  }
);

When(
  'el estudiante intenta registrarse con nombre {string} correo {string} y contraseña {string}',
  async function (
    nombre: string,
    correo: string,
    contraseña: string
  ) {
    respuesta = await request(app)
      .post('/api/v1/auth/registro')
      .send({
        nombre,
        correo,
        password: contraseña
      });
  }
);

When(
  'el estudiante intenta registrarse sin proporcionar una contraseña',
  async function () {
    respuesta = await request(app)
      .post('/api/v1/auth/registro')
      .send({
        nombre: 'Juan',
        correo: 'juan@universidad.com'
      });
  }
);

Then(
  'el usuario debe registrarse correctamente',
  async function () {
    if (!respuesta.body.id) {
      throw new Error(
        'El usuario no fue registrado correctamente'
      );
    }
  }
);

Then(
  'el registro debe ser rechazado',
  async function () {
    if (respuesta.status < 400) {
      throw new Error(
        'El registro debería haber sido rechazado'
      );
    }
  }
);

Then(
  'la respuesta debe tener código {int}',
  async function (codigoEsperado: number) {
    if (respuesta.status !== codigoEsperado) {
      throw new Error(
        `Se esperaba ${codigoEsperado}, pero se recibió ${respuesta.status}`
      );
    }
  }
);