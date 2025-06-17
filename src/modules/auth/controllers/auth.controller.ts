import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { HTTP_CODES } from '../../../common/constants/httpCodes';
import { ILoginDto } from '../interfaces/Auth.interface';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response) {
    try {
      const credentials: ILoginDto = req.body;
      const authResponse = await this.authService.login(credentials);
      res.status(HTTP_CODES.OK).json({
        success: true,
        message: "Login successful",
        data: authResponse
      });
    } catch (error: any) {
      const status = error.message === 'Invalid credentials' 
        ? HTTP_CODES.UNAUTHORIZED 
        : HTTP_CODES.INTERNAL_SERVER_ERROR;
      
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }
}