import { UsuarioRegistrado } from "./UsuarioRegistrado";

export interface Valoracion {
    idvaloracion: number;
    estrellas: number;
    comentario: string;
    fecha:Date |undefined;
    obtenerUsuarioCreadorValoracion:UsuarioRegistrado
  }