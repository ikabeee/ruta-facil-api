import { IsNotEmpty, IsString, IsInt, IsOptional, IsBoolean } from "class-validator";

export class CreateScheduleDto {
    @IsNotEmpty({ message: "routeId es requerido" })
    @IsInt({ message: "routeId debe ser un número entero" })
    routeId!: number;

    @IsNotEmpty({ message: "startTime es requerido" })
    @IsString({ message: "startTime debe ser una cadena de texto" })
    startTime!: string;

    @IsNotEmpty({ message: "endTime es requerido" })
    @IsString({ message: "endTime debe ser una cadena de texto" })
    endTime!: string;

    @IsOptional()
    @IsString({ message: "frequency debe ser una cadena de texto" })
    frequency?: string;

    @IsOptional()
    @IsString({ message: "days debe ser una cadena de texto" })
    days?: string;

    @IsOptional()
    @IsInt({ message: "totalTrips debe ser un número entero" })
    totalTrips?: number;

    @IsOptional()
    @IsBoolean({ message: "status debe ser un valor booleano" })
    status?: boolean;
}
