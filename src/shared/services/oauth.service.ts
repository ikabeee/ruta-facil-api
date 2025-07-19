import { ApiError } from '../errors/ApiError';
import { UserService } from '../../modules/users/user.service';
import { UserRepository } from '../../modules/users/user.repository';
import { OAuthUserData } from '../interfaces/OAuthStrategy.interface';
import { JwtHelper } from '../helpers/JwtHelper';
import { User, UserRole, UserStatus } from '../../../generated/prisma';
import { PrismaClient } from '../../../generated/prisma';

export interface OAuthServiceInterface {
    handleOAuthUser(userData: OAuthUserData): Promise<{ user: User; token: string; expiresIn: number }>;
}

export class OAuthService implements OAuthServiceInterface {
    private userService: UserService;
    private userRepository: UserRepository;

    constructor() {
        const prisma = new PrismaClient();
        this.userRepository = new UserRepository(prisma);
        this.userService = new UserService(this.userRepository);
    }

    async handleOAuthUser(userData: OAuthUserData): Promise<{ user: User; token: string; expiresIn: number }> {
        try {
            // Buscar usuario existente por email
            let user = await this.findUserByEmail(userData.email);

            if (!user) {
                // Crear nuevo usuario si no existe
                user = await this.createOAuthUser(userData);
            } else {
                // Actualizar información del usuario si es necesario
                user = await this.updateUserOAuthInfo(user, userData);
            }

            // Verificar que el usuario esté activo
            if (user.status !== UserStatus.ACTIVE) {
                throw new ApiError(403, 'Usuario inactivo. Contacte al administrador');
            }

            // Generar token JWT
            const tokenData = JwtHelper.generateToken({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            });

            return {
                user,
                token: tokenData.token,
                expiresIn: tokenData.expiresIn
            };

        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            console.error('Error handling OAuth user:', error);
            throw new ApiError(500, 'Error interno del servidor');
        }
    }

    private async findUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findByEmail(email);
    }

    private async createOAuthUser(userData: OAuthUserData): Promise<User> {
        const newUser = await this.userService.createUser({
            name: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: '', // OAuth users don't need a password
            phone: '',
            role: UserRole.USER,
            status: UserStatus.ACTIVE,
            emailVerified: true, // OAuth providers verify emails
            authProvider: userData.provider,
            providerId: userData.providerId,
            profilePicture: userData.picture,
            createdAt: new Date()
        });

        return newUser;
    }

    private async updateUserOAuthInfo(user: User, userData: OAuthUserData): Promise<User> {
        // Solo actualizar si no tiene provider configurado o si la imagen cambió
        const shouldUpdate = !user.authProvider || 
                           !user.providerId || 
                           user.profilePicture !== userData.picture;

        if (shouldUpdate) {
            const updatedUser = await this.userService.updateUser(user.id, {
                authProvider: userData.provider,
                providerId: userData.providerId,
                profilePicture: userData.picture,
                emailVerified: true,
                updatedAt: new Date()
            });
            return updatedUser;
        }

        return user;
    }
}
