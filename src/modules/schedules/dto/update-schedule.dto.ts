import { IsOptional, IsString, IsInt, IsBoolean } from "class-validator";

export class UpdateScheduleDto {
    @IsOptional()
    @IsInt({ message: "routeId debe ser un número entero" })
    routeId?: number;

    @IsOptional()
    @IsString({ message: "startTime debe ser una cadena de texto" })
    startTime?: string;

    @IsOptional()
    @IsString({ message: "endTime debe ser una cadena de texto" })
    endTime?: string;

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
