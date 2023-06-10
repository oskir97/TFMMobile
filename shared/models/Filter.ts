import { Deporte } from "./Deporte";

export type Sort = 'Distancia' | 'Valoracion' | 'Precio' | 'Distancia desc' | 'Valoracion desc' | 'Precio desc' | 'Favoritos'; 
export type TypeReservation = 'Pista' | 'Evento' | 'Partido'; 

export interface Filter {
    localidad?: string | undefined;
    deporte?:number | undefined;
    fecha?:Date |undefined
    sort?:Sort | undefined
    type?:TypeReservation
  }

  export interface FilterReserva {
    filtro: string | undefined,
    localidad: string | undefined,
    latitud: string | undefined,
    longitud: string | undefined,
    fecha: Date | undefined,
    deporte: number | undefined,
    orden: string | undefined
  }; 