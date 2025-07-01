import { PrismaClient, Stop } from "../../../generated/prisma";
import { ApiError } from "../../shared/errors/ApiError";
import { CreateStopDto } from "./dto/create-stop.dto";
import { UpdateStopDto } from "./dto/update-stop.dto";
import { StopRepositoryInterface } from "./interfaces/StopRepository.interface";

export class StopRepository implements StopRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    async findAll(): Promise<Stop[]> {
        const stops = await this.prisma.stop.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return stops;
    }

    async findById(id: number): Promise<Stop> {
        try {
            const stop = await this.prisma.stop.findUnique({
                where: { id }
            });
            if (!stop) {
                throw new ApiError(404, `Parada con id ${id} no encontrada.`);
            }
            return stop;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar la parada con id ${id}`);
        }
    }

    async createStop(stopData: CreateStopDto): Promise<Stop> {
        try {
            const stop = await this.prisma.stop.create({
                data: stopData
            });
            return stop;
        } catch (error: any) {
            throw new ApiError(500, `Error al crear la parada: ${error.message}`);
        }
    }

    async updateStop(id: number, stopData: UpdateStopDto): Promise<Stop> {
        try {
            const stop = await this.prisma.stop.findUnique({
                where: { id }
            });
            if (!stop) {
                throw new ApiError(404, `Parada con id ${id} no encontrada.`);
            }
            
            const updatedStop = await this.prisma.stop.update({
                where: { id },
                data: stopData
            });
            return updatedStop;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar la parada con id ${id}`);
        }
    }

    async deleteStop(id: number): Promise<void> {
        try {
            const stop = await this.prisma.stop.findUnique({
                where: { id }
            });
            if (!stop) {
                throw new ApiError(404, `Parada con id ${id} no encontrada.`);
            }
            
            await this.prisma.stop.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al eliminar la parada con id ${id}`);
        }
    }
}