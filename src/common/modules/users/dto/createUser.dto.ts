import { UserRole } from "../../../../generated/prisma";
export interface CreateUserDto {
    name: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
    isActive?: boolean;
}