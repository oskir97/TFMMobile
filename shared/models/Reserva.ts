import { Deporte } from "./Deporte";
import { Evento } from "./Evento";
import { Horario } from "./Horario";
import { NivelPartido } from "./NivelPartido";
import { Pago } from "./Pago";
import { Pista } from "./Pista";
import { TipoReserva } from "./TipoReserva";
import { UsuarioRegistrado } from "./UsuarioRegistrado";

export interface Reserva {
    idreserva?: number;
    cancelada?: boolean;
    maxparticipantes?: number;
    fecha?: Date | null;
    tipo?: TipoReserva;
    nombre?: string;
    apellidos?: string;
    email?: string;
    telefono?: string;
    fechaCreacion?: Date | null;
    fechaCancelada?: Date | null;
    obtenerPista?: Pista;
    getPagoOfReserva?: Pago;
    obtenerUsuarioCreador?: UsuarioRegistrado;
    obtenerHorarioReserva?: Horario;
    obtenerDeporteReserva?: Deporte;
    obtenerInscripciones?: Reserva[];
    nivelpartido?: NivelPartido;
    obtenerPartidoReserva?:Reserva;
    obtenerEventoReserva?:Evento;
    descripcionpartido?:string;
    imagen?: string;
  }