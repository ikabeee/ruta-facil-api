export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name?: string;
    email: string;
    role: string;
    status: string;
  };
}

export interface TokenPayload {
  id: number;
  email: string;
  role: string;
}
