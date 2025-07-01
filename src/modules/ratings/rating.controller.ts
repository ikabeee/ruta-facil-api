import { Request, Response } from "express";
import { RatingServiceInterface } from "./interfaces/RatingService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { validate } from "class-validator";
import { UpdateRatingDto } from "./dto/update-rating.dto";

export class RatingController {
    constructor(private readonly ratingService: RatingServiceInterface) {}

    async findAllRatings(_req: Request, res: Response): Promise<Response> {
        try {
            const ratings = await this.ratingService.findAllRatings();
            return ApiResponse.success(res, ratings, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findRatingById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const rating = await this.ratingService.findRatingById(+id);
            return ApiResponse.success(res, rating, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async createRating(req: Request, res: Response): Promise<Response> {
        try {
            const ratingData = plainToInstance(CreateRatingDto, req.body);
            const errors = await validate(ratingData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newRating = await this.ratingService.createRating(ratingData);
            return ApiResponse.success(res, newRating, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async updateRating(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const ratingData = plainToInstance(UpdateRatingDto, req.body);
            const errors = await validate(ratingData);
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
            const updatedRating = await this.ratingService.updateRating(+id, ratingData);
            return ApiResponse.success(res, updatedRating, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async deleteRating(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.ratingService.deleteRating(+id);
            return ApiResponse.success(res, { message: "Rating eliminado correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}