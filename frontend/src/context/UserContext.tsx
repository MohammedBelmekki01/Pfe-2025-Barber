// UserContext.tsx
import { BarberApi } from "@/Services/Api/Barber/barberApi";
import type { User, UserContextType, LoginResponse } from "@/types/type";
import { createContext, useContext, useState } from "react";

export const UserStateContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  login: async () => false,
  authenticated : false,
  setAuthenticated : () =>  {}
});

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // ✅ Correct default
const [authenticated, _setAuthenticated] = useState<boolean>(() => {
  const stored = window.localStorage.getItem('AUTHENTICATED');
  return stored === 'true'; // localStorage stores strings
});
  const login = async (email: string, password: string): Promise<LoginResponse | false> => {
    try {
      await BarberApi.getCsrfToken();
      const response = await BarberApi.login(email, password);
      
      // Validate response structure
      if (response && typeof response === 'object' && 
          'status' in response && 'data' in response &&
          typeof response.data === 'object' && response.data !== null &&
          'access_token' in response.data) {
        return response as LoginResponse;
      }
      
      console.error('Invalid login response structure:', response);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    _setAuthenticated(false); // ✅ Reset auth state
  };

const setAuthenticated = (isAuthenticated: boolean) => {
  _setAuthenticated(isAuthenticated);
  window.localStorage.setItem('AUTHENTICATED', isAuthenticated.toString());
};

  return (
    <UserStateContext.Provider
      value={{ user, setUser, login, logout, authenticated, setAuthenticated }}
    >
      {children}
    </UserStateContext.Provider>
  );
};



export const useUsercontext = () => useContext(UserStateContext)