import { TipoNotificacion } from "./TiposNotificacion";

export interface Notificacion {
    idnotificacion: number;
    asunto: string;
    descripcion: string;
    leida: boolean;
    tipo: TipoNotificacion;
    fecha: Date;
  }