import { User } from '../../../../generated/prisma/index';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
export interface UserRepositoryInterface {
    getUsers(): Promise<{code:string, message:string, timestamp: Date, data:User[]}>;
    getUserById(id: number): Promise<{code:string, message:string, timestamp: Date, data:User}>;
    createUser(data: CreateUserDto): Promise<{code:string, message:string, timestamp: Date, data:User}>;
    updateUser(id: number, data: UpdateUserDto): Promise<{code:string, message:string, timestamp: Date, data:User}>;
    deleteUser(id: number): Promise<{code:string, message:string, timestamp: Date, data:User}>;
}