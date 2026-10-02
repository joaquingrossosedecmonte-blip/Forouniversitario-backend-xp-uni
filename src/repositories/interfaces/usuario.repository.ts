export type RolUsuario = 'USER' | 'ADMIN';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  passwordHash: string;
  rol: RolUsuario;
}

export interface CrearUsuario {
  nombre: string;
  correo: string;
  passwordHash: string;
  rol?: RolUsuario;
}

export interface UsuarioRepository {
  buscarPorCorreo(correo: string): Promise<Usuario | undefined>;
  crear(datos: CrearUsuario): Promise<Usuario>;
}