import { IsInt, IsOptional, IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class UpdateDriverDto {
    @IsOptional()
    @IsInt()
    userId?: number;

    @IsOptional()
    @IsString()
    license?: string;

    @IsOptional()
    @IsDateString()
    licenseExpiration?: string;

    @IsOptional()
    @IsString()
    experience?: string;

    @IsOptional()
    @IsNumber()
    rating?: number;

    @IsOptional()
    @IsInt()
    totalTrips?: number;

    @IsOptional()
    @IsBoolean()
    isVerified?: boolean;
}
