import { Rol_l10n } from "./Rol_l10n";

export interface Rol {
    Idrol: number;
    Nombre: string;
    ObtenerTraduccionesRol: Rol_l10n[];
}