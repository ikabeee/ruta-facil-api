import { PrismaClient, Schedule, ScheduleStatus } from "../../../generated/prisma";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";

export class ScheduleRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findAllSchedules(): Promise<Schedule[]> {
        return await this.prisma.schedule.findMany({
            include: {
                route: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findScheduleById(id: number): Promise<Schedule | null> {
        return await this.prisma.schedule.findUnique({
            where: { id },
            include: {
                route: true
            }
        });
    }

    async createSchedule(scheduleData: CreateScheduleDto): Promise<Schedule> {
        return await this.prisma.schedule.create({
            data: {
                routeId: scheduleData.routeId,
                startTime: scheduleData.startTime,
                endTime: scheduleData.endTime,
                frequency: scheduleData.frequency,
                days: scheduleData.days,
                totalTrips: scheduleData.totalTrips || 0,
                status: scheduleData.status ? ScheduleStatus.ACTIVE : ScheduleStatus.SUSPENDED
            },
            include: {
                route: true
            }
        });
    }

    async updateSchedule(id: number, scheduleData: UpdateScheduleDto): Promise<Schedule> {
        const updateData: any = {};
        
        if (scheduleData.routeId !== undefined) updateData.routeId = scheduleData.routeId;
        if (scheduleData.startTime !== undefined) updateData.startTime = scheduleData.startTime;
        if (scheduleData.endTime !== undefined) updateData.endTime = scheduleData.endTime;
        if (scheduleData.frequency !== undefined) updateData.frequency = scheduleData.frequency;
        if (scheduleData.days !== undefined) updateData.days = scheduleData.days;
        if (scheduleData.totalTrips !== undefined) updateData.totalTrips = scheduleData.totalTrips;
        if (scheduleData.status !== undefined) {
            updateData.status = scheduleData.status ? ScheduleStatus.ACTIVE : ScheduleStatus.SUSPENDED;
        }

        return await this.prisma.schedule.update({
            where: { id },
            data: updateData,
            include: {
                route: true
            }
        });
    }

    async deleteSchedule(id: number): Promise<void> {
        await this.prisma.schedule.delete({
            where: { id }
        });
    }

    async findSchedulesByRouteId(routeId: number): Promise<Schedule[]> {
        return await this.prisma.schedule.findMany({
            where: { routeId },
            include: {
                route: true
            },
            orderBy: {
                startTime: 'asc'
            }
        });
    }
}
