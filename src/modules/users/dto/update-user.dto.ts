import { IsNotEmpty } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends CreateUserDto {
    @IsNotEmpty({ message: 'La fecha de actualización es obligatoria.' })
    updatedAt!: Date;
}