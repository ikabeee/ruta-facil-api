import { Request, Response } from "express";
import { StarredRouteServiceInterface } from "./interfaces/StarredRouteService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateStarredRouteDto } from "./dto/create-starred-route.dto";
import { validate } from "class-validator";
import { UpdateStarredRouteDto } from "./dto/update-starred-route.dto";

export class StarredRouteController {
    constructor(private readonly starredRouteService: StarredRouteServiceInterface) {}

    async findAllStarredRoutes(_req: Request, res: Response): Promise<Response> {
        try {
            const starredRoutes = await this.starredRouteService.findAllStarredRoutes();
            return ApiResponse.success(res, starredRoutes, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findStarredRouteById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const starredRoute = await this.starredRouteService.findStarredRouteById(+id);
            return ApiResponse.success(res, starredRoute, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async createStarredRoute(req: Request, res: Response): Promise<Response> {
        try {
            const starredRouteData = plainToInstance(CreateStarredRouteDto, req.body);
            const errors = await validate(starredRouteData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newStarredRoute = await this.starredRouteService.createStarredRoute(starredRouteData);
            return ApiResponse.success(res, newStarredRoute, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async updateStarredRoute(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const starredRouteData = plainToInstance(UpdateStarredRouteDto, req.body);
            const errors = await validate(starredRouteData);
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
            const updatedStarredRoute = await this.starredRouteService.updateStarredRoute(+id, starredRouteData);
            return ApiResponse.success(res, updatedStarredRoute, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async deleteStarredRoute(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.starredRouteService.deleteStarredRoute(+id);
            return ApiResponse.success(res, { message: "Ruta favorita eliminada correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}