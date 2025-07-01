import { Request, Response } from "express";
import { VehicleAssignmentServiceInterface } from "./interfaces/VehicleAssignmentService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateVehicleAssignmentDto } from "./dto/create-vehicle-assignment.dto";
import { validate } from "class-validator";
import { UpdateVehicleAssignmentDto } from "./dto/update-vehicle-assignment.dto";

export class VehicleAssignmentController {
    constructor(private readonly vehicleAssignmentService: VehicleAssignmentServiceInterface) {}

    async findAllVehicleAssignments(_req: Request, res: Response): Promise<Response> {
        try {
            const vehicleAssignments = await this.vehicleAssignmentService.findAllVehicleAssignments();
            return ApiResponse.success(res, vehicleAssignments, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findVehicleAssignmentById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleAssignment = await this.vehicleAssignmentService.findVehicleAssignmentById(+id);
            return ApiResponse.success(res, vehicleAssignment, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findVehicleAssignmentsByVehicleId(req: Request, res: Response): Promise<Response> {
        try {
            const { vehicleId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+vehicleId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleAssignments = await this.vehicleAssignmentService.findVehicleAssignmentsByVehicleId(+vehicleId);
            return ApiResponse.success(res, vehicleAssignments, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findVehicleAssignmentsByRouteId(req: Request, res: Response): Promise<Response> {
        try {
            const { routeId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+routeId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleAssignments = await this.vehicleAssignmentService.findVehicleAssignmentsByRouteId(+routeId);
            return ApiResponse.success(res, vehicleAssignments, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async findVehicleAssignmentsByDriverId(req: Request, res: Response): Promise<Response> {
        try {
            const { driverId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+driverId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleAssignments = await this.vehicleAssignmentService.findVehicleAssignmentsByDriverId(+driverId);
            return ApiResponse.success(res, vehicleAssignments, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async createVehicleAssignment(req: Request, res: Response): Promise<Response> {
        try {
            const assignmentData = plainToInstance(CreateVehicleAssignmentDto, req.body);
            const errors = await validate(assignmentData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newVehicleAssignment = await this.vehicleAssignmentService.createVehicleAssignment(assignmentData);
            return ApiResponse.success(res, newVehicleAssignment, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async updateVehicleAssignment(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const assignmentData = plainToInstance(UpdateVehicleAssignmentDto, req.body);
            const errors = await validate(assignmentData);
            const validationError = ValidateParams.validatePositiveInteger(+id);

            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }

            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const updatedVehicleAssignment = await this.vehicleAssignmentService.updateVehicleAssignment(+id, assignmentData);
            return ApiResponse.success(res, updatedVehicleAssignment, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    async deleteVehicleAssignment(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.vehicleAssignmentService.deleteVehicleAssignment(+id);
            return ApiResponse.success(res, { message: "Asignación de vehículo eliminada correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
