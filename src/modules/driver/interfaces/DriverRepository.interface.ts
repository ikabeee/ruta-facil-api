import { Driver } from "../../../../generated/prisma";
import { CreateDriverDto } from "../dto/create-driver.dto";
import { UpdateDriverDto } from "../dto/update-driver.dto";

export interface DriverRepositoryInterface {
    findAll(): Promise<Driver[]>;
    findById(id: number): Promise<Driver>;
    findByUserId(userId: number): Promise<Driver | null>;
    createDriver(driverData: CreateDriverDto): Promise<Driver>;
    updateDriver(id: number, driverData: UpdateDriverDto): Promise<Driver>;
    deleteDriver(id: number): Promise<void>;
}
