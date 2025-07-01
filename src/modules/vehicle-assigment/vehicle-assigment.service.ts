import { VehicleAssignment } from "../../../generated/prisma";
import { CreateVehicleAssignmentDto } from "./dto/create-vehicle-assignment.dto";
import { UpdateVehicleAssignmentDto } from "./dto/update-vehicle-assignment.dto";
import { VehicleAssignmentRepositoryInterface } from "./interfaces/VehicleAssignmentRepository.interface";
import { VehicleAssignmentServiceInterface } from "./interfaces/VehicleAssignmentService.interface";

export class VehicleAssignmentService implements VehicleAssignmentServiceInterface {
    constructor(
        private readonly vehicleAssignmentRepository: VehicleAssignmentRepositoryInterface
    ) { }

    async findAllVehicleAssignments(): Promise<VehicleAssignment[]> {
        return this.vehicleAssignmentRepository.findAll();
    }

    async findVehicleAssignmentById(id: number): Promise<VehicleAssignment> {
        return this.vehicleAssignmentRepository.findById(id);
    }

    async findVehicleAssignmentsByVehicleId(vehicleId: number): Promise<VehicleAssignment[]> {
        return this.vehicleAssignmentRepository.findByVehicleId(vehicleId);
    }

    async findVehicleAssignmentsByRouteId(routeId: number): Promise<VehicleAssignment[]> {
        return this.vehicleAssignmentRepository.findByRouteId(routeId);
    }

    async findVehicleAssignmentsByDriverId(driverId: number): Promise<VehicleAssignment[]> {
        return this.vehicleAssignmentRepository.findByDriverId(driverId);
    }

    async createVehicleAssignment(assignmentData: CreateVehicleAssignmentDto): Promise<VehicleAssignment> {
        return this.vehicleAssignmentRepository.createVehicleAssignment(assignmentData);
    }

    async updateVehicleAssignment(id: number, assignmentData: UpdateVehicleAssignmentDto): Promise<VehicleAssignment> {
        return this.vehicleAssignmentRepository.updateVehicleAssignment(id, assignmentData);
    }

    async deleteVehicleAssignment(id: number): Promise<void> {
        return this.vehicleAssignmentRepository.deleteVehicleAssignment(id);
    }
}
