import bcrypt from 'bcrypt';
import { AppError } from '../errors/app.error.js';
import {
    Usuario,
    UsuarioRepository
} from '../repositories/interfaces/usuario.repository.js';

interface RegistrarUsuarioInput {
    nombre: string;
    correo: string;
    password: string;
}

export class AuthService {
    constructor(
        private readonly usuarioRepository: UsuarioRepository
    ) { }

    async registrarUsuario(
        datos: RegistrarUsuarioInput
    ): Promise<Usuario> {
        const usuarioExistente =
            await this.usuarioRepository.buscarPorCorreo(
                datos.correo
            );

        if (usuarioExistente) {
            throw new AppError(
                'El correo ya está registrado',
                409
            );
        }

        const passwordHash = await bcrypt.hash(
            datos.password,
            10
        );

        return this.usuarioRepository.crear({
            nombre: datos.nombre,
            correo: datos.correo,
            passwordHash
        });
    }
}