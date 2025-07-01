import { Route } from "../../../generated/prisma";
import { CreateRouteDto } from "./dto/create-route.dto";
import { UpdateRouteDto } from "./dto/update-route.dto";
import { RouteRepositoryInterface } from "./interfaces/RouteRepository.interface";
import { RouteServiceInterface } from "./interfaces/RouteService.interface";

export class RouteService implements RouteServiceInterface {
    constructor(
        private readonly routeRepository: RouteRepositoryInterface
    ) { }

    async findAllRoutes(): Promise<Route[]> {
        return this.routeRepository.findAll();
    }

    async findRouteById(id: number): Promise<Route> {
        return this.routeRepository.findById(id);
    }

    async findRoutesByName(name: string): Promise<Route[]> {
        return this.routeRepository.findByName(name);
    }

    async createRoute(routeData: CreateRouteDto): Promise<Route> {
        return this.routeRepository.createRoute(routeData);
    }

    async updateRoute(id: number, routeData: UpdateRouteDto): Promise<Route> {
        return this.routeRepository.updateRoute(id, routeData);
    }

    async deleteRoute(id: number): Promise<void> {
        return this.routeRepository.deleteRoute(id);
    }
}