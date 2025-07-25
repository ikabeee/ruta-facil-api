"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteService = void 0;
class RouteService {
    constructor(routeRepository) {
        this.routeRepository = routeRepository;
    }
    async findAllRoutes() {
        return this.routeRepository.findAll();
    }
    async findRouteById(id) {
        return this.routeRepository.findById(id);
    }
    async findRoutesByName(name) {
        return this.routeRepository.findByName(name);
    }
    async findRoutesByOwner(ownerId) {
        return this.routeRepository.findByOwner(ownerId);
    }
    async searchRoutes(searchTerm) {
        return this.routeRepository.searchRoutes(searchTerm);
    }
    async createRoute(routeData) {
        return this.routeRepository.createRoute(routeData);
    }
    async updateRoute(id, routeData) {
        return this.routeRepository.updateRoute(id, routeData);
    }
    async deleteRoute(id) {
        return this.routeRepository.deleteRoute(id);
    }
    async getStats() {
        return this.routeRepository.getStats();
    }
}
exports.RouteService = RouteService;
