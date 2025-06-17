import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ICreateUserDto, IUpdateUserDto } from '../interfaces/User.interface';
import { HTTP_CODES } from '../../../common/constants/httpCodes';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(HTTP_CODES.OK).json({
        success: true,
        message: "Users retrieved successfully",
        data: users
      });
    } catch (error) {
      res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Error retrieving users"
      });
    }
  }

  async getOneUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userService.getUserById(userId);
      res.status(HTTP_CODES.OK).json({
        success: true,
        message: "User retrieved successfully",
        data: user
      });
    } catch (error) {
      const status = error.message === 'User not found' ? HTTP_CODES.NOT_FOUND : HTTP_CODES.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const userData: ICreateUserDto = req.body;
      const newUser = await this.userService.createUser(userData);
      res.status(HTTP_CODES.CREATED).json({
        success: true,
        message: "User created successfully",
        data: newUser
      });
    } catch (error) {
      const status = error.message === 'User already exists' ? HTTP_CODES.CONFLICT : HTTP_CODES.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const userData: IUpdateUserDto = req.body;
      const updatedUser = await this.userService.updateUser(userId, userData);
      res.status(HTTP_CODES.OK).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
      });
    } catch (error) {
      const status = error.message === 'User not found' ? HTTP_CODES.NOT_FOUND : HTTP_CODES.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const verifiedUser = await this.userService.verifyUser(userId);
      res.status(HTTP_CODES.OK).json({
        success: true,
        message: "User verified successfully",
        data: verifiedUser
      });
    } catch (error) {
      const status = error.message === 'User not found' ? HTTP_CODES.NOT_FOUND : HTTP_CODES.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }
}