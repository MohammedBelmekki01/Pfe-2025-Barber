// types.ts
export interface User {
  id: number;
  name: string;
  email?: string;
}

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  login: (email: string, password: string) => Promise<any>;
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setToken: (token: string) => void; 
}
