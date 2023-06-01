import { Deporte } from "./Deporte";

export interface Filter {
    localidad?: string | undefined;
    deporte?:number | undefined;
    fecha?:Date |undefined
  }