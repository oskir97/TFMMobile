import { Deporte } from "./Deporte";
import { Horario } from "./Horario";
import { Instalacion } from "./Instalacion";
import { Pista } from "./Pista";
import { Reserva } from "./Reserva";
import { UsuarioRegistrado } from "./UsuarioRegistrado";
import { Valoracion } from "./Valoracion";

export interface Evento {
    idevento: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    plazas: number;
    precio:number;
    inicio:Date |null;
    fin:Date |null;
    obtenerInstructores: UsuarioRegistrado[];
    obtenerHorariosEvento: Horario[];
    obtenerDeporteEvento: Deporte;
    obtenerValoracionesEvento: Valoracion[];
    obtenerInstalacion: Instalacion;
    obtenerInscripciones: Reserva[];
    obtenerPistaEvento: Pista;
  }