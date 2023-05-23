import { Deporte } from "./Deporte";

export interface Filter {
    localidad?: string | undefined;
    deporte?:Deporte | undefined;
    fecha?:Date |undefined
  }