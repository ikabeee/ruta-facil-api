import { Stop } from "../../../../generated/prisma";
import { CreateStopDto } from "../dto/create-stop.dto";
import { UpdateStopDto } from "../dto/update-stop.dto";

export interface StopRepositoryInterface {
    findAll(): Promise<Stop[]>;
    findById(id: number): Promise<Stop>;
    createStop(stopData: CreateStopDto): Promise<Stop>;
    updateStop(id: number, stopData: UpdateStopDto): Promise<Stop>;
    deleteStop(id: number): Promise<void>;
}
