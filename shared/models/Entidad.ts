import { Valoracion } from "./Valoracion";

export interface Entidad {
    identidad: number;
    nombre: string;
    email: string;
    telefono: string;
    domicilio: string;
    cifnif: string;
    telefonoalternativo: string;
    codigopostal: string;
    localidad: string;
    provincia: string;
    imagen: string;
    configuracion: string;
    latitud: number;
    longitud: number;
    obtenerValoracionesEntidad: Valoracion[];
  }