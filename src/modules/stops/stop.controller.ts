import { Request, Response } from "express";
import { StopServiceInterface } from "./interfaces/StopService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateStopDto } from "./dto/create-stop.dto";
import { validate } from "class-validator";
import { UpdateStopDto } from "./dto/update-stop.dto";

export class StopController {
    constructor(private readonly stopService: StopServiceInterface) {}

    async findAllStops(_req: Request, res: Response): Promise<Response> {
        try {
            const stops = await this.stopService.findAllStops();
            return ApiResponse.success(res, stops, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findStopById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const stop = await this.stopService.findStopById(+id);
            return ApiResponse.success(res, stop, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async createStop(req: Request, res: Response): Promise<Response> {
        try {
            const stopData = plainToInstance(CreateStopDto, req.body);
            const errors = await validate(stopData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newStop = await this.stopService.createStop(stopData);
            return ApiResponse.success(res, newStop, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async updateStop(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const stopData = plainToInstance(UpdateStopDto, req.body);
            const errors = await validate(stopData);
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
            const updatedStop = await this.stopService.updateStop(+id, stopData);
            return ApiResponse.success(res, updatedStop, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async deleteStop(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.stopService.deleteStop(+id);
            return ApiResponse.success(res, { message: "Parada eliminada correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}