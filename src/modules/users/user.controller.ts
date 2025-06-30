import { Request, Response } from "express";
import { UserServiceInterface } from "./interfaces/UserService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "./dto/create-user.dto";
import { validate } from "class-validator";

export class UserController {
    constructor(private readonly userService: UserServiceInterface) {}
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
}