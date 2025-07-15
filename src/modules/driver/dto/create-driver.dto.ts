import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateDriverDto {
    @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
    @Min(1, { message: 'El ID del usuario debe ser mayor a 0.' })
    userId!: number;
    @IsOptional()
    @IsBoolean({ message: 'El campo isVerified debe ser un booleano.' })
    isVerified?: boolean;
}
