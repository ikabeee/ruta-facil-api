import { LoginDto, AuthResponse } from '../../../common/interfaces/auth.types';

export interface IAuthService {
  login(loginDto: LoginDto): Promise<AuthResponse>;
  validateToken(token: string): Promise<boolean>;
  generateToken(payload: any): string;
}