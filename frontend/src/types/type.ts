// types.ts
export interface User {
  name: string;
  email?: string;
}

export interface LoginResponse {
  status: number;
  data: {
    access_token: string;
    message?: string;
  };
}

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  login: (email: string, password: string) => Promise<LoginResponse | false>;
  authenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
}
