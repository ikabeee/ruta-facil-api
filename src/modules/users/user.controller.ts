import { Request, Response } from "express";
import { UserServiceInterface } from "./interfaces/UserService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "./dto/create-user.dto";
import { validate } from "class-validator";
import { UpdateUserDto } from "./dto/update-user.dto";

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
}