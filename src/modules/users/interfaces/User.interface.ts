import { User, CreateUserDto, UpdateUserDto } from '../../../common/interfaces/user.types';

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
  delete(id: number): Promise<void>;
}

export interface IUserRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
  delete(id: number): Promise<void>;
}