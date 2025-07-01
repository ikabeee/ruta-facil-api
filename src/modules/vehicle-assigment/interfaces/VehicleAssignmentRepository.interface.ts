import { VehicleAssignment } from "../../../../generated/prisma";
import { CreateVehicleAssignmentDto } from "../dto/create-vehicle-assignment.dto";
import { UpdateVehicleAssignmentDto } from "../dto/update-vehicle-assignment.dto";

export interface VehicleAssignmentRepositoryInterface {
    findAll(): Promise<VehicleAssignment[]>;
    findById(id: number): Promise<VehicleAssignment>;
    findByVehicleId(vehicleId: number): Promise<VehicleAssignment[]>;
    findByRouteId(routeId: number): Promise<VehicleAssignment[]>;
    findByDriverId(driverId: number): Promise<VehicleAssignment[]>;
    createVehicleAssignment(assignmentData: CreateVehicleAssignmentDto): Promise<VehicleAssignment>;
    updateVehicleAssignment(id: number, assignmentData: UpdateVehicleAssignmentDto): Promise<VehicleAssignment>;
    deleteVehicleAssignment(id: number): Promise<void>;
}
