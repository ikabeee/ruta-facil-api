import { Request, Response } from "express";
import { VehicleServiceInterface } from "./interfaces/VehicleService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { validate } from "class-validator";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";

export class VehicleController {
    constructor(private readonly vehicleService: VehicleServiceInterface) { }

    async findAllVehicles(_req: Request, res: Response): Promise<Response> {
        try {
            const vehicles = await this.vehicleService.findAllVehicles();
            return ApiResponse.success(res, vehicles, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findVehicleById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicle = await this.vehicleService.findVehicleById(+id);
            return ApiResponse.success(res, vehicle, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findVehicleByPlate(req: Request, res: Response): Promise<Response> {
        try {
            const { plate } = req.body;
            if (!plate) {
                return ApiResponse.error(res, "La placa es requerida", 400);
            }
            const vehicle = await this.vehicleService.findVehicleByPlate(plate);
            return ApiResponse.success(res, vehicle, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async createVehicle(req: Request, res: Response): Promise<Response> {
        try {
            const vehicleData = plainToInstance(CreateVehicleDto, req.body);
            const errors = await validate(vehicleData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newVehicle = await this.vehicleService.createVehicle(vehicleData);
            return ApiResponse.success(res, newVehicle, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async updateVehicle(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const vehicleData = plainToInstance(UpdateVehicleDto, req.body);
            const errors = await validate(vehicleData);
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
            const updatedVehicle = await this.vehicleService.updateVehicle(+id, vehicleData);
            return ApiResponse.success(res, updatedVehicle, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async deleteVehicle(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.vehicleService.deleteVehicle(+id);
            return ApiResponse.success(res, { message: "Vehículo eliminado correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
