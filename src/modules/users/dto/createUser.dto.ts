import { UserRole } from "../../../common/enums/UserRole";

export interface CreateUserDto {
    name: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
    isActive?: boolean;
}