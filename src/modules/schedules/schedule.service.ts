import { ScheduleServiceInterface } from "./interfaces/ScheduleService.interface";
import { ScheduleRepository } from "./schedule.repository";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";
import { ApiError } from "../../shared/errors/ApiError";
import { Schedule } from "../../../generated/prisma";

export class ScheduleService implements ScheduleServiceInterface {
    constructor(private readonly scheduleRepository: ScheduleRepository) {}

    async findAllSchedules(): Promise<Schedule[]> {
        try {
            return await this.scheduleRepository.findAllSchedules();
        } catch (error: any) {
            throw new ApiError(500, `Error al obtener horarios: ${error.message}`);
        }
    }

    async findScheduleById(id: number): Promise<Schedule | null> {
        try {
            const schedule = await this.scheduleRepository.findScheduleById(id);
            if (!schedule) {
                throw new ApiError(404, "Horario no encontrado");
            }
            return schedule;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al obtener horario: ${error.message}`);
        }
    }

    async createSchedule(scheduleData: CreateScheduleDto): Promise<Schedule> {
        try {
            return await this.scheduleRepository.createSchedule(scheduleData);
        } catch (error: any) {
            throw new ApiError(500, `Error al crear horario: ${error.message}`);
        }
    }

    async updateSchedule(id: number, scheduleData: UpdateScheduleDto): Promise<Schedule> {
        try {
            // Verificar que el horario existe
            await this.findScheduleById(id);
            
            return await this.scheduleRepository.updateSchedule(id, scheduleData);
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar horario: ${error.message}`);
        }
    }

    async deleteSchedule(id: number): Promise<void> {
        try {
            // Verificar que el horario existe
            await this.findScheduleById(id);
            
            await this.scheduleRepository.deleteSchedule(id);
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al eliminar horario: ${error.message}`);
        }
    }

    async findSchedulesByRouteId(routeId: number): Promise<Schedule[]> {
        try {
            return await this.scheduleRepository.findSchedulesByRouteId(routeId);
        } catch (error: any) {
            throw new ApiError(500, `Error al obtener horarios por ruta: ${error.message}`);
        }
    }
}
