import { RouteStop } from "../../../../generated/prisma";
import { CreateRouteStopDto } from "../dto/create-route-stop.dto";
import { UpdateRouteStopDto } from "../dto/update-route-stop.dto";

export interface RouteStopServiceInterface {
    findAllRouteStops(): Promise<RouteStop[]>;
    findRouteStopById(id: number): Promise<RouteStop>;
    findRouteStopsByRouteId(routeId: number): Promise<RouteStop[]>;
    findRouteStopsByStopId(stopId: number): Promise<RouteStop[]>;
    createRouteStop(routeStopData: CreateRouteStopDto): Promise<RouteStop>;
    updateRouteStop(id: number, routeStopData: UpdateRouteStopDto): Promise<RouteStop>;
    deleteRouteStop(id: number): Promise<void>;
}
