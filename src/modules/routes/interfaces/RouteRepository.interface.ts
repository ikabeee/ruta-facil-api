import { Route } from "../../../../generated/prisma";
import { CreateRouteDto } from "../dto/create-route.dto";
import { UpdateRouteDto } from "../dto/update-route.dto";

export interface RouteRepositoryInterface {
    findAll(): Promise<Route[]>;
    findById(id: number): Promise<Route>;
    findByName(name: string): Promise<Route[]>;
    createRoute(routeData: CreateRouteDto): Promise<Route>;
    updateRoute(id: number, routeData: UpdateRouteDto): Promise<Route>;
    deleteRoute(id: number): Promise<void>;
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        averageDistance: number;
        totalStops: number;
        assignedUnits: number;
        dailyTrips: number;
        topRoutes: Array<{
            id: number;
            name: string;
            code: string | null;
            totalStops: number;
            assignedUnits: number;
        }>;
    }>;
}
