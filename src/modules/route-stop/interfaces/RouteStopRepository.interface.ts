import { RouteStop } from "../../../../generated/prisma";
import { CreateRouteStopDto } from "../dto/create-route-stop.dto";
import { UpdateRouteStopDto } from "../dto/update-route-stop.dto";

export interface RouteStopRepositoryInterface {
    findAll(): Promise<RouteStop[]>;
    findById(id: number): Promise<RouteStop>;
    findByRouteId(routeId: number): Promise<RouteStop[]>;
    findByStopId(stopId: number): Promise<RouteStop[]>;
    createRouteStop(routeStopData: CreateRouteStopDto): Promise<RouteStop>;
    updateRouteStop(id: number, routeStopData: UpdateRouteStopDto): Promise<RouteStop>;
    deleteRouteStop(id: number): Promise<void>;
}
