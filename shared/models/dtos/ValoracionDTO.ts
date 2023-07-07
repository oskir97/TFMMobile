export interface ValoracionDTO {
    idvaloracion?: number;
    estrellas: number;
    comentario: string;
    usuario_oid: number;
    entidad_oid?: number;
    instalacion_oid?: number;
    pista_oid?: number;
    usuariopartido_oid?: number;
    evento_oid?: number;
    fecha?: Date | null;
  }