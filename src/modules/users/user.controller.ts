import { Request, Response } from "express";
import { UserServiceInterface } from "./interfaces/UserService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";

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
}