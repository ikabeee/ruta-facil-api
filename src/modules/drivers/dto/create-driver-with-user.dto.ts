import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean, IsDateString, IsPhoneNumber } from 'class-validator';

export class CreateDriverWithUserDto {
    // User data
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsEmail()
    email!: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    profilePicture?: string;

    // Driver-specific data
    @IsOptional()
    @IsString()
    license?: string;

    @IsOptional()
    @IsDateString()
    licenseExpiration?: string;

    @IsOptional()
    @IsString()
    driverExperience?: string;

    @IsOptional()
    @IsNumber()
    driverRating?: number;

    @IsOptional()
    @IsBoolean()
    isDriverVerified?: boolean;

    @IsOptional()
    @IsString()
    role?: string; // Will be set to 'DRIVER'
}
