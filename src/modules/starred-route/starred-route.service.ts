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

    async createStarredRoute(starredRouteData: CreateStarredRouteDto): Promise<StarredRoute> {
        return this.starredRouteRepository.createStarredRoute(starredRouteData);
    }

    async updateStarredRoute(id: number, starredRouteData: UpdateStarredRouteDto): Promise<StarredRoute> {
        return this.starredRouteRepository.updateStarredRoute(id, starredRouteData);
    }

    async deleteStarredRoute(id: number): Promise<void> {
        return this.starredRouteRepository.deleteStarredRoute(id);
    }
}