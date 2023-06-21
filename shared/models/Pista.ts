import { Deporte } from "./Deporte";
import { Entidad } from "./Entidad";
import { Horario } from "./Horario";
import { Instalacion } from "./Instalacion";
import { PistaEstado } from "./PistaEstado";
import { Valoracion } from "./Valoracion";

export interface Pista {
    idpista: number;
    nombre: string;
    ubicacion: string;
    imagen: string;
    maxreservas: number;
    visible: boolean;
    precio: number;
    latitud: number;
    longitud: number;
    obtenerHorarios: Horario[];
    obtenerHorariosDisponibles: Horario[];
    obtenerInstalaciones: Instalacion;
    obtenerEntidadPista: Entidad;
    obtenerValoracionesPista: Valoracion[];
    obtenerEstado: PistaEstado;
    obtenerDeporte: Deporte[];
  }