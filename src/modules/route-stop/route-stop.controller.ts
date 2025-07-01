import { Request, Response } from "express";
import { RouteStopServiceInterface } from "./interfaces/RouteStopService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateRouteStopDto } from "./dto/create-route-stop.dto";
import { validate } from "class-validator";
import { UpdateRouteStopDto } from "./dto/update-route-stop.dto";

export class RouteStopController {
    constructor(private readonly routeStopService: RouteStopServiceInterface) {}

    async findAllRouteStops(_req: Request, res: Response): Promise<Response> {
        try {
            const routeStops = await this.routeStopService.findAllRouteStops();
            return ApiResponse.success(res, routeStops, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findRouteStopById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const routeStop = await this.routeStopService.findRouteStopById(+id);
            return ApiResponse.success(res, routeStop, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findRouteStopsByRouteId(req: Request, res: Response): Promise<Response> {
        try {
            const { routeId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+routeId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const routeStops = await this.routeStopService.findRouteStopsByRouteId(+routeId);
            return ApiResponse.success(res, routeStops, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findRouteStopsByStopId(req: Request, res: Response): Promise<Response> {
        try {
            const { stopId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+stopId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const routeStops = await this.routeStopService.findRouteStopsByStopId(+stopId);
            return ApiResponse.success(res, routeStops, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async createRouteStop(req: Request, res: Response): Promise<Response> {
        try {
            const routeStopData = plainToInstance(CreateRouteStopDto, req.body);
            const errors = await validate(routeStopData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newRouteStop = await this.routeStopService.createRouteStop(routeStopData);
            return ApiResponse.success(res, newRouteStop, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async updateRouteStop(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const routeStopData = plainToInstance(UpdateRouteStopDto, req.body);
            const errors = await validate(routeStopData);
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
            const updatedRouteStop = await this.routeStopService.updateRouteStop(+id, routeStopData);
            return ApiResponse.success(res, updatedRouteStop, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async deleteRouteStop(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.routeStopService.deleteRouteStop(+id);
            return ApiResponse.success(res, { message: "RouteStop eliminado correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}