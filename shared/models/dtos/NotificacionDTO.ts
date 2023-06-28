import { TipoNotificacion } from "../TiposNotificacion";

export interface NotificacionDTO {
    receptor_oid: number;
    idnotificacion?: number;
    asunto: string;
    descripcion: string;
    leida: boolean;
    emisor_oid?: number;
    entidad_oid?: number;
    tipo: TipoNotificacion;
    evento_oid?: number;
    reserva_oid?: number;
  }