import { Entidad } from "./Entidad";
import { Valoracion } from "./Valoracion";

export interface Instalacion {
    idinstalacion: number;
    nombre: string;
    telefono: string;
    domicilio: string;
    ubicacion: string;
    imagen: string;
    codigopostal: string;
    localidad: string;
    provincia: string;
    telefonoalternativo: string;
    visible: boolean;
    latitud: number;
    longitud: number;
    obtenerEntidadInstalacion: Entidad;
    obtenerValoracionesInstalacion: Valoracion[];
  }