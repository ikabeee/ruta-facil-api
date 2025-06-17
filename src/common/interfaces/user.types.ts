export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  VERIFIED = 'verified',
  UNVERIFIED = 'unverified'
}

export interface User {
  id: number;
  name?: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  pushToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  name?: string;
  email: string;
  password: string;
  role?: UserRole;
  pushToken?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  pushToken?: string;
}
