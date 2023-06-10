import { PistaEstado_l10n } from "./PistaEstado_l10n";

export interface PistaEstado {
    idestado: number;
    nombre: string;
    obtenerTraduccionesEstado: PistaEstado_l10n[];
  }