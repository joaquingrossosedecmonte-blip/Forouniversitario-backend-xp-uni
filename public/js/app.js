// Foro Universitario — panel de una sola página que consume la API v1.

const API = '/api/v1';
const REFRESCO_MS = 10000;
const SESION_KEY = 'foro.sesion';

const state = {
  publicaciones: [],
  usuarios: [],
  reportes: [],
  orden: 'recientes',
  busqueda: '',
  sesion: leerSesion(),
  comentariosAbiertos: new Set(),
  borradores: new Map(),
  tabAdmin: 'usuarios',
  cargado: false
};

const $ = (selector, root = document) => root.querySelector(selector);

// ---------------------------------------------------------------------------
// Sesión
// ---------------------------------------------------------------------------

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(SESION_KEY)) ?? null;
  } catch {
    return null;
  }
}

function guardarSesion(sesion) {
  state.sesion = sesion;

  try {
    if (sesion) {
      localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
    } else {
      localStorage.removeItem(SESION_KEY);
    }
  } catch {
    // El almacenamiento puede no estar disponible (modo privado).
  }
}

const esAdmin = () => state.sesion?.usuario?.rol === 'ADMIN';

// ---------------------------------------------------------------------------
// Cliente HTTP
// ---------------------------------------------------------------------------

class ApiError extends Error {
  constructor(mensaje, status) {
    super(mensaje);
    this.status = status;
  }
}

async function api(ruta, { method = 'GET', body, auth = false, reintento = true } = {}) {
  const headers = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth && state.sesion?.accessToken) {
    headers.Authorization = `Bearer ${state.sesion.accessToken}`;
  }

  let respuesta;

  try {
    respuesta = await fetch(API + ruta, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    marcarEstado(false);
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }

  marcarEstado(true);

  if (respuesta.status === 401 && auth && reintento && state.sesion?.refreshToken) {
    const renovado = await renovarToken();

    if (renovado) {
      return api(ruta, { method, body, auth, reintento: false });
    }
  }

  const texto = await respuesta.text();
  const datos = texto ? JSON.parse(texto) : null;

  if (!respuesta.ok) {
    if (respuesta.status === 401 && auth) {
      cerrarSesion(false);
      toast('Tu sesión expiró. Volvé a iniciar sesión.', 'error');
    }

    throw new ApiError(
      datos?.error ?? datos?.mensaje ?? `Error ${respuesta.status}`,
      respuesta.status
    );
  }

  return datos;
}

async function renovarToken() {
  try {
    const respuesta = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: state.sesion.refreshToken })
    });

    if (!respuesta.ok) {
      return false;
    }

    const { accessToken } = await respuesta.json();
    guardarSesion({ ...state.sesion, accessToken });

    return true;
  } catch {
    return false;
  }
}

function marcarEstado(enLinea) {
  const estado = $('#api-status');
  estado.dataset.state = enLinea ? 'online' : 'offline';
  $('.status__label', estado).textContent = enLinea ? 'API en línea' : 'API sin conexión';
}

// ---------------------------------------------------------------------------
// Utilidades de presentación
// ---------------------------------------------------------------------------

function escapar(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const formatoRelativo = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
const formatoFecha = new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' });

function tiempoRelativo(iso) {
  if (!iso) {
    return '';
  }

  const segundos = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const unidades = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60]
  ];

  for (const [unidad, tamaño] of unidades) {
    if (Math.abs(segundos) >= tamaño) {
      return formatoRelativo.format(Math.round(segundos / tamaño), unidad);
    }
  }

  return 'hace un momento';
}

const COLORES_AVATAR = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#db2777', '#7c3aed', '#2563eb', '#dc2626'];

function avatar(nombre, id, clase = '') {
  const iniciales = (nombre ?? '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('');

  const color = COLORES_AVATAR[(Number(id) || 0) % COLORES_AVATAR.length];

  return `<span class="avatar ${clase}" style="background:${color}" aria-hidden="true">${escapar(iniciales || '?')}</span>`;
}

const ICONOS = {
  arriba: '<svg class="icon" viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></svg>',
  abajo: '<svg class="icon" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
  comentario: '<svg class="icon" viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/></svg>',
  bandera: '<svg class="icon" viewBox="0 0 24 24"><path d="M5 21V4m0 0h11l-2 4 2 4H5"/></svg>',
  papelera: '<svg class="icon" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  documento: '<svg class="icon" viewBox="0 0 24 24"><path d="M14 3H6v18h12V7l-4-4Z"/><path d="M14 3v4h4M9 13h6M9 17h4"/></svg>',
  buscar: '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  enviar: '<svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

function renderSesion() {
  const area = $('#session-area');

  if (!state.sesion) {
    area.innerHTML = '<button type="button" class="btn btn--primary" data-action="abrir-login">Iniciar sesión</button>';
    return;
  }

  const { usuario } = state.sesion;
  const rol = usuario.rol === 'ADMIN'
    ? '<span class="badge badge--admin">ADMIN</span>'
    : '<span class="badge badge--user">USUARIO</span>';

  area.innerHTML = `
    <div class="user-chip">
      <div class="user-chip__info">
        <span class="user-chip__name">${escapar(usuario.nombre ?? usuario.correo)} ${rol}</span>
        <span class="user-chip__mail">${escapar(usuario.correo)}</span>
      </div>
      ${avatar(usuario.nombre ?? usuario.correo, usuario.id, 'avatar--lg')}
      <button type="button" class="btn btn--ghost btn--sm" data-action="logout">Salir</button>
    </div>`;
}

function renderComposer() {
  const contenedor = $('#composer');

  if (!state.sesion) {
    contenedor.innerHTML = `
      <div class="locked">
        <p class="muted">Iniciá sesión para publicar, comentar, votar y reportar.</p>
        <button type="button" class="btn btn--primary" data-action="abrir-login">Iniciar sesión</button>
      </div>`;
    return;
  }

  if ($('#post-form', contenedor)) {
    return;
  }

  contenedor.innerHTML = `
    <form id="post-form" class="form" novalidate>
      <label class="field">
        <span class="field__label">Título</span>
        <input name="titulo" type="text" maxlength="120" required placeholder="¿Sobre qué querés hablar?">
      </label>
      <label class="field">
        <span class="field__label">Contenido</span>
        <textarea name="contenido" rows="4" maxlength="2000" required placeholder="Contá los detalles"></textarea>
        <span class="field__hint" data-contador>0 / 2000</span>
      </label>
      <p class="form__error" role="alert"></p>
      <button class="btn btn--primary btn--block" type="submit">Publicar</button>
    </form>`;
}

function publicacionesVisibles() {
  const consulta = state.busqueda.trim().toLowerCase();

  const filtradas = state.publicaciones.filter((publicacion) => {
    if (!consulta) {
      return true;
    }

    return [publicacion.titulo, publicacion.contenido, publicacion.autor?.nombre]
      .some((texto) => texto?.toLowerCase().includes(consulta));
  });

  const puntaje = (publicacion) => publicacion.votos.positivos - publicacion.votos.negativos;

  if (state.orden === 'votadas') {
    filtradas.sort((a, b) => puntaje(b) - puntaje(a) || b.id - a.id);
  } else if (state.orden === 'comentadas') {
    filtradas.sort((a, b) => b.comentarios.length - a.comentarios.length || b.id - a.id);
  }

  return filtradas;
}

function renderPublicaciones() {
  const contenedor = $('#posts');

  if (!state.cargado) {
    contenedor.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
    return;
  }

  const visibles = publicacionesVisibles();

  if (visibles.length === 0) {
    const sinDatos = state.publicaciones.length === 0;

    contenedor.innerHTML = `
      <div class="empty">
        <span class="empty__icon">${sinDatos ? ICONOS.documento : ICONOS.buscar}</span>
        <h3>${sinDatos ? 'Todavía no hay publicaciones' : 'Sin resultados'}</h3>
        <p class="muted">${sinDatos
          ? 'Cuando alguien publique, aparecerá aquí. ¡Podés ser el primero!'
          : 'Probá con otra búsqueda.'}</p>
      </div>`;
    return;
  }

  contenedor.innerHTML = visibles.map(renderPublicacion).join('');
}

function renderPublicacion(publicacion) {
  const puntaje = publicacion.votos.positivos - publicacion.votos.negativos;
  const clasePuntaje = puntaje > 0 ? 'vote__score--pos' : puntaje < 0 ? 'vote__score--neg' : '';
  const abierto = state.comentariosAbiertos.has(publicacion.id);
  const autor = publicacion.autor;
  const totalComentarios = publicacion.comentarios.length;

  const reportada = publicacion.reportes > 0
    ? `<span class="badge badge--warning">${publicacion.reportes} ${publicacion.reportes === 1 ? 'reporte' : 'reportes'}</span>`
    : '';

  const eliminar = esAdmin()
    ? `<button type="button" class="link-btn link-btn--danger" data-action="eliminar" data-id="${publicacion.id}">${ICONOS.papelera}Eliminar</button>`
    : '';

  return `
    <article class="post ${publicacion.reportes > 0 ? 'post--reported' : ''}" data-id="${publicacion.id}">
      <div class="vote" aria-label="Votos">
        <button type="button" class="vote__btn vote__btn--up" data-action="votar" data-tipo="positivo" data-id="${publicacion.id}" aria-label="Votar a favor" title="A favor (${publicacion.votos.positivos})">${ICONOS.arriba}</button>
        <span class="vote__score ${clasePuntaje}" title="${publicacion.votos.positivos} a favor · ${publicacion.votos.negativos} en contra">${puntaje}</span>
        <button type="button" class="vote__btn vote__btn--down" data-action="votar" data-tipo="negativo" data-id="${publicacion.id}" aria-label="Votar en contra" title="En contra (${publicacion.votos.negativos})">${ICONOS.abajo}</button>
      </div>

      <div class="post__main">
        <div class="post__meta">
          <span class="post__author">
            ${avatar(autor?.nombre ?? 'Anónimo', autor?.id ?? 0)}
            ${escapar(autor?.nombre ?? 'Usuario desconocido')}
          </span>
          <time class="dot-sep" datetime="${escapar(publicacion.creadoEn)}" title="${publicacion.creadoEn ? escapar(formatoFecha.format(new Date(publicacion.creadoEn))) : ''}">${escapar(tiempoRelativo(publicacion.creadoEn))}</time>
          <span class="dot-sep">#${publicacion.id}</span>
          ${reportada}
        </div>
        <h2 class="post__title">${escapar(publicacion.titulo)}</h2>
        <p class="post__content">${escapar(publicacion.contenido)}</p>

        <div class="post__actions">
          <button type="button" class="link-btn" data-action="toggle-comentarios" data-id="${publicacion.id}" aria-expanded="${abierto}">
            ${ICONOS.comentario}${totalComentarios} ${totalComentarios === 1 ? 'comentario' : 'comentarios'}
          </button>
          <button type="button" class="link-btn" data-action="reportar" data-id="${publicacion.id}">${ICONOS.bandera}Reportar</button>
          <span class="spacer"></span>
          ${eliminar}
        </div>
      </div>

      ${abierto ? renderComentarios(publicacion) : ''}
    </article>`;
}

function renderComentarios(publicacion) {
  const lista = publicacion.comentarios.length
    ? `<ul class="comments__list">${publicacion.comentarios.map((comentario) => `
        <li class="comment">
          <div class="comment__meta">
            <span>Comentario #${comentario.id}</span>
            <time datetime="${escapar(comentario.creadoEn)}">${escapar(tiempoRelativo(comentario.creadoEn))}</time>
          </div>
          <p class="comment__body">${escapar(comentario.contenido)}</p>
        </li>`).join('')}</ul>`
    : '<p class="comments__empty">Sin comentarios todavía.</p>';

  const formulario = state.sesion
    ? `<form class="comment-form" data-id="${publicacion.id}" novalidate>
        <input name="contenido" type="text" maxlength="500" placeholder="Escribí un comentario…" aria-label="Nuevo comentario" value="${escapar(state.borradores.get(publicacion.id) ?? '')}">
        <button class="btn btn--primary" type="submit" aria-label="Comentar">${ICONOS.enviar}</button>
      </form>`
    : '<button type="button" class="link-btn" data-action="abrir-login">Iniciá sesión para comentar</button>';

  return `<div class="comments">${lista}${formulario}</div>`;
}

function renderEstadisticas(resumen) {
  $('#stat-publicaciones').textContent = resumen.publicaciones;
  $('#stat-comentarios').textContent = resumen.comentarios;
  $('#stat-votos').textContent = resumen.votos;
  $('#stat-usuarios').textContent = resumen.usuarios;
}

function renderAdmin() {
  const tarjeta = $('#admin-card');
  tarjeta.hidden = !esAdmin();

  if (!esAdmin()) {
    return;
  }

  $('#reportes-count').textContent = state.reportes.length;

  document.querySelectorAll('[data-tab]').forEach((tab) => {
    tab.setAttribute('aria-selected', String(tab.dataset.tab === state.tabAdmin));
  });

  const panel = $('#admin-panel');

  if (state.tabAdmin === 'usuarios') {
    panel.innerHTML = state.usuarios.length
      ? `<ul class="list">${state.usuarios.map((usuario) => `
          <li class="list__item">
            ${avatar(usuario.nombre, usuario.id)}
            <div class="list__main">
              <div class="list__title">${escapar(usuario.nombre)}</div>
              <div class="list__sub">${escapar(usuario.correo)} · ${usuario.publicaciones} ${usuario.publicaciones === 1 ? 'publicación' : 'publicaciones'}</div>
            </div>
            <span class="badge ${usuario.rol === 'ADMIN' ? 'badge--admin' : 'badge--user'}">${escapar(usuario.rol)}</span>
          </li>`).join('')}</ul>`
      : '<p class="list__empty">No hay usuarios registrados.</p>';
    return;
  }

  panel.innerHTML = state.reportes.length
    ? `<ul class="list">${state.reportes.map((reporte) => `
        <li class="list__item">
          <div class="list__main">
            <div class="list__title">${escapar(reporte.publicacionTitulo ?? `Publicación #${reporte.publicacionId} (eliminada)`)}</div>
            <div class="list__sub">${escapar(reporte.motivo)}</div>
          </div>
          ${reporte.publicacionTitulo
            ? `<button type="button" class="btn btn--ghost btn--sm" data-action="eliminar" data-id="${reporte.publicacionId}">Eliminar</button>`
            : ''}
        </li>`).join('')}</ul>`
    : '<p class="list__empty">No hay reportes pendientes.</p>';
}

function renderTodo() {
  renderSesion();
  renderComposer();
  renderPublicaciones();
  renderAdmin();
}

// ---------------------------------------------------------------------------
// Datos
// ---------------------------------------------------------------------------

async function cargarDatos() {
  try {
    const [resumen, publicaciones] = await Promise.all([
      api('/resumen'),
      api('/publicaciones')
    ]);

    state.publicaciones = publicaciones;
    state.cargado = true;
    renderEstadisticas(resumen);

    if (esAdmin()) {
      const [usuarios, reportes] = await Promise.all([
        api('/usuarios', { auth: true }),
        api('/reportes', { auth: true })
      ]);

      state.usuarios = usuarios;
      state.reportes = reportes;
    }
  } catch (error) {
    if (!state.cargado) {
      state.cargado = true;
      toast(error.message, 'error');
    }
  }

  renderPublicaciones();
  renderAdmin();
}

function hayEdicionEnCurso() {
  const activo = document.activeElement;

  return Boolean(activo?.closest('.comment-form'));
}

// ---------------------------------------------------------------------------
// Acciones
// ---------------------------------------------------------------------------

async function iniciarSesion(correo, password) {
  const respuesta = await api('/auth/login', {
    method: 'POST',
    body: { correo, password }
  });

  guardarSesion({
    accessToken: respuesta.accessToken,
    refreshToken: respuesta.refreshToken,
    usuario: respuesta.usuario
  });

  const perfil = await api('/auth/perfil', { auth: true });

  guardarSesion({
    ...state.sesion,
    usuario: { ...respuesta.usuario, rol: perfil.rol }
  });
}

function cerrarSesion(avisar = true) {
  guardarSesion(null);
  state.usuarios = [];
  state.reportes = [];
  $('#composer').innerHTML = '';
  renderTodo();

  if (avisar) {
    toast('Sesión cerrada');
  }
}

function requerirSesion() {
  if (state.sesion) {
    return true;
  }

  abrirAuth('login');
  return false;
}

async function votar(id, tipo) {
  if (!requerirSesion()) {
    return;
  }

  try {
    await api(`/publicaciones/${id}/votos`, { method: 'POST', body: { tipo }, auth: true });
    await cargarDatos();
  } catch (error) {
    toast(error.message, 'error');
  }
}

let publicacionAReportar = null;
let publicacionAEliminar = null;

function abrirReporte(id) {
  if (!requerirSesion()) {
    return;
  }

  const publicacion = state.publicaciones.find((item) => item.id === id);
  publicacionAReportar = id;

  const formulario = $('#report-form');
  formulario.reset();
  $('.form__error', formulario).textContent = '';
  $('#report-target').textContent = publicacion ? `“${publicacion.titulo}”` : '';
  $('#report-modal').showModal();
}

function abrirEliminar(id) {
  const publicacion = state.publicaciones.find((item) => item.id === id);
  publicacionAEliminar = id;
  $('#confirm-text').textContent = `Se eliminará “${publicacion?.titulo ?? `#${id}`}”. Esta acción no se puede deshacer.`;
  $('#confirm-modal').showModal();
}

function abrirAuth(tab) {
  cambiarTabAuth(tab);
  document.querySelectorAll('#auth-modal .form').forEach((formulario) => {
    $('.form__error', formulario).textContent = '';
  });
  $('#auth-modal').showModal();
  $(`#${tab}-form input`).focus();
}

function cambiarTabAuth(tab) {
  document.querySelectorAll('[data-auth-tab]').forEach((boton) => {
    boton.setAttribute('aria-selected', String(boton.dataset.authTab === tab));
  });

  $('#login-form').hidden = tab !== 'login';
  $('#registro-form').hidden = tab !== 'registro';
}

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------

function toast(mensaje, tipo = 'ok') {
  const elemento = document.createElement('div');
  elemento.className = `toast ${tipo === 'error' ? 'toast--error' : ''}`;
  elemento.textContent = mensaje;
  $('#toasts').append(elemento);

  setTimeout(() => {
    elemento.classList.add('toast--leaving');
    setTimeout(() => elemento.remove(), 200);
  }, 3500);
}

function conCarga(boton, tarea) {
  return async (...args) => {
    boton.disabled = true;

    try {
      await tarea(...args);
    } finally {
      boton.disabled = false;
    }
  };
}

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------

document.addEventListener('click', (evento) => {
  const objetivo = evento.target.closest('[data-action]');

  if (!objetivo) {
    return;
  }

  const id = Number(objetivo.dataset.id);

  switch (objetivo.dataset.action) {
    case 'abrir-login':
      abrirAuth('login');
      break;
    case 'logout':
      cerrarSesion();
      break;
    case 'votar':
      votar(id, objetivo.dataset.tipo);
      break;
    case 'reportar':
      abrirReporte(id);
      break;
    case 'eliminar':
      abrirEliminar(id);
      break;
    case 'toggle-comentarios':
      if (state.comentariosAbiertos.has(id)) {
        state.comentariosAbiertos.delete(id);
      } else {
        state.comentariosAbiertos.add(id);
      }

      renderPublicaciones();

      if (state.comentariosAbiertos.has(id)) {
        $(`.comment-form[data-id="${id}"] input`)?.focus();
      }
      break;
  }
});

document.querySelectorAll('[data-close]').forEach((boton) => {
  boton.addEventListener('click', () => boton.closest('dialog').close());
});

document.querySelectorAll('[data-auth-tab]').forEach((boton) => {
  boton.addEventListener('click', () => cambiarTabAuth(boton.dataset.authTab));
});

document.querySelectorAll('[data-tab]').forEach((boton) => {
  boton.addEventListener('click', () => {
    state.tabAdmin = boton.dataset.tab;
    renderAdmin();
  });
});

document.querySelectorAll('[data-sort]').forEach((boton) => {
  boton.addEventListener('click', () => {
    state.orden = boton.dataset.sort;
    document.querySelectorAll('[data-sort]').forEach((otro) => {
      otro.setAttribute('aria-checked', String(otro === boton));
    });
    renderPublicaciones();
  });
});

$('#search').addEventListener('input', (evento) => {
  state.busqueda = evento.target.value;
  renderPublicaciones();
});

$('#refresh').addEventListener('click', () => cargarDatos());

$('#login-form').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const error = $('.form__error', formulario);
  const { correo, password } = Object.fromEntries(new FormData(formulario));

  if (!correo || !password) {
    error.textContent = 'Completá correo y contraseña.';
    return;
  }

  await conCarga($('button[type="submit"]', formulario), async () => {
    try {
      await iniciarSesion(correo.trim(), password);
      $('#auth-modal').close();
      formulario.reset();
      renderTodo();
      await cargarDatos();
      toast(`Hola, ${state.sesion.usuario.nombre}`);
    } catch (fallo) {
      error.textContent = fallo.message;
    }
  })();
});

$('#registro-form').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const error = $('.form__error', formulario);
  const { nombre, correo, password } = Object.fromEntries(new FormData(formulario));

  if (!nombre || !correo || !password) {
    error.textContent = 'Completá todos los campos.';
    return;
  }

  await conCarga($('button[type="submit"]', formulario), async () => {
    try {
      await api('/auth/registro', {
        method: 'POST',
        body: { nombre: nombre.trim(), correo: correo.trim(), password }
      });
      await iniciarSesion(correo.trim(), password);
      $('#auth-modal').close();
      formulario.reset();
      renderTodo();
      await cargarDatos();
      toast('Cuenta creada. ¡Bienvenido!');
    } catch (fallo) {
      error.textContent = fallo.message;
    }
  })();
});

$('#composer').addEventListener('input', (evento) => {
  if (evento.target.name === 'contenido') {
    $('[data-contador]').textContent = `${evento.target.value.length} / 2000`;
  }
});

$('#composer').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const formulario = evento.target;
  const error = $('.form__error', formulario);
  const { titulo, contenido } = Object.fromEntries(new FormData(formulario));

  if (!titulo.trim() || !contenido.trim()) {
    error.textContent = 'El título y el contenido son obligatorios.';
    return;
  }

  error.textContent = '';

  await conCarga($('button[type="submit"]', formulario), async () => {
    try {
      await api('/publicaciones', {
        method: 'POST',
        body: { titulo: titulo.trim(), contenido: contenido.trim() },
        auth: true
      });
      formulario.reset();
      $('[data-contador]').textContent = '0 / 2000';
      await cargarDatos();
      toast('Publicación creada');
    } catch (fallo) {
      error.textContent = fallo.message;
    }
  })();
});

$('#posts').addEventListener('input', (evento) => {
  const formulario = evento.target.closest('.comment-form');

  if (formulario) {
    state.borradores.set(Number(formulario.dataset.id), evento.target.value);
  }
});

$('#posts').addEventListener('submit', async (evento) => {
  const formulario = evento.target.closest('.comment-form');

  if (!formulario) {
    return;
  }

  evento.preventDefault();
  const id = Number(formulario.dataset.id);
  const contenido = formulario.contenido.value.trim();

  if (!contenido) {
    return;
  }

  await conCarga($('button', formulario), async () => {
    try {
      await api(`/publicaciones/${id}/comentarios`, {
        method: 'POST',
        body: { contenido },
        auth: true
      });
      state.borradores.delete(id);
      await cargarDatos();
      $(`.comment-form[data-id="${id}"] input`)?.focus();
    } catch (fallo) {
      toast(fallo.message, 'error');
    }
  })();
});

$('#report-form').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const motivo = formulario.motivo.value.trim();

  if (!motivo) {
    $('.form__error', formulario).textContent = 'Indicá un motivo.';
    return;
  }

  await conCarga($('button[type="submit"]', formulario), async () => {
    try {
      await api(`/publicaciones/${publicacionAReportar}/reportes`, {
        method: 'POST',
        body: { motivo },
        auth: true
      });
      $('#report-modal').close();
      await cargarDatos();
      toast('Reporte enviado. Gracias por avisar.');
    } catch (fallo) {
      $('.form__error', formulario).textContent = fallo.message;
    }
  })();
});

$('#confirm-ok').addEventListener('click', async (evento) => {
  await conCarga(evento.currentTarget, async () => {
    try {
      await api(`/publicaciones/${publicacionAEliminar}`, { method: 'DELETE', auth: true });
      $('#confirm-modal').close();
      state.comentariosAbiertos.delete(publicacionAEliminar);
      await cargarDatos();
      toast('Publicación eliminada');
    } catch (fallo) {
      $('#confirm-modal').close();
      toast(fallo.message, 'error');
    }
  })();
});

// ---------------------------------------------------------------------------
// Inicio
// ---------------------------------------------------------------------------

renderTodo();
cargarDatos();

setInterval(() => {
  if ($('#auto-refresh').checked && !document.hidden && !hayEdicionEnCurso() && !document.querySelector('dialog[open]')) {
    cargarDatos();
  }
}, REFRESCO_MS);
