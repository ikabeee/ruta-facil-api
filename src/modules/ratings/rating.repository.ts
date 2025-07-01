import { PrismaClient, Rating } from "../../../generated/prisma";
import { ApiError } from "../../shared/errors/ApiError";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";
import { RatingRepositoryInterface } from "./interfaces/RatingRepository.interface";

export class RatingRepository implements RatingRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    async findAll(): Promise<Rating[]> {
        const ratings = await this.prisma.rating.findMany();
        return ratings;
    }

    async findById(id: number): Promise<Rating> {
        try {
            const rating = await this.prisma.rating.findUnique({
                where: { id }
            });
            if (!rating) {
                throw new ApiError(404, `Rating con id ${id} no encontrado.`);
            }
            return rating;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar el rating con id ${id}`);
        }
    }

    async createRating(ratingData: CreateRatingDto): Promise<Rating> {
        try {
            const rating = await this.prisma.rating.create({
                data: {
                    ...ratingData
                }
            });
            return rating;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al crear el rating: ${error.message}`);
        }
    }

    async updateRating(id: number, ratingData: UpdateRatingDto): Promise<Rating> {
        try {
            const rating = await this.prisma.rating.findUnique({
                where: { id }
            });
            if (!rating) {
                throw new ApiError(404, `Rating con id ${id} no encontrado.`);
            }
            const ratingUpdated = await this.prisma.rating.update({
                where: { id },
                data: {
                    ...ratingData
                }
            });
            return ratingUpdated;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar el rating con id ${id}`);
        }
    }

    async deleteRating(id: number): Promise<void> {
        try {
            const rating = await this.prisma.rating.findUnique({
                where: { id }
            });
            if (!rating) {
                throw new ApiError(404, `Rating con id ${id} no encontrado.`);
            }
            await this.prisma.rating.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al eliminar el rating con id ${id}`);
        }
    }
}