import React, { useState, createContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginContextType } from "./LoginContextType";
interface LoginProviderProps{
  children: React.ReactNode
}
export const LoginContext = createContext<LoginContextType>({
  login: false,
  loading:true,
  setLogin: () => {},
  setLoading: () => {}
});

export const LoginProvider = ({ children }: LoginProviderProps) => {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loginContextValue: LoginContextType = {
    login,
    loading,
    setLogin,
    setLoading
  };
  
  useEffect(() => {
    //AsyncStorage.removeItem('token');
    AsyncStorage.getItem('token').then((value) => {
      if (value !== null) {
        setLogin(true);
        setLoading(false);
      }else{
        setLogin(false);
        setLoading(false);
      }
    });
  }, [login]);
  return (
    <LoginContext.Provider value={ loginContextValue }>
      {children}
    </LoginContext.Provider>
  );
};