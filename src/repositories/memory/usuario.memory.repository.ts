import {
  CrearUsuario,
  Usuario,
  UsuarioRepository
} from '../interfaces/usuario.repository.js';

export class UsuarioMemoryRepository implements UsuarioRepository {
  private usuarios: Usuario[] = [];
  private siguienteId = 1;

  async buscarPorCorreo(
    correo: string
  ): Promise<Usuario | undefined> {
    return this.usuarios.find(
      (usuario) => usuario.correo === correo
    );
  }

  async crear(
    datos: CrearUsuario
  ): Promise<Usuario> {
    const usuario: Usuario = {
      id: this.siguienteId++,
      rol: datos.rol ?? 'USER',
      ...datos
    };

    this.usuarios.push(usuario);

    return usuario;
  }
}