import React, { useState, createContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginContextType } from "./LoginContextType";
import { Api } from "../../../api";
import { UsuarioRegistrado } from "../../../../models/UsuarioRegistrado";
import * as Location from 'expo-location';
import { PermissionsAndroid } from "react-native";
interface LoginProviderProps{
  children: React.ReactNode
}
export const LoginContext = createContext<LoginContextType>({
  login: false,
  loading:true,
  user:undefined,
  location:undefined,
  setLogin: () => {},
  setLoading: () => {},
  setUser: () => {}
});

export const LoginProvider = ({ children }: LoginProviderProps) => {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UsuarioRegistrado | undefined>(undefined);
  const [location, setLocation] = useState<Location.LocationObject>();
  const [localidad, setLocalidad] = useState<string | undefined>();

  const loginContextValue: LoginContextType = {
    login,
    loading,
    user,
    location,
    setLogin,
    setLoading,
    setUser
  };

  const obtenerLocalidad = async (location:Location.LocationObject) => {

    const lat = location.coords.latitude // latitud
    const lon = location.coords.longitude // longitud
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
      if(data.address != null && data.address.town != null){
        const town = data.address.town;
        setLocalidad(town.split("/")[0]);
        console.log(town.split("/")[0]);
      }else{
        setLocalidad(undefined);
      }
    })
    .catch(error => setLocalidad(undefined));
};
  
  useEffect(() => {
    //AsyncStorage.removeItem('token');
    AsyncStorage.getItem('token').then((value) => {
      if (value !== null) {
        const api = new Api<UsuarioRegistrado>(value);
        const token: string = value;
        api.get('/UsuarioRegistrado').then((value) => {
          if (!value.error) {
            console.log(value.data);
            setUser(value.data);
            setLogin(token != null);
            setLoading(false);
            (async () => {
      
              let { status } = await Location.requestForegroundPermissionsAsync();
              if (status !== 'granted') {
                setLocation(undefined);
                return;
              }
        
              let location = await Location.getCurrentPositionAsync({});
              setLocation(location);
              obtenerLocalidad(location);
            })();
        } else {
            alert("Email or Password incorrect");
            setLogin(false);
            setLoading(false);
            setLogin(false);
            setUser(undefined);
            alert(value.error);
        }
        });
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