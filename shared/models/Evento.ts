import { Deporte } from "./Deporte";
import { Horario } from "./Horario";
import { UsuarioRegistrado } from "./UsuarioRegistrado";
import { Valoracion } from "./Valoracion";

export interface Evento {
    idevento: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    plazas: number;
    obtenerInstructores: UsuarioRegistrado[];
    obtenerHorariosEvento: Horario[];
    obtenerDeporteEvento: Deporte;
    obtenerValoracionesEvento: Valoracion[];
  }