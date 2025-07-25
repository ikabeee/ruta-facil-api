import { StarredRoute } from "../../../generated/prisma";
import { CreateStarredRouteDto } from "./dto/create-starred-route.dto";
import { UpdateStarredRouteDto } from "./dto/update-starred-route.dto";
import { StarredRouteRepositoryInterface } from "./interfaces/StarredRouteRepository.interface";
import { StarredRouteServiceInterface } from "./interfaces/StarredRouteService.interface";

export class StarredRouteService implements StarredRouteServiceInterface {
    constructor(
        private readonly starredRouteRepository: StarredRouteRepositoryInterface
    ) { }

    async findAllStarredRoutes(): Promise<StarredRoute[]> {
        return this.starredRouteRepository.findAll();
    }

    async findStarredRouteById(id: number): Promise<StarredRoute> {
        return this.starredRouteRepository.findById(id);
    }

    async findStarredRoutesByUserId(userId: number): Promise<StarredRoute[]> {
        return this.starredRouteRepository.findByUserId(userId);
    }

    async findByUserAndRoute(userId: number, routeId: number): Promise<StarredRoute | null> {
        return this.starredRouteRepository.findByUserAndRoute(userId, routeId);
    }

    async createStarredRoute(starredRouteData: CreateStarredRouteDto): Promise<StarredRoute> {
        return this.starredRouteRepository.createStarredRoute(starredRouteData);
    }

    async updateStarredRoute(id: number, starredRouteData: UpdateStarredRouteDto): Promise<StarredRoute> {
        return this.starredRouteRepository.updateStarredRoute(id, starredRouteData);
    }

    async deleteStarredRoute(id: number): Promise<void> {
        return this.starredRouteRepository.deleteStarredRoute(id);
    }

    async toggleStarredRoute(userId: number, routeId: number, name?: string): Promise<{ action: 'added' | 'removed', starredRoute?: StarredRoute }> {
        // Verificar si ya existe
        const existing = await this.starredRouteRepository.findByUserAndRoute(userId, routeId);
        
        if (existing) {
            // Si existe, eliminar
            await this.starredRouteRepository.deleteByUserAndRoute(userId, routeId);
            return { action: 'removed' };
        } else {
            // Si no existe, crear
            const starredRoute = await this.starredRouteRepository.createStarredRoute({
                name: name || 'Mi ruta favorita',
                routeId,
                userId
            });
            return { action: 'added', starredRoute };
        }
    }
}