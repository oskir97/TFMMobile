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
import { TFunction } from 'i18next';

export const crearNotificacion = async (t: TFunction<"translation", undefined>, usuario: UsuarioRegistrado | undefined, reserva: Reserva | undefined, nombrePartido: string | undefined, instalacion: Instalacion | undefined, pista: Pista | undefined, evento: Evento | undefined, partido: Reserva | undefined, fecha: Date | null, horario: string | undefined, tipoNotificacion: TipoNotificacion): Promise<Notificacion | undefined> => {

    if (fecha || evento || partido) {
        try {
            const token = await AsyncStorage.getItem('token');

            if (usuario && token !== null) {
                var notificacion: NotificacionDTO | undefined = undefined;
                switch (tipoNotificacion) {
                    case TipoNotificacion.confirmacion:
                        if (reserva && instalacion && pista && fecha && horario && reserva.tipo != TipoReserva.partido) {
                            notificacion = { entidad_oid: instalacion.obtenerEntidadInstalacion.identidad, reserva_oid: reserva.idreserva, receptor_oid: usuario?.idusuario, asunto: t("PISTA_RESERVADA"), descripcion: t("RESERVADO_LA_PISTA") + " " + pista.nombre + " " + t("PARA_EL_DIA") + " " + new Date(reserva.fecha).toLocaleDateString() + " " + t("DE") + " " + horario, leida: false, tipo: TipoNotificacion.confirmacion };
                        } else if (reserva && evento) {
                            notificacion = { entidad_oid: evento.obtenerInstalacion.obtenerEntidadInstalacion.identidad, evento_oid: evento.idevento, receptor_oid: usuario?.idusuario, asunto: t("EVENTO_INSCRITO"), descripcion: t("SE_HA_INSCRITO_EVENTO") + " " + evento.nombre, leida: false, tipo: TipoNotificacion.confirmacion };
                        } else if (reserva && partido && nombrePartido && reserva.tipo == TipoReserva.partido) {
                            notificacion = { entidad_oid: partido.obtenerPista.obtenerEntidadPista.identidad, reserva_oid: reserva.idreserva, receptor_oid: usuario?.idusuario, asunto: t("PARTIDO_CREADO"), descripcion: t("SE_HA_CREADO_PARTIDO") + " " + nombrePartido + " " + t("PARA_EL_DIA") + " " + new Date(reserva.fecha).toLocaleDateString() + " " + t("DE") + " " + horario, leida: false, tipo: TipoNotificacion.confirmacion };
                        }
                        else if (reserva && partido && nombrePartido) {
                            notificacion = { entidad_oid: partido.obtenerPista.obtenerEntidadPista.identidad, reserva_oid: reserva.idreserva, receptor_oid: usuario?.idusuario, asunto: t("PARTIDO_INSCRITO"), descripcion: t("SE_HA_INSCRITO_PARTIDO") + " " + nombrePartido + " " + t("PARA_EL_DIA") + " " + new Date(reserva.fecha).toLocaleDateString() + " " + t("DE") + " " + horario, leida: false, tipo: TipoNotificacion.confirmacion };
                        }
                        break;
                    case TipoNotificacion.cancelacion:
                        if (reserva && instalacion && pista && fecha && horario) {
                            notificacion = { entidad_oid: instalacion.obtenerEntidadInstalacion.identidad, reserva_oid: reserva.idreserva, receptor_oid: usuario?.idusuario, asunto: t("PISTA_CANCELADA"), descripcion: t("SE_CANCELADO_RESERVA_PISTA") + " " + pista.nombre + " " + t("PARA_EL_DIA") + " " + new Date(reserva.fecha).toLocaleDateString() + " " + t("DE") + " " + horario, leida: false, tipo: TipoNotificacion.cancelacion };
                        } else if (reserva && evento) {
                            notificacion = { entidad_oid: evento.obtenerInstalacion.obtenerEntidadInstalacion.identidad, evento_oid: evento.idevento, receptor_oid: usuario?.idusuario, asunto: t("EVENTO_CANCELADO"), descripcion: t("CANCELADO_INSCRIPCION_EVENTO") + " " + evento.nombre, leida: false, tipo: TipoNotificacion.cancelacion };
                        } else if (reserva && partido && nombrePartido) {
                            notificacion = { entidad_oid: partido.obtenerPista.obtenerEntidadPista.identidad, reserva_oid: reserva.idreserva, receptor_oid: usuario?.idusuario, asunto: t("INSCRIPCION_PARTIDO_CANCELADA"), descripcion: t("CANCELADO_INSCRIPCION_PARTIDO") + " " + nombrePartido + " " + t("PARA_EL_DIA") + " " + new Date(reserva.fecha).toLocaleDateString() + " " + t("DE") + " " + horario, leida: false, tipo: TipoNotificacion.cancelacion };
                        } else if (reserva && reserva.tipo == TipoReserva.partido && nombrePartido && fecha && horario) {
                            notificacion = { entidad_oid: reserva.obtenerPista.obtenerEntidadPista.identidad, reserva_oid: reserva.idreserva, receptor_oid: usuario?.idusuario, asunto: t("PARTIDO_CANCELADO"), descripcion: t("CANCELADO_PARTIDO") + " " + nombrePartido + " " + t("PARA_EL_DIA") + " " + reserva.fecha + " " + t("DE") + " " + horario, leida: false, tipo: TipoNotificacion.cancelacion };
                        }
                        break;
                    case TipoNotificacion.envio:

                        break;
                }
                var route = "CrearNotifReserva";

                if (evento)
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