import { Driver } from "../../../../generated/prisma";
import { CreateDriverDto } from "../dto/create-driver.dto";
import { UpdateDriverDto } from "../dto/update-driver.dto";

export interface DriverRepositoryInterface {
    findAll(): Promise<Driver[]>;//buscar todos los conductores
    findById(id: number): Promise<Driver>;// buscar conductor por id
    findByUserId(userId: number): Promise<Driver | null>;// buscar conductor por id de usuario, puede ser null si no existe
    createDriver(driverData: CreateDriverDto): Promise<Driver>;// crear conductor
    updateDriver(id: number, driverData: UpdateDriverDto): Promise<Driver>;// actualizar conductor
    deleteDriver(id: number): Promise<void>;// eliminar conductor
}
