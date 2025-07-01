import { Request, Response } from "express";
import { RouteServiceInterface } from "./interfaces/RouteService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateRouteDto } from "./dto/create-route.dto";
import { validate } from "class-validator";
import { UpdateRouteDto } from "./dto/update-route.dto";

export class RouteController {
    constructor(private readonly routeService: RouteServiceInterface) {}

    async findAllRoutes(_req: Request, res: Response): Promise<Response> {
        try {
            const routes = await this.routeService.findAllRoutes();
            return ApiResponse.success(res, routes, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findRouteById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const route = await this.routeService.findRouteById(+id);
            return ApiResponse.success(res, route, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findRoutesByName(req: Request, res: Response): Promise<Response> {
        try {
            const { name } = req.query;
            if (!name || typeof name !== 'string') {
                return ApiResponse.error(res, "El nombre es requerido y debe ser una cadena de texto", 400);
            }
            const routes = await this.routeService.findRoutesByName(name);
            return ApiResponse.success(res, routes, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async createRoute(req: Request, res: Response): Promise<Response> {
        try {
            const routeData = plainToInstance(CreateRouteDto, req.body);
            const errors = await validate(routeData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newRoute = await this.routeService.createRoute(routeData);
            return ApiResponse.success(res, newRoute, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async updateRoute(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const routeData = plainToInstance(UpdateRouteDto, req.body);
            const errors = await validate(routeData);
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
            const updatedRoute = await this.routeService.updateRoute(+id, routeData);
            return ApiResponse.success(res, updatedRoute, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async deleteRoute(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.routeService.deleteRoute(+id);
            return ApiResponse.success(res, { message: "Ruta eliminada correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}