import { PrismaClient, StarredRoute } from "../../../generated/prisma";
import { ApiError } from "../../shared/errors/ApiError";
import { CreateStarredRouteDto } from "./dto/create-starred-route.dto";
import { UpdateStarredRouteDto } from "./dto/update-starred-route.dto";
import { StarredRouteRepositoryInterface } from "./interfaces/StarredRouteRepository.interface";

export class StarredRouteRepository implements StarredRouteRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    async findAll(): Promise<StarredRoute[]> {
        const starredRoutes = await this.prisma.starredRoute.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return starredRoutes;
    }

    async findById(id: number): Promise<StarredRoute> {
        try {
            const starredRoute = await this.prisma.starredRoute.findUnique({
                where: { id }
            });
            if (!starredRoute) {
                throw new ApiError(404, `Ruta favorita con id ${id} no encontrada.`);
            }
            return starredRoute;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar la ruta favorita con id ${id}`);
        }
    }

    async createStarredRoute(starredRouteData: CreateStarredRouteDto): Promise<StarredRoute> {
        try {
            const starredRoute = await this.prisma.starredRoute.create({
                data: {
                    name: starredRouteData.name,
                    description: starredRouteData.description
                }
            });
            return starredRoute;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al crear la ruta favorita: ${error.message}`);
        }
    }

    async updateStarredRoute(id: number, starredRouteData: UpdateStarredRouteDto): Promise<StarredRoute> {
        try {
            const starredRoute = await this.prisma.starredRoute.findUnique({
                where: { id }
            });
            if (!starredRoute) {
                throw new ApiError(404, `Ruta favorita con id ${id} no encontrada.`);
            }
            const updatedStarredRoute = await this.prisma.starredRoute.update({
                where: { id },
                data: {
                    ...(starredRouteData.name && { name: starredRouteData.name }),
                    ...(starredRouteData.description !== undefined && { description: starredRouteData.description })
                }
            });
            return updatedStarredRoute;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar la ruta favorita con id ${id}`);
        }
    }

    async deleteStarredRoute(id: number): Promise<void> {
        try {
            const starredRoute = await this.prisma.starredRoute.findUnique({
                where: { id }
            });
            if (!starredRoute) {
                throw new ApiError(404, `Ruta favorita con id ${id} no encontrada.`);
            }
            await this.prisma.starredRoute.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al eliminar la ruta favorita con id ${id}`);
        }
    }
}