import { CreateUserDto } from "./createUser.dto";

export interface UpdateUserDto extends CreateUserDto {
    id: string;
}
