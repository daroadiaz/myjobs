export enum Role {
  TRABAJADOR = 'TRABAJADOR',
  EMPLEADOR = 'EMPLEADOR',
  MODERADOR = 'MODERADOR'
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  profileImage?: string;
  bio?: string;
  location?: string;
  active: boolean;
  emailVerified: boolean;
  createdAt: Date;
  averageRating?: number;
  totalReviews?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  location?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}
