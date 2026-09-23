export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  passwordHash: string;
}

export interface CrearUsuario {
  nombre: string;
  correo: string;
  passwordHash: string;
}

export interface UsuarioRepository {
  buscarPorCorreo(correo: string): Promise<Usuario | undefined>;
  crear(datos: CrearUsuario): Promise<Usuario>;
}