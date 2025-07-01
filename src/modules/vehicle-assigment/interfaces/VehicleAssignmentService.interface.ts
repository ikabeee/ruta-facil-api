import { VehicleAssignment } from "../../../../generated/prisma";
import { CreateVehicleAssignmentDto } from "../dto/create-vehicle-assignment.dto";
import { UpdateVehicleAssignmentDto } from "../dto/update-vehicle-assignment.dto";

export interface VehicleAssignmentServiceInterface {
    findAllVehicleAssignments(): Promise<VehicleAssignment[]>;
    findVehicleAssignmentById(id: number): Promise<VehicleAssignment>;
    findVehicleAssignmentsByVehicleId(vehicleId: number): Promise<VehicleAssignment[]>;
    findVehicleAssignmentsByRouteId(routeId: number): Promise<VehicleAssignment[]>;
    findVehicleAssignmentsByDriverId(driverId: number): Promise<VehicleAssignment[]>;
    createVehicleAssignment(assignmentData: CreateVehicleAssignmentDto): Promise<VehicleAssignment>;
    updateVehicleAssignment(id: number, assignmentData: UpdateVehicleAssignmentDto): Promise<VehicleAssignment>;
    deleteVehicleAssignment(id: number): Promise<void>;
}
