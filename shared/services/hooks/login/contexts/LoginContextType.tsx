import { UsuarioRegistrado } from "../../../../models/UsuarioRegistrado";
import * as Location from 'expo-location';

export type LoginContextType = {
    login:boolean;
    loading:boolean;
    location:Location.LocationObject | undefined;
    user:UsuarioRegistrado | undefined;
    setLogin:(login: boolean) => void;
    setLoading:(loading: boolean) => void;
    setUser:(user: UsuarioRegistrado) => void;
    logout:() => void;
  };