import { Request, Response } from "express";
import { VehicleLocationServiceInterface } from "./interfaces/VehicleLocationService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateVehicleLocationDto } from "./dto/create-vehicle-location.dto";
import { validate } from "class-validator";
import { UpdateVehicleLocationDto } from "./dto/update-vehicle-location.dto";

export class VehicleLocationController {
    constructor(private readonly vehicleLocationService: VehicleLocationServiceInterface) { }

    async findAllVehicleLocations(_req: Request, res: Response): Promise<Response> {
        try {
            const vehicleLocations = await this.vehicleLocationService.findAllVehicleLocations();
            return ApiResponse.success(res, vehicleLocations, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findVehicleLocationById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleLocation = await this.vehicleLocationService.findVehicleLocationById(+id);
            return ApiResponse.success(res, vehicleLocation, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findVehicleLocationsByVehicleId(req: Request, res: Response): Promise<Response> {
        try {
            const { vehicleId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+vehicleId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleLocations = await this.vehicleLocationService.findVehicleLocationsByVehicleId(+vehicleId);
            return ApiResponse.success(res, vehicleLocations, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findLatestVehicleLocationByVehicleId(req: Request, res: Response): Promise<Response> {
        try {
            const { vehicleId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+vehicleId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleLocation = await this.vehicleLocationService.findLatestVehicleLocationByVehicleId(+vehicleId);
            return ApiResponse.success(res, vehicleLocation, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async createVehicleLocation(req: Request, res: Response): Promise<Response> {
        try {
            const vehicleLocationData = plainToInstance(CreateVehicleLocationDto, req.body);
            const errors = await validate(vehicleLocationData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newVehicleLocation = await this.vehicleLocationService.createVehicleLocation(vehicleLocationData);
            return ApiResponse.success(res, newVehicleLocation, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async updateVehicleLocation(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const vehicleLocationData = plainToInstance(UpdateVehicleLocationDto, req.body);
            const errors = await validate(vehicleLocationData);
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
            const updatedVehicleLocation = await this.vehicleLocationService.updateVehicleLocation(+id, vehicleLocationData);
            return ApiResponse.success(res, updatedVehicleLocation, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async deleteVehicleLocation(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.vehicleLocationService.deleteVehicleLocation(+id);
            return ApiResponse.success(res, { message: "Ubicación de vehículo eliminada correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
