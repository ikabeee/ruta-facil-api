import { Stop } from "../../../generated/prisma";
import { CreateStopDto } from "./dto/create-stop.dto";
import { UpdateStopDto } from "./dto/update-stop.dto";
import { StopRepositoryInterface } from "./interfaces/StopRepository.interface";
import { StopServiceInterface } from "./interfaces/StopService.interface";

export class StopService implements StopServiceInterface {
    constructor(
        private readonly stopRepository: StopRepositoryInterface
    ) { }

    async findAllStops(): Promise<Stop[]> {
        return this.stopRepository.findAll();
    }

    async findStopById(id: number): Promise<Stop> {
        return this.stopRepository.findById(id);
    }

    async createStop(stopData: CreateStopDto): Promise<Stop> {
        return this.stopRepository.createStop(stopData);
    }

    async updateStop(id: number, stopData: UpdateStopDto): Promise<Stop> {
        return this.stopRepository.updateStop(id, stopData);
    }

    async deleteStop(id: number): Promise<void> {
        return this.stopRepository.deleteStop(id);
    }
}