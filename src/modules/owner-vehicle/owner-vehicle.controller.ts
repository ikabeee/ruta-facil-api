import { Request, Response } from "express";
import { OwnerVehicleServiceInterface } from "./interfaces/OwnerVehicleService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateOwnerVehicleDto } from "./dto/create-owner-vehicle.dto";
import { validate } from "class-validator";
import { UpdateOwnerVehicleDto } from "./dto/update-owner-vehicle.dto";

export class OwnerVehicleController {
    constructor(private readonly ownerVehicleService: OwnerVehicleServiceInterface) {}

    async findAllOwnerVehicles(_req: Request, res: Response): Promise<Response> {
        try {
            const ownerVehicles = await this.ownerVehicleService.findAllOwnerVehicles();
            return ApiResponse.success(res, ownerVehicles, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findOwnerVehicleById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const ownerVehicle = await this.ownerVehicleService.findOwnerVehicleById(+id);
            return ApiResponse.success(res, ownerVehicle, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findOwnerVehiclesByUserId(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+userId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const ownerVehicles = await this.ownerVehicleService.findOwnerVehiclesByUserId(+userId);
            return ApiResponse.success(res, ownerVehicles, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findOwnerVehiclesByVehicleId(req: Request, res: Response): Promise<Response> {
        try {
            const { vehicleId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+vehicleId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const ownerVehicles = await this.ownerVehicleService.findOwnerVehiclesByVehicleId(+vehicleId);
            return ApiResponse.success(res, ownerVehicles, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findOwnerVehicleByUserIdAndVehicleId(req: Request, res: Response): Promise<Response> {
        try {
            const { userId, vehicleId } = req.params;
            const userIdValidation = ValidateParams.validatePositiveInteger(+userId);
            const vehicleIdValidation = ValidateParams.validatePositiveInteger(+vehicleId);
            
            if (userIdValidation) {
                return ApiResponse.error(res, userIdValidation, 400);
            }
            if (vehicleIdValidation) {
                return ApiResponse.error(res, vehicleIdValidation, 400);
            }
            
            const ownerVehicle = await this.ownerVehicleService.findOwnerVehicleByUserIdAndVehicleId(+userId, +vehicleId);
            if (!ownerVehicle) {
                return ApiResponse.error(res, "No se encontró relación entre el usuario y el vehículo", 404);
            }
            return ApiResponse.success(res, ownerVehicle, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async createOwnerVehicle(req: Request, res: Response): Promise<Response> {
        try {
            const ownerVehicleData = plainToInstance(CreateOwnerVehicleDto, req.body);
            const errors = await validate(ownerVehicleData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newOwnerVehicle = await this.ownerVehicleService.createOwnerVehicle(ownerVehicleData);
            return ApiResponse.success(res, newOwnerVehicle, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async updateOwnerVehicle(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const ownerVehicleData = plainToInstance(UpdateOwnerVehicleDto, req.body);
            const errors = await validate(ownerVehicleData);
            const validationError = ValidateParams.validatePositiveInteger(+id);

            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }

            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const updatedOwnerVehicle = await this.ownerVehicleService.updateOwnerVehicle(+id, ownerVehicleData);
            return ApiResponse.success(res, updatedOwnerVehicle, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async deleteOwnerVehicle(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.ownerVehicleService.deleteOwnerVehicle(+id);
            return ApiResponse.success(res, { message: "Relación propietario-vehículo eliminada correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
