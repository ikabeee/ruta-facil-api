import { Route } from "../../../../generated/prisma";
import { CreateRouteDto } from "../dto/create-route.dto";
import { UpdateRouteDto } from "../dto/update-route.dto";

export interface RouteServiceInterface {
    findAllRoutes(): Promise<Route[]>;
    findRouteById(id: number): Promise<Route>;
    findRoutesByName(name: string): Promise<Route[]>;
    createRoute(routeData: CreateRouteDto): Promise<Route>;
    updateRoute(id: number, routeData: UpdateRouteDto): Promise<Route>;
    deleteRoute(id: number): Promise<void>;
}
