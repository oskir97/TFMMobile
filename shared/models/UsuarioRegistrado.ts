import { Rol } from "./Rol";
import { Valoracion } from "./Valoracion";

export interface UsuarioRegistrado {
    nombre: string;
    email: string;
    apellidos: string;
    domicilio: string;
    numero:string;
    telefono: string;
    telefonoalternativo: string;
    fechanacimiento: Date | null;
    alta: Date | null;
    ubicacionactual: string;
    codigopostal: string;
    localidad: string;
    provincia: string;
    idusuario: number;
    baja: Date | null;
    obtenerRol: Rol;
    obtenerValoracionesAUsuarioPartido: Valoracion[];
  }