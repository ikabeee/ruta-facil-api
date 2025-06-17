import { hash } from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { User, CreateUserDto, UpdateUserDto } from '../../../common/interfaces/user.types';
import { IUserService } from '../interfaces/User.interface';

export class UserService implements IUserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }
  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hash(userData.password, 10);
    return await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });
  }

  async update(id: number, userData: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (userData.password) {
      userData.password = await hash(userData.password, 10);
    }

    return await this.userRepository.update(id, userData);
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(id);
  }

    if (userData.password) {
      userData.password = await hash(userData.password, 10);
    }

    return await this.userRepository.update(id, userData);
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await this.userRepository.delete(id);
  }

  async verifyUser(id: number) {
    return await this.userRepository.update(id, { status: UserStatus.VERIFIED });
  }
}