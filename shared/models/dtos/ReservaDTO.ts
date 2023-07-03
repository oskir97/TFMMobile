export interface ReservaDTO {
    idreserva?: number | undefined;
    nombre: string | undefined;
    apellidos: string | undefined;
    email: string | undefined;
    telefono: string | undefined;
    usuario_oid: number | undefined;
    cancelada: boolean | undefined;
    pista_oid?: number | undefined;
    maxparticipantes: number | undefined;
    pago_oid?: number | undefined;
    horario_oid?: number | undefined;
    fecha?: Date | null |undefined;
    inscripciones?: ReservaDTO[] | undefined;
    partido_oid?: number | undefined;
    tipo: TipoReservaEnum;
    notificacion_oid?: number[] | undefined;
    fechaCreacion?: Date | null;
    fechaCancelada?: Date | null;
    deporte_oid: number;
    evento_oid?: number;
}

export enum TipoReservaEnum {
    Reserva = 1,
    Partido = 2,
    Inscripcion = 3
}