import { Deporte } from "./Deporte";

export type Sort = 'Distancia' | 'Valoracion' | 'Precio'; 
export type TypeReservation = 'Pista' | 'Evento' | 'Partido'; 

export interface Filter {
    localidad?: string | undefined;
    deporte?:number | undefined;
    fecha?:Date |undefined
    sort?:Sort | undefined
    type?:TypeReservation
  }