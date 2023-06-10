import { PagoTipo } from "./PagoTipo";

export interface Pago {
    idpago: number;
    subtotal: number;
    total: number;
    iva: number;
    fecha: Date | null;
    obtenerTipo: PagoTipo;
  }