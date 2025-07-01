import { Request, Response } from "express";
import { DriverServiceInterface } from "./interfaces/DriverService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateDriverDto } from "./dto/create-driver.dto";
import { validate } from "class-validator";
import { UpdateDriverDto } from "./dto/update-driver.dto";

export class DriverController {
    constructor(private readonly driverService: DriverServiceInterface) {}

    async findAllDrivers(_req: Request, res: Response): Promise<Response> {
        try {
            const drivers = await this.driverService.findAllDrivers();
            return ApiResponse.success(res, drivers, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findDriverById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const driver = await this.driverService.findDriverById(+id);
            return ApiResponse.success(res, driver, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findDriverByUserId(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+userId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const driver = await this.driverService.findDriverByUserId(+userId);
            if (!driver) {
                return ApiResponse.error(res, "No se encontró conductor para este usuario", 404);
            }
            return ApiResponse.success(res, driver, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async createDriver(req: Request, res: Response): Promise<Response> {
        try {
            const driverData = plainToInstance(CreateDriverDto, req.body);
            const errors = await validate(driverData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newDriver = await this.driverService.createDriver(driverData);
            return ApiResponse.success(res, newDriver, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async updateDriver(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const driverData = plainToInstance(UpdateDriverDto, req.body);
            const errors = await validate(driverData);
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
            const updatedDriver = await this.driverService.updateDriver(+id, driverData);
            return ApiResponse.success(res, updatedDriver, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async deleteDriver(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.driverService.deleteDriver(+id);
            return ApiResponse.success(res, { message: "Conductor eliminado correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
