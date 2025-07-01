import { RouteStop } from "../../../generated/prisma";
import { CreateRouteStopDto } from "./dto/create-route-stop.dto";
import { UpdateRouteStopDto } from "./dto/update-route-stop.dto";
import { RouteStopRepositoryInterface } from "./interfaces/RouteStopRepository.interface";
import { RouteStopServiceInterface } from "./interfaces/RouteStopService.interface";

export class RouteStopService implements RouteStopServiceInterface {
    constructor(
        private readonly routeStopRepository: RouteStopRepositoryInterface
    ) { }

    async findAllRouteStops(): Promise<RouteStop[]> {
        return this.routeStopRepository.findAll();
    }

    async findRouteStopById(id: number): Promise<RouteStop> {
        return this.routeStopRepository.findById(id);
    }

    async findRouteStopsByRouteId(routeId: number): Promise<RouteStop[]> {
        return this.routeStopRepository.findByRouteId(routeId);
    }

    async findRouteStopsByStopId(stopId: number): Promise<RouteStop[]> {
        return this.routeStopRepository.findByStopId(stopId);
    }

    async createRouteStop(routeStopData: CreateRouteStopDto): Promise<RouteStop> {
        return this.routeStopRepository.createRouteStop(routeStopData);
    }

    async updateRouteStop(id: number, routeStopData: UpdateRouteStopDto): Promise<RouteStop> {
        return this.routeStopRepository.updateRouteStop(id, routeStopData);
    }

    async deleteRouteStop(id: number): Promise<void> {
        return this.routeStopRepository.deleteRouteStop(id);
    }
}