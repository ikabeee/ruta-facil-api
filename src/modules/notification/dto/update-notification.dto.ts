import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateNotificationDto {
    @IsOptional()
    @IsInt({ message: 'El ID del usuario debe ser un número entero.' })
    @Min(1, { message: 'El ID del usuario debe ser mayor a 0.' })
    userId?: number;

    @IsOptional()
    @IsString({ message: 'El título debe ser una cadena de texto.' })
    @MaxLength(255, { message: 'El título no puede exceder los 255 caracteres.' })
    title?: string;

    @IsOptional()
    @IsString({ message: 'El mensaje debe ser una cadena de texto.' })
    message?: string;

    @IsOptional()
    @IsBoolean({ message: 'El campo isRead debe ser un booleano.' })
    isRead?: boolean;
}
