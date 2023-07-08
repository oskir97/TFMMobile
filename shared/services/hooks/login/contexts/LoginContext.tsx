import React, { useState, createContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginContextType } from "./LoginContextType";
import { Api, ApiResponse } from "../../../api";
import { UsuarioRegistrado } from "../../../../models/UsuarioRegistrado";
import * as Location from 'expo-location';
import { Alert, PermissionsAndroid } from "react-native";
import { Filter, Sort, TypeReservation } from "../../../../models/Filter";
import { useTranslation } from "react-i18next";
import { useDeportes } from "../../deportes/useDeportes";
interface LoginProviderProps {
  children: React.ReactNode
}
export const LoginContext = createContext<LoginContextType>({
  login: false,
  loading: true,
  pagando: true,
  user: undefined,
  location: undefined,
  localidad: undefined,
  filter: undefined,
  setLogin: () => { },
  setLoading: () => { },
  setPagando: () => { },
  setUser: () => { },
  logout: () => { },
  setLocalidad: () => { },
  setLocation: () => { },
  loginFunction: (email: string, password: string) => { },
  setFilter: () => { },
  getLocation: function (): Promise<string | undefined> {
    throw new Error("Function not implemented.");
  }
});

export const LoginProvider = ({ children }: LoginProviderProps) => {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagando, setPagando] = useState(false);
  const [user, setUser] = useState<UsuarioRegistrado | undefined>(undefined);
  const [location, setLocation] = useState<Location.LocationObject>();
  const [localidad, setLocalidad] = useState<string | undefined>();
  const [filter, setFilter] = useState<Filter | undefined>();

  const { t } = useTranslation();

  const logout = () => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('localidad');
    AsyncStorage.removeItem('iddeporte');
    AsyncStorage.removeItem('fecha');
    AsyncStorage.removeItem('sort');
    AsyncStorage.removeItem('type');

    setUser(undefined);
    setLogin(false);
    setLocalidad(undefined);
    setLocation(undefined);
  };
  const getLocation = async () => {
    try {
      if (location == undefined || location == null) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        // console.log(status);
        if (status === 'granted') {
          await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest }).then((location) => obtenerLocalidad(location)).then((localidad) => {
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

  const loginContextValue: LoginContextType = {
    login,
    loading,
    pagando,
    user,
    location,
    localidad,
    filter,
    setLogin,
    setLoading,
    setPagando,
    setUser,
    logout,
    setLocalidad,
    setLocation,
    loginFunction,
    setFilter,
    getLocation
  };

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

  async function getStorageFilter() {
    var filter: Filter | undefined = undefined;
    const localidad = await AsyncStorage.getItem('localidad');
    const iddeporte = await AsyncStorage.getItem('iddeporte');
    const fecha = await AsyncStorage.getItem('fecha');
    const sort = await AsyncStorage.getItem('sort');
    const type = await AsyncStorage.getItem('type');

    var sortType = undefined;
    var typeReservationType = undefined;

    if (sort != null)
      sortType = convertirStringAType<Sort>(sort)

    if (type != null)
      typeReservationType = convertirStringAType<TypeReservation>(type)

    if (localidad && iddeporte && fecha) {
      filter = { localidad: localidad, deporte: Number(iddeporte), fecha: new Date(fecha), sort: sortType, type: typeReservationType }
    }

    return filter;
  }

  type ConvertibleTypes = Sort | TypeReservation;

  function convertirStringAType<T extends ConvertibleTypes>(valorString: string): T | undefined {
    return valorString as unknown as T;
  }

  async function logUser() {
    await AsyncStorage.getItem('token').then((value) => {
      if (value !== null) {
        const api = new Api<any, UsuarioRegistrado>(value);
        const token: string = value;
        api.get('/UsuarioRegistrado').then((value) => {
          if (!value.error) {
            getLocation().then(() => {
              console.log("Ubicación obtenida");
              getStorageFilter().then((result: Filter | undefined) => {
                setFilter(result);
                setUser(value.data);
                setLogin(token != null);
                setLoading(false);
              });
            })
          } else {
            if (value.error == "Request failed with status code 403") {
              const ERROR = t("ERROR");
              const EMAIL_PASSWORD_INCORRECTOS = t("EMAIL_PASSWORD_INCORRECTOS");
              Alert.alert(ERROR, EMAIL_PASSWORD_INCORRECTOS);
            } else {
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

  const api = new Api<any, any>();

  async function loginFunction(email: string, password: string) {
    const response: ApiResponse<string> = await api.post('/Usuario/Login', { email, password });
    if (!response.error) {
      await AsyncStorage.setItem('token', response.data!);
      setLogin(response.data != null);
      setLoading(true);
      logUser();
    } else {
      if (response.error == "Request failed with status code 403") {
        const ERROR = t("ERROR");
        const EMAIL_PASSWORD_INCORRECTOS = t("EMAIL_PASSWORD_INCORRECTOS");
        Alert.alert(ERROR, EMAIL_PASSWORD_INCORRECTOS);
      } else {
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