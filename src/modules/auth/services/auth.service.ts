import { compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { UserService } from '../../users/services/user.service';
import { LoginDto, AuthResponse } from '../../../common/interfaces/auth.types';
import { IAuthService } from '../interfaces/Auth.interface';

export class AuthService implements IAuthService {
  private userService: UserService;
  private JWT_SECRET: string;

  constructor() {
    this.userService = new UserService();
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  }
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(credentials.email);
    
    const isPasswordValid = await compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = this.generateToken(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    };
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      verify(token, this.JWT_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  }

  generateToken(payload: any): string {
    return sign(payload, this.JWT_SECRET, { expiresIn: '24h' });
  }

  private verifyToken(token: string): any {
    try {
      return verify(token, this.JWT_SECRET) as ITokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}