import { StarredRoute } from "../../../../generated/prisma";
import { CreateStarredRouteDto } from "../dto/create-starred-route.dto";
import { UpdateStarredRouteDto } from "../dto/update-starred-route.dto";

export interface StarredRouteServiceInterface {
    findAllStarredRoutes(): Promise<StarredRoute[]>;
    findStarredRouteById(id: number): Promise<StarredRoute>;
    findStarredRoutesByUserId(userId: number): Promise<StarredRoute[]>;
    findByUserAndRoute(userId: number, routeId: number): Promise<StarredRoute | null>;
    createStarredRoute(starredRouteData: CreateStarredRouteDto): Promise<StarredRoute>;
    updateStarredRoute(id: number, starredRouteData: UpdateStarredRouteDto): Promise<StarredRoute>;
    deleteStarredRoute(id: number): Promise<void>;
    toggleStarredRoute(userId: number, routeId: number, name?: string): Promise<{ action: 'added' | 'removed', starredRoute?: StarredRoute }>;
}
