import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import request from 'supertest';

import app from '../../src/app.js';

let respuestaLogin: request.Response;

Given(
  'que existe un usuario registrado con el correo {string} y contraseña {string}',
  async function (
    correo: string,
    password: string
  ) {
    await request(app)
      .post('/api/v1/auth/registro')
      .send({
        nombre: 'Juan',
        correo,
        password
      });
  }
);

When(
  'el estudiante inicia sesión con correo {string} y contraseña {string}',
  async function (
    correo: string,
    password: string
  ) {
    respuestaLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        correo,
        password
      });
  }
);

Then(
  'el inicio de sesión debe ser exitoso',
  async function () {
    if (respuestaLogin.status >= 400) {
      throw new Error(
        'El inicio de sesión debería haber sido exitoso'
      );
    }
  }
);

Then(
  'el inicio de sesión debe ser rechazado',
  async function () {
    if (respuestaLogin.status < 400) {
      throw new Error(
        'El inicio de sesión debería haber sido rechazado'
      );
    }
  }
);
Then(
  'la respuesta del login debe tener código {int}',
  async function (codigoEsperado: number) {
    if (respuestaLogin.status !== codigoEsperado) {
      throw new Error(
        `Se esperaba ${codigoEsperado}, pero se recibió ${respuestaLogin.status}`
      );
    }
  }
);
Then(
  'la respuesta debe contener un token',
  async function () {
    if (!respuestaLogin.body.token) {
      throw new Error(
        'La respuesta debería contener un token'
      );
    }
  }
);