// UserContext.tsx
import axiosClient from "@/api/axios";
import { UserApi } from "@/Services/Api/Barber/UserApi";
import type { User, UserContextType } from "@/types/type";
import { createContext, useContext, useState } from "react";

export const UserStateContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  login: async (_email: string, _password: string) => {},
  authenticated : false,
  setAuthenticated : () =>  {},
  setToken : () => {}
});

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // ✅ Correct default
const [authenticated, _setAuthenticated] = useState<boolean>(() => {
  const stored = window.localStorage.getItem('AUTHENTICATED');
  return stored === 'true'; // localStorage stores strings
});
  const login = async (email: string, password: string): Promise<any> => {
    try {
      await UserApi.getCsrfToken();
      return await UserApi.login(email, password);
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    try {
      axiosClient.post('/logout').then(() => {
        // Successfully logged out from server
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setAuthenticated(false);
    }
  };

const setAuthenticated = (isAuthenticated: boolean) => {
  _setAuthenticated(isAuthenticated);
  window.localStorage.setItem('AUTHENTICATED', isAuthenticated.toString());
};


const setToken = (token : string) => {
  window.localStorage.setItem('token', token)
}
  return (
    <UserStateContext.Provider
      value={{ user, setUser, login, logout, authenticated, setAuthenticated , setToken}}
    >
      {children}
    </UserStateContext.Provider>
  );
};



export const useUsercontext = () => useContext(UserStateContext)