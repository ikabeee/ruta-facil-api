
import { Schedule } from "../../../../generated/prisma";
import { CreateScheduleDto } from "../dto/create-schedule.dto";
import { UpdateScheduleDto } from "../dto/update-schedule.dto";

export interface ScheduleServiceInterface {
    findAllSchedules(): Promise<Schedule[]>;
    findScheduleById(id: number): Promise<Schedule | null>;
    createSchedule(scheduleData: CreateScheduleDto): Promise<Schedule>;
    updateSchedule(id: number, scheduleData: UpdateScheduleDto): Promise<Schedule>;
    deleteSchedule(id: number): Promise<void>;
    findSchedulesByRouteId(routeId: number): Promise<Schedule[]>;
}
