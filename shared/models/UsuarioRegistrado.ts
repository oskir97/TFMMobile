import { Rol } from "./Rol";

export interface UsuarioRegistrado {
    Nombre: string;
    Email: string;
    Apellidos: string;
    Domicilio: string;
    Telefono: string;
    Telefonoalternativo: string;
    Fechanacimiento: Date | null;
    Alta: Date | null;
    Ubicacionactual: string;
    Codigopostal: string;
    Localidad: string;
    Provincia: string;
    Idusuario: number;
    Baja: Date | null;
    ObtenerRol: Rol;
  }