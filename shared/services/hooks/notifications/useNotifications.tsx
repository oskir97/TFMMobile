import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Reserva } from '../../../models/Reserva';
import { Instalacion } from '../../../models/Instalacion';
import { Pista } from '../../../models/Pista';
import { Evento } from '../../../models/Evento';
import { TipoNotificacion } from '../../../models/TiposNotificacion';
import { NotificacionDTO } from '../../../models/dtos/NotificacionDTO';
import { Notificacion } from '../../../models/Notificacion';
import { UsuarioRegistrado } from '../../../models/UsuarioRegistrado';
import { TipoReserva } from '../../../models/TipoReserva';

export const crearNotificacion = async (usuario: UsuarioRegistrado | undefined, reserva: Reserva | undefined, nombrePartido: string | undefined, instalacion: Instalacion | undefined, pista: Pista | undefined, evento: Evento | undefined, partido: Reserva | undefined, fecha: Date | null, horario: string | undefined, tipoNotificacion: TipoNotificacion): Promise<Notificacion |undefined> => {
    if (fecha) {
        try {
            const token = await AsyncStorage.getItem('token');

            if (usuario && token !== null) {
                var notificacion: NotificacionDTO | undefined = undefined;
                switch (tipoNotificacion) {
                    case TipoNotificacion.confirmacion:
                        if (reserva && instalacion && pista && fecha && horario) {
                            notificacion = { entidad_oid: instalacion.obtenerEntidadInstalacion.identidad, reserva_oid: reserva.idreserva, receptor_oid: usuario?.idusuario, asunto: "Pista reservada", descripcion: "Se ha reservado la pista " + pista.nombre + " para el día " + reserva.fecha + " de " + horario, leida: false, tipo: TipoNotificacion.confirmacion };
                        } else if (reserva && evento && fecha && horario) {
                            notificacion = { entidad_oid: evento.obtenerInstalacion.obtenerEntidadInstalacion.identidad, evento_oid: evento.idevento, receptor_oid: usuario?.idusuario, asunto: "Evento inscrito", descripcion: "Se ha inscrito en el evento " + evento.nombre, leida: false, tipo: TipoNotificacion.confirmacion };
                        } else if (reserva && partido && nombrePartido && fecha && horario) {
                            notificacion = { entidad_oid: partido.obtenerPista.obtenerEntidadPista.identidad, reserva_oid: reserva.idreserva, receptor_oid: usuario?.idusuario, asunto: "Partido inscrito", descripcion: "Se ha inscrito al partido " + nombrePartido + " para el día " + reserva.fecha + " de " + horario, leida: false, tipo: TipoNotificacion.confirmacion };
                        }
                        break;
                    case TipoNotificacion.cancelacion:
                        if (reserva && reserva.tipo == TipoReserva.reserva && instalacion && pista && fecha && horario) {
                            notificacion = { entidad_oid: instalacion.obtenerEntidadInstalacion.identidad, reserva_oid: reserva.idreserva, receptor_oid: usuario?.idusuario, asunto: "Reserva cancelada", descripcion: "Se ha cancelado la reserva de la pista " + pista.nombre + " para el día " + reserva.fecha + " de " + horario, leida: false, tipo: TipoNotificacion.confirmacion };
                        } else if (reserva && evento && fecha && horario) {
                            notificacion = { entidad_oid: evento.obtenerInstalacion.obtenerEntidadInstalacion.identidad, evento_oid: evento.idevento, receptor_oid: usuario?.idusuario, asunto: "Evento cancelado", descripcion: "Se ha cancelado la subscripción al evento " + evento.nombre, leida: false, tipo: TipoNotificacion.confirmacion };
                        } else if (reserva && reserva.tipo == TipoReserva.inscripcion && nombrePartido && fecha && horario) {
                            notificacion = { entidad_oid: reserva.obtenerPista.obtenerEntidadPista.identidad, reserva_oid: reserva.idreserva, receptor_oid: usuario?.idusuario, asunto: "Inscripción a partido cancelada", descripcion: "Se ha cancela la inscripción al partido " + nombrePartido + " para el día " + reserva.fecha + " de " + horario, leida: false, tipo: TipoNotificacion.confirmacion };
                        } else if (reserva && reserva.tipo == TipoReserva.partido && nombrePartido && fecha && horario) {
                            notificacion = { entidad_oid: reserva.obtenerPista.obtenerEntidadPista.identidad, reserva_oid: reserva.idreserva, receptor_oid: usuario?.idusuario, asunto: "Partido cancelado", descripcion: "Se ha cancelado el partido " + nombrePartido + " para el día " + reserva.fecha + " de " + horario, leida: false, tipo: TipoNotificacion.confirmacion };
                        }
                        break;
                    case TipoNotificacion.envio:

                        break;
                }
                var route = "CrearNotifReserva";

                if(evento)
                    route = "CrearNotifEvento";

                if (notificacion) {
                    const api = new Api<NotificacionDTO, Notificacion>(token);
                    const notifapi = await api.post(`/Notificacion/${route}`, notificacion);
                    if (!notifapi.error && notifapi.data) {
                        console.log(notifapi);
                        return notifapi.data;
                    } else {
                        return undefined;
                    }
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        } catch (error) {
            console.error('Error al crear el pago:', error);
            return undefined;
        }
    } else {
        return undefined;
    }
}