import { Stop } from "../../../../generated/prisma";
import { CreateStopDto } from "../dto/create-stop.dto";
import { UpdateStopDto } from "../dto/update-stop.dto";

export interface StopServiceInterface {
    findAllStops(): Promise<Stop[]>;
    findStopById(id: number): Promise<Stop>;
    createStop(stopData: CreateStopDto): Promise<Stop>;
    updateStop(id: number, stopData: UpdateStopDto): Promise<Stop>;
    deleteStop(id: number): Promise<void>;
}
