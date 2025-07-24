import { Request, Response } from "express";
import { UserServiceInterface } from "./interfaces/UserService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "./dto/create-user.dto";
import { validate } from "class-validator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateDriverProfileDto, UpdateOwnerProfileDto } from "./dto/update-profiles.dto";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios del sistema
 */

export class UserController {
    constructor(private readonly userService: UserServiceInterface) {}
    
    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Obtener todos los usuarios
     *     description: Obtiene una lista de todos los usuarios registrados
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Lista de usuarios obtenida exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/User'
     *       401:
     *         description: Usuario no autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async findAllUsers(_req: Request, res: Response): Promise<Response>{
        try {
            const users = await this.userService.findAllUsers();
            return ApiResponse.success(res, users, 200);
        } catch (error: any) {
            if(error instanceof ApiError){
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Obtener usuario por ID
     *     description: Obtiene un usuario específico por su ID
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID único del usuario
     *         example: 1
     *     responses:
     *       200:
     *         description: Usuario encontrado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/User'
     *       400:
     *         description: ID de usuario inválido
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Usuario no autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Usuario no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async findUserById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const user = await this.userService.findUserById(+id);
            return ApiResponse.success(res, user, 200);
        } catch (error: any) {
            if(error instanceof ApiError){
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /users/email:
     *   post:
     *     summary: Buscar usuario por email
     *     description: Busca un usuario específico por su correo electrónico
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Correo electrónico del usuario
     *                 example: usuario@ejemplo.com
     *     responses:
     *       200:
     *         description: Usuario encontrado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/User'
     *       400:
     *         description: Email requerido
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Usuario no autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Usuario no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async findUserByEmail(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = req.body;
            if (!email) {
                return ApiResponse.error(res, "El email es requerido", 400);
            }
            const user = await this.userService.findUserByEmail(email);
            return ApiResponse.success(res, user, 200);
        } catch (error: any) {
            if(error instanceof ApiError){
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /users/role/{role}:
     *   get:
     *     summary: Obtener usuarios por rol
     *     description: Obtiene todos los usuarios que tienen un rol específico
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: role
     *         required: true
     *         schema:
     *           type: string
     *           enum: [USER, ADMIN, DRIVER, OWNER_VEHICLE]
     *         description: Rol de los usuarios a buscar
     *         example: DRIVER
     *     responses:
     *       200:
     *         description: Usuarios encontrados exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/User'
     *       400:
     *         description: Rol inválido
     *       404:
     *         description: No se encontraron usuarios con ese rol
     *       500:
     *         description: Error interno del servidor
     */
    async findUsersByRole(req: Request, res: Response): Promise<Response> {
        try {
            const { role } = req.params;
            if (!role) {
                return ApiResponse.error(res, "El rol es requerido", 400);
            }
            
            const validRoles = ['USER', 'ADMIN', 'DRIVER', 'OWNER_VEHICLE'];
            if (!validRoles.includes(role.toUpperCase())) {
                return ApiResponse.error(res, "Rol inválido", 400);
            }
            
            const users = await this.userService.findUsersByRole(role.toUpperCase());
            return ApiResponse.success(res, users, 200);
        } catch (error: any) {
            if(error instanceof ApiError){
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /users/available-drivers:
     *   get:
     *     summary: Obtener usuarios disponibles para ser conductores
     *     description: Obtiene todos los usuarios que pueden ser asignados como conductores (no tienen perfil de conductor ya creado)
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Usuarios disponibles encontrados exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/User'
     *       404:
     *         description: No se encontraron usuarios disponibles
     *       500:
     *         description: Error interno del servidor
     */
    async findAvailableDriverUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.userService.findAvailableDriverUsers();
            return ApiResponse.success(res, users, 200);
        } catch (error: any) {
            if(error instanceof ApiError){
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Crear nuevo usuario
     *     description: Crea un nuevo usuario en el sistema
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - password
     *               - role
     *             properties:
     *               name:
     *                 type: string
     *                 description: Nombre del usuario
     *                 example: Juan Pérez
     *               lastName:
     *                 type: string
     *                 description: Apellido del usuario
     *                 example: García
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Correo electrónico único
     *                 example: juan.perez@ejemplo.com
     *               password:
     *                 type: string
     *                 format: password
     *                 description: Contraseña del usuario
     *                 example: password123
     *               phone:
     *                 type: string
     *                 description: Número de teléfono
     *                 example: "+1234567890"
     *               role:
     *                 type: string
     *                 enum: [USER, ADMIN, DRIVER, OWNER]
     *                 description: Rol del usuario
     *                 example: USER
     *     responses:
     *       201:
     *         description: Usuario creado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/User'
     *       400:
     *         description: Datos de entrada inválidos
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Usuario no autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       409:
     *         description: El email ya está en uso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const userData = plainToInstance(CreateUserDto, req.body);
            const errors = await validate(userData);
            if(errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newUser = await this.userService.createUser(userData);
            return ApiResponse.success(res, newUser, 201);
        } catch (error: any) {
            if(error instanceof ApiError){
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   put:
     *     summary: Actualizar usuario
     *     description: Actualiza la información de un usuario existente
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID único del usuario
     *         example: 1
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Nombre del usuario
     *                 example: Juan Pérez
     *               lastName:
     *                 type: string
     *                 description: Apellido del usuario
     *                 example: García
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Correo electrónico
     *                 example: juan.perez@ejemplo.com
     *               phone:
     *                 type: string
     *                 description: Número de teléfono
     *                 example: "+1234567890"
     *               role:
     *                 type: string
     *                 enum: [USER, ADMIN, DRIVER, OWNER]
     *                 description: Rol del usuario
     *                 example: USER
     *               status:
     *                 type: string
     *                 enum: [ACTIVE, INACTIVE, SUSPENDED]
     *                 description: Estado del usuario
     *                 example: ACTIVE
     *     responses:
     *       200:
     *         description: Usuario actualizado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/User'
     *       400:
     *         description: Datos de entrada inválidos
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Usuario no autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Usuario no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const userData = plainToInstance(UpdateUserDto, req.body);
            const errors = await validate(userData);
            const validationError = ValidateParams.validatePositiveInteger(+id);

            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }

            if(errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const updatedUser = await this.userService.updateUser(+id, userData);
            return ApiResponse.success(res, updatedUser, 200);

        }catch(error: any){
            if(error instanceof ApiError){
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Eliminar usuario
     *     description: Elimina un usuario del sistema
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID único del usuario a eliminar
     *         example: 1
     *     responses:
     *       200:
     *         description: Usuario eliminado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         message:
     *                           type: string
     *                           example: "Usuario eliminado correctamente"
     *       400:
     *         description: ID de usuario inválido
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Usuario no autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Usuario no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async deleteUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.userService.deleteUser(+id);
            return ApiResponse.success(res, { message: "Usuario eliminado correctamente" }, 200);
        } catch (error: any) {
            if(error instanceof ApiError){
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @openapi
     * /api/v1/users/stats:
     *   get:
     *     tags: [Users]
     *     summary: Obtener estadísticas de usuarios
     *     description: Devuelve estadísticas generales de los usuarios del sistema
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Estadísticas obtenidas exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         total:
     *                           type: number
     *                           description: Total de usuarios
     *                         active:
     *                           type: number
     *                           description: Usuarios activos
     *                         pending:
     *                           type: number
     *                           description: Usuarios pendientes
     *                         byRole:
     *                           type: object
     *                           properties:
     *                             admin:
     *                               type: number
     *                             user:
     *                               type: number
     *                             driver:
     *                               type: number
     *                         emailVerified:
     *                           type: number
     *                           description: Usuarios con email verificado
     *                         recentUsers:
     *                           type: number
     *                           description: Usuarios registrados en los últimos 30 días
     *       401:
     *         $ref: '#/components/responses/Unauthorized'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    async getStats(req: Request, res: Response): Promise<Response> {
        try {
            const stats = await this.userService.getStats();
            return ApiResponse.success(res, stats);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * @swagger
     * /users/role/{role}:
     *   get:
     *     summary: Obtener usuarios por rol
     *     description: Obtiene una lista de usuarios filtrados por rol
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: role
     *         required: true
     *         schema:
     *           type: string
     *           enum: [ADMIN, USER, DRIVER, OWNER_VEHICLE]
     *         description: Rol de usuario a filtrar
     *     responses:
     *       200:
     *         description: Lista de usuarios filtrada exitosamente
     */
    async getUsersByRole(req: Request, res: Response): Promise<Response> {
        try {
            const { role } = req.params;
            const users = await this.userService.findUsersByRole(role);
            return ApiResponse.success(res, users);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * @swagger
     * /users/available-drivers:
     *   get:
     *     summary: Obtener usuarios disponibles para ser conductores
     *     description: Obtiene usuarios que pueden ser asignados como conductores
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de usuarios disponibles
     */
    async getAvailableDriverUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.userService.findAvailableDriverUsers();
            return ApiResponse.success(res, users);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * @swagger
     * /users/{id}/driver-profile:
     *   put:
     *     summary: Actualizar perfil de conductor
     *     description: Actualiza los campos específicos del conductor para un usuario
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del usuario
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               license:
     *                 type: string
     *               licenseExpiration:
     *                 type: string
     *                 format: date
     *               driverExperience:
     *                 type: string
     *               driverRating:
     *                 type: number
     *               totalTrips:
     *                 type: integer
     *               isDriverVerified:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Perfil de conductor actualizado exitosamente
     */
    async updateDriverProfile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = ValidateParams.validateId(req.params.id);
            
            const driverDto = plainToInstance(UpdateDriverProfileDto, req.body);
            const errors = await validate(driverDto);
            
            if (errors.length > 0) {
                const errorMessages = errors.map(error => 
                    Object.values(error.constraints || {}).join(', ')
                ).join('; ');
                return ApiResponse.error(res, errorMessages, 400);
            }

            const updatedUser = await this.userService.updateDriverProfile(userId, driverDto);
            return ApiResponse.success(res, updatedUser);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * @swagger
     * /users/{id}/owner-profile:
     *   put:
     *     summary: Actualizar perfil de propietario
     *     description: Actualiza los campos específicos del propietario para un usuario
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del usuario
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               company:
     *                 type: string
     *               contact:
     *                 type: string
     *               rfc:
     *                 type: string
     *               address:
     *                 type: string
     *               totalVehicles:
     *                 type: integer
     *               lastPayment:
     *                 type: string
     *                 format: date
     *               isOwnerVerified:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Perfil de propietario actualizado exitosamente
     */
    async updateOwnerProfile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = ValidateParams.validateId(req.params.id);
            
            const ownerDto = plainToInstance(UpdateOwnerProfileDto, req.body);
            const errors = await validate(ownerDto);
            
            if (errors.length > 0) {
                const errorMessages = errors.map(error => 
                    Object.values(error.constraints || {}).join(', ')
                ).join('; ');
                return ApiResponse.error(res, errorMessages, 400);
            }

            const updatedUser = await this.userService.updateOwnerProfile(userId, ownerDto);
            return ApiResponse.success(res, updatedUser);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * @swagger
     * /users/drivers:
     *   get:
     *     summary: Obtener todos los conductores
     *     description: Obtiene usuarios con rol de conductor
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de conductores
     */
    async getDriverUsers(req: Request, res: Response): Promise<Response> {
        try {
            const drivers = await this.userService.getDriverUsers();
            return ApiResponse.success(res, drivers);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * @swagger
     * /users/owners:
     *   get:
     *     summary: Obtener todos los propietarios
     *     description: Obtiene usuarios con rol de propietario de vehículos
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de propietarios
     */
    async getOwnerUsers(req: Request, res: Response): Promise<Response> {
        try {
            const owners = await this.userService.getOwnerUsers();
            return ApiResponse.success(res, owners);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }
}