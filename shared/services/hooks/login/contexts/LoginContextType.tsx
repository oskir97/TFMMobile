import { Filter } from "../../../../models/Filter";
import { UsuarioRegistrado } from "../../../../models/UsuarioRegistrado";
import * as Location from 'expo-location';

export type LoginContextType = {
    login:boolean;
    loading:boolean;
    location:Location.LocationObject | undefined;
    localidad:string | undefined;
    user:UsuarioRegistrado | undefined;
    filter:Filter |undefined;
    setLogin:(login: boolean) => void;
    setLocation:(location: Location.LocationObject | undefined) => void;
    setLocalidad:(localidad: string) => void;
    setLoading:(loading: boolean) => void;
    setUser:(user: UsuarioRegistrado) => void;
    logout:() => void;
    loginFunction:(email: string, password: string) => void;
    setFilter:(filter:Filter) => void;
    getLocation:() => Promise<string | undefined>;
  };