export interface PagoDTO {
    idpago?: number;
    subtotal: number;
    total: number;
    iva: number;
    tipo_oid: number;
    fecha: Date | null;
    reserva_oid: number;
    token: string;
  }