import React, { useState, createContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginContextType } from "./LoginContextType";
import { Api, ApiResponse } from "../../../api";
import { UsuarioRegistrado } from "../../../../models/UsuarioRegistrado";
import * as Location from 'expo-location';
import { PermissionsAndroid } from "react-native";
interface LoginProviderProps {
  children: React.ReactNode
}
export const LoginContext = createContext<LoginContextType>({
  login: false,
  loading: true,
  user: undefined,
  location: undefined,
  localidad: undefined,
  setLogin: () => { },
  setLoading: () => { },
  setUser: () => { },
  logout: () => { },
  setLocalidad: () => { },
  setLocation: () => { },
  loginFunction: (email: string, password: string) => { }
});

export const LoginProvider = ({ children }: LoginProviderProps) => {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UsuarioRegistrado | undefined>(undefined);
  const [location, setLocation] = useState<Location.LocationObject>();
  const [localidad, setLocalidad] = useState<string | undefined>();

  const logout = () => {
    AsyncStorage.removeItem('token');
    setUser(undefined);
    setLogin(false);
    setLocalidad(undefined);
    setLocation(undefined);
  };

  const loginContextValue: LoginContextType = {
    login,
    loading,
    user,
    location,
    localidad,
    setLogin,
    setLoading,
    setUser,
    logout,
    setLocalidad,
    setLocation,
    loginFunction
  };

  const getLocation = async () => {
    try {
      if (location == undefined || location == null) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log(status);
        if (status === 'granted') {
          await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest }).then((location) => obtenerLocalidad(location)).then((localidad) => {
            console.log(localidad);
            setLocalidad(localidad);
            return localidad;
          });
        } else {
          return undefined; // aquí retornamos undefined porque no tenemos permiso para acceder a la ubicación
        }
      } else {
        if (localidad == undefined || localidad == null) {
          await obtenerLocalidad(location).then((localidad) => {
            setLocalidad(localidad);
            return localidad;
          });
        } else {
          return localidad;
        }
      }
    } catch {
      return undefined;
    }
  }

  const obtenerLocalidad = async (location: Location.LocationObject): Promise<string | undefined> => {
    try {
      if (location != null && location != undefined) {
        setLocation(location);
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.address != null && data.address.town != null) {
          const town = data.address.town;
          return town.split("/")[0];
        } else {
          return undefined;
        }
      } else {
        setLocation(undefined);
        return undefined;
      }
    } catch {
      return undefined;
    }
  };
  async function logUser() {
    await AsyncStorage.getItem('token').then((value) => {
      if (value !== null) {
        const api = new Api<UsuarioRegistrado>(value);
        const token: string = value;
        api.get('/UsuarioRegistrado').then((value) => {
          if (!value.error) {
            getLocation().then(() => {
              setUser(value.data);
              setLogin(token != null);
              setLoading(false);
            })
          } else {
            alert("Email or Password incorrect");
            setLogin(false);
            setUser(undefined);
            setLoading(false);
            setLocation(undefined);
            setLocalidad(undefined);
          }
        });
      } else {
        setLogin(false);
        setLoading(false);
      }
    });
  }
  useEffect(() => {
    logUser();
  }, []);

  const api = new Api<any>();

  async function loginFunction(email: string, password: string) {
    setLoading(true);
    const response: ApiResponse<string> = await api.post('/Usuario/Login', { email, password });
    if (!response.error) {
      await AsyncStorage.setItem('token', response.data!);
      setLogin(response.data != null);
      logUser();
    } else {
      alert("Email or Password incorrect");
      setLogin(false);
    }
  }

  return (
    <LoginContext.Provider value={loginContextValue}>
      {children}
    </LoginContext.Provider>
  );
};