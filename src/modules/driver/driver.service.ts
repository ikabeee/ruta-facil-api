import { Driver } from "../../../generated/prisma";
import { CreateDriverDto } from "./dto/create-driver.dto";
import { UpdateDriverDto } from "./dto/update-driver.dto";
import { DriverRepositoryInterface } from "./interfaces/DriverRepository.interface";
import { DriverServiceInterface } from "./interfaces/DriverService.interface";

export class DriverService implements DriverServiceInterface {
    constructor(
        private readonly driverRepository: DriverRepositoryInterface
    ) { }

    async findAllDrivers(): Promise<Driver[]> {
        return this.driverRepository.findAll();
    }

    async findDriverById(id: number): Promise<Driver> {
        return this.driverRepository.findById(id);
    }

    async findDriverByUserId(userId: number): Promise<Driver | null> {
        return this.driverRepository.findByUserId(userId);
    }

    async createDriver(driverData: CreateDriverDto): Promise<Driver> {
        return this.driverRepository.createDriver(driverData);
    }

    async updateDriver(id: number, driverData: UpdateDriverDto): Promise<Driver> {
        return this.driverRepository.updateDriver(id, driverData);
    }

    async deleteDriver(id: number): Promise<void> {
        return this.driverRepository.deleteDriver(id);
    }
}
