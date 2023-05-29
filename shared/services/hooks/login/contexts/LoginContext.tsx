import React, { useState, createContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginContextType } from "./LoginContextType";
import { Api, ApiResponse } from "../../../api";
import { UsuarioRegistrado } from "../../../../models/UsuarioRegistrado";
import * as Location from 'expo-location';
import { Alert, PermissionsAndroid } from "react-native";
import { Filter } from "../../../../models/Filter";
import { useTranslation } from "react-i18next";
interface LoginProviderProps {
  children: React.ReactNode
}
export const LoginContext = createContext<LoginContextType>({
  login: false,
  loading: true,
  user: undefined,
  location: undefined,
  localidad: undefined,
  filter: undefined,
  setLogin: () => { },
  setLoading: () => { },
  setUser: () => { },
  logout: () => { },
  setLocalidad: () => { },
  setLocation: () => { },
  loginFunction: (email: string, password: string) => { },
  setFilter: () => { }
});

export const LoginProvider = ({ children }: LoginProviderProps) => {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UsuarioRegistrado | undefined>(undefined);
  const [location, setLocation] = useState<Location.LocationObject>();
  const [localidad, setLocalidad] = useState<string | undefined>();
  const [filter, setFilter] = useState<Filter | undefined>();

  const { t } = useTranslation();

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
    filter,
    setLogin,
    setLoading,
    setUser,
    logout,
    setLocalidad,
    setLocation,
    loginFunction,
    setFilter
  };

  const getLocation = async () => {
    try {
      if (location == undefined || location == null) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        // console.log(status);
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
        const apiKey = 'AIzaSyDB2bGI_qo-wtNjBZ690FvrcVeQK4kS7Jg';
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        const results = data.results;

        if (results.length > 0) {
          const addressComponents = results[0].address_components;
          const ciudadComponent = addressComponents.find((component: any) =>
            component.types.includes('locality')
          );
          const ciudad = ciudadComponent ? ciudadComponent.long_name : null;
          return ciudad;
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
            if(value.error == "Request failed with status code 403"){
              const ERROR = t("ERROR");
              const EMAIL_PASSWORD_INCORRECTOS = t("EMAIL_PASSWORD_INCORRECTOS");
              Alert.alert(ERROR, EMAIL_PASSWORD_INCORRECTOS);
            }else{
              const ERROR = t("ERROR");
              const ERROR_APLICACION = t("ERROR_APLICACION");
              Alert.alert(ERROR, ERROR_APLICACION);
            }

            setLogin(false);
            setUser(undefined);
            setLocation(undefined);
            setLocalidad(undefined);
            setLoading(false);
          }
        });
      } else {
        setLogin(false);
        setLoading(false);
      }
    });
  }
  useEffect(() => {
    //logout();
    logUser();
  }, []);

  const api = new Api<any>();

  async function loginFunction(email: string, password: string) {
    const response: ApiResponse<string> = await api.post('/Usuario/Login', { email, password });
    if (!response.error) {
      await AsyncStorage.setItem('token', response.data!);
      setLogin(response.data != null);
      setLoading(true);
      logUser();
    } else {
      if(response.error == "Request failed with status code 403"){
        const ERROR = t("ERROR");
        const EMAIL_PASSWORD_INCORRECTOS = t("EMAIL_PASSWORD_INCORRECTOS");
        Alert.alert(ERROR, EMAIL_PASSWORD_INCORRECTOS);
      }else{
        const ERROR = t("ERROR");
        const ERROR_APLICACION = t("ERROR_APLICACION");
        Alert.alert(ERROR, ERROR_APLICACION);
      }
      
      setLogin(false);
    }
  }

  return (
    <LoginContext.Provider value={loginContextValue}>
      {children}
    </LoginContext.Provider>
  );
};