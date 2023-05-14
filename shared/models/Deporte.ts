import { Deporte_l10n } from "./Deporte_l10n";

export interface Deporte {
    iddeporte: number;
    nombre: string;
    descripcion: string;
    icono: any;
    traduccionesDeporte: Deporte_l10n[];
  }