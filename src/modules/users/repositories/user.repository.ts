import { PrismaClient } from '@prisma/client';
import { ICreateUserDto, IUpdateUserDto } from '../interfaces/User.interface';

const prisma = new PrismaClient();

export class UserRepository {
  async findAll() {
    return await prisma.user.findMany();
  }

  async findById(id: number) {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async create(userData: ICreateUserDto) {
    return await prisma.user.create({
      data: userData
    });
  }

  async update(id: number, userData: IUpdateUserDto) {
    return await prisma.user.update({
      where: { id },
      data: userData
    });
  }

  async delete(id: number) {
    return await prisma.user.delete({
      where: { id }
    });
  }
}