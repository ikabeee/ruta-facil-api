import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateNotificationDto {
    @IsInt({ message: 'El ID del usuario debe ser un número entero.' })
    @Min(1, { message: 'El ID del usuario debe ser mayor a 0.' })
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
    userId!: number;

    @IsString({ message: 'El título debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El título es obligatorio.' })
    @MaxLength(255, { message: 'El título no puede exceder los 255 caracteres.' })
    title!: string;

    @IsString({ message: 'El mensaje debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El mensaje es obligatorio.' })
    message!: string;

    @IsBoolean({ message: 'El campo isRead debe ser un booleano.' })
    @IsOptional()
    isRead?: boolean;
}
