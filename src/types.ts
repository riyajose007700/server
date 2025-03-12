export interface User {
  username: string;
  name: string;
  role: string | null;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAuth?: () => Promise<boolean>;
}

export interface AuthResponse {
  status: number;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: string;
  role: string | null;
}