import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Reserva } from '../../shared/models/Reserva';
import { I18nContext, useTranslation } from 'react-i18next';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { TypeReservation } from '../../shared/models/Filter';
import { Deporte } from '../../shared/models/Deporte';
import { useHorarios } from '../../shared/services/hooks/horarios/useHorarios';
import { EstadosReserva } from '../../shared/models/EstadosReserva';
import { useReservas } from '../../shared/services/hooks/reservas/useReservas';
import { useValoraciones } from '../../shared/services/hooks/valoraciones/useValoraciones';
import CreateReviewModal from './CreateReviewModal';
import { ValoracionDTO } from '../../shared/models/dtos/ValoracionDTO';
import { LoginContext } from '../../shared/services/hooks/login/contexts/LoginContext';
import { TipoReserva } from '../../shared/models/TipoReserva';
import showNotification from "../../shared/services/hooks/notifications/useNotificationsPush"
import { crearNotificacion } from "../../shared/services/hooks/notifications/useNotifications"
import { TipoNotificacion } from '../../shared/models/TiposNotificacion';
import { Horario } from '../../shared/models/Horario';
import { enviarCorreo } from '../../shared/services/hooks/emails/useEmail';

const ReservaList = ({ reservas, estado, setReload, navigation, type }: { reservas: Reserva[] | undefined, estado: EstadosReserva, setReload: any, navigation: any, type: TypeReservation }) => {
    const { t } = useTranslation();
    const { user } = useContext(LoginContext);
    const { i18n } = useContext(I18nContext);
    const { cancelarReserva } = useReservas();
    const { crearValoracion } = useValoraciones();
    const [modalvisible, setModalvisible] = useState<boolean>(false);
    const [reserva, setReserva] = useState<Reserva | undefined>(undefined);

    function obtenerHorario(reserva: Reserva): string {
        if (reserva.obtenerPartidoReserva != null) {
            return (formatTime(reserva.obtenerPartidoReserva.obtenerHorarioReserva.inicio) + " - " + formatTime(reserva.obtenerPartidoReserva.obtenerHorarioReserva.fin));
        } else if (reserva.obtenerEventoReserva != null) {
            return (new Date(reserva.obtenerEventoReserva.inicio).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')) + " " + new Date(reserva.obtenerEventoReserva.inicio).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es') + " - " + (new Date(reserva.obtenerEventoReserva.fin).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')) + " " + new Date(reserva.obtenerEventoReserva.fin).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es');
        } else {
            return (formatTime(reserva.obtenerHorarioReserva.inicio) + " - " + formatTime(reserva.obtenerHorarioReserva.fin));
        }
    }

    function obtenerHorarioInicioReserva(reserva: Reserva): Date {
        if (reserva.obtenerPartidoReserva != null) {
            return new Date(reserva.obtenerPartidoReserva.obtenerHorarioReserva.inicio);
        } else if (reserva.obtenerEventoReserva != null) {
            return new Date(reserva.obtenerEventoReserva.inicio);
        } else {
            return new Date(reserva.obtenerHorarioReserva.inicio);
        }
    }

    function formatHorarios(horarios: Horario[] | undefined): JSX.Element {
        if (horarios) {
            const formattedHorarios: JSX.Element[] = [];

            for (const horario of horarios) {
                const diasSemana = horario.obtenerDiasSemana.map(dia => t(dia.nombre.toUpperCase().replace("É", "E").replace("Á", "A"))).join(', ');
                const inicio = horario.inicio ? new Date(horario.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                const fin = horario.fin ? new Date(horario.fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

                const diasSemanaElement = <Text style={{ fontWeight: 'bold', marginBottom: 0, fontSize: 14 }} numberOfLines={3} ellipsizeMode="tail">{diasSemana}</Text>;
                const horasElement = <Text style={{ fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">{t('DE2')} {inicio} {t('A2')} {fin}</Text>;
                formattedHorarios.push(
                    <View key={horario.idhorario}>
                        {diasSemanaElement}
                        {horasElement}
                    </View>
                );
            }

            return <>{formattedHorarios}</>;
        } else {
            return <></>
        }
    }

    function crearNuevaFecha(fecha1: Date, fecha2: Date): Date {
        const year = fecha1.getFullYear();
        const month = fecha1.getMonth();
        const day = fecha1.getDate();
        const hours = fecha2.getHours();
        const minutes = fecha2.getMinutes();
        const nuevaFecha: Date = new Date(year, month, day, hours, minutes);
        return nuevaFecha;
    }

    function formatTime(timeString: Date | null): string {
        if (timeString != null) {
            const date = new Date(timeString);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        } else {
            return "";
        }
    }

    function translatesport(deporte: Deporte | undefined) {
        if (deporte) {
            const nombreTraducido = deporte.traduccionesDeporte.find((tr) => tr.getIdiomaDeporte.cultura === i18n.language)?.nombre;
            return nombreTraducido;
        }
    }

    function getName(reserva: Reserva): string | undefined {
        return (reserva.obtenerEventoReserva && reserva.obtenerEventoReserva.nombre) || (reserva.obtenerPartidoReserva && `${t("PARTIDO")} ${t("DE")} ${translatesport(reserva.obtenerPartidoReserva.obtenerDeporteReserva)}`);
    }

    function getInstalacion(reserva: Reserva): string | undefined {
        return (reserva.obtenerPista && reserva.obtenerPista.obtenerInstalaciones.nombre) || (reserva.obtenerEventoReserva && reserva.obtenerEventoReserva.obtenerInstalacion.nombre) || (reserva.obtenerPartidoReserva && reserva.obtenerPartidoReserva.obtenerPista.obtenerInstalaciones.nombre);
    }

    function getPista(reserva: Reserva): string | undefined {
        if (reserva.obtenerPista) {
            return reserva.obtenerPista.nombre;
        } else if (reserva.obtenerEventoReserva && reserva.obtenerEventoReserva.obtenerHorariosEvento) {
            return reserva.obtenerPista.nombre;
        } else if (reserva.obtenerPartidoReserva) {
            return reserva.obtenerPartidoReserva.obtenerPista.nombre;
        } else {
            return undefined;
        }
    }

    function handleDelete(reserva: Reserva) {
        var tipo: string = reserva.obtenerEventoReserva != null ? "EVENTO" : (reserva.obtenerPartidoReserva != null ? "PARTIDO" : "RESERVA");
        Alert.alert(
            t('CONFIRMACION'),
            t('ESTAS_SEGURO_CANCELAR_' + tipo),
            [
                { text: t('NO'), style: 'cancel' },
                { text: t('SI'), style: 'destructive', onPress: () => cancel(reserva) },
            ],
            { cancelable: true }
        );
    }
    const handleReview = (data: any) => {
        var valoracion: ValoracionDTO = { estrellas: data.estrellas, comentario: data.comentario, usuario_oid: user.idusuario, instalacion_oid: reserva.tipo == TipoReserva.reserva ? reserva.obtenerPista.obtenerInstalaciones.idinstalacion : -1, evento_oid: reserva.obtenerEventoReserva ? reserva.obtenerEventoReserva.idevento : -1, usuariopartido_oid: reserva.obtenerPartidoReserva ? reserva.obtenerPartidoReserva.obtenerUsuarioCreador.idusuario : -1 }
        crearValoracion(valoracion).then((valoracion) => {
            if (valoracion) {
                const errormessage = t("VALORACION_CREADA");
                const erroraplicacion = t("SE_HA_CREADO_TU_VALORACION");
                Alert.alert(errormessage, erroraplicacion);
                setModalvisible(false);
            }
        })
    };

    function contruirAsunto(): string {
        switch (type) {
            case 'Evento':
                return t("EVENTO_CANCELADO")
                break;
            case 'Partido':
                return t("INSCRIPCION_PARTIDO_CANCELADA")
                break;
            case 'Pista':
                return t("PISTA_CANCELADA")
                break;
        }
    }

    function construirCuerpo(): string {
        switch (type) {
            case 'Evento':
                return t("CANCELADO_INSCRIPCION_EVENTO")
                break;
            case 'Partido':
                return t("CANCELADO_INSCRIPCION_PARTIDO")
                break;
            case 'Pista':
                return t("SE_CANCELADO_RESERVA_PISTA")
                break;
        }
    }

    function cancel(reserva: Reserva) {
        cancelarReserva(reserva).then((cancelada: boolean) => {
            if (cancelada) {
                crearNotificacion(t, user, reserva, getName(reserva), reserva.obtenerPista ? reserva.obtenerPista.obtenerInstalaciones : undefined, reserva.obtenerPista ? reserva.obtenerPista : undefined, reserva.obtenerEventoReserva ? reserva.obtenerEventoReserva : undefined, reserva.obtenerPartidoReserva ? reserva.obtenerPartidoReserva : undefined, reserva.obtenerPartidoReserva ? reserva.obtenerPartidoReserva.fecha : reserva.fecha, (type == 'Pista' && (formatTime(reserva.obtenerHorarioReserva.inicio) + " - " + formatTime(reserva.obtenerHorarioReserva.fin))) || (type == 'Partido' && (formatTime(reserva.obtenerPartidoReserva.obtenerHorarioReserva.inicio) + " - " + formatTime(reserva.obtenerPartidoReserva.obtenerHorarioReserva.fin))), TipoNotificacion.cancelacion).then((notif) => {
                    if (notif)
                        showNotification({ title: notif.asunto, body: notif.descripcion, url: "Notificaciones", navigation: navigation });
                });
                enviarCorreo(reserva.email, contruirAsunto(),
                    `${construirCuerpo()}<br><br>
                          ${type == 'Evento' || type == 'Partido' ? ((type == 'Evento' && t("EVENTO")) || (type == 'Partido' && t("PARTIDO"))) + ": " + getName(reserva) + "<br>" : ""}
                          ${t("INSTALACION") + ": " + getInstalacion(reserva) + "<br>"}
                          ${t("PISTA") + ": " + getPista(reserva) + "<br>"}
                          ${t("FECHA") + ": " + new Date().toLocaleDateString() + "<br>"}
                          `

                );
                setReload(true);
            }
        })
    }

    function obtenerNombreValoracion(reserva) {
        var tipo: string = reserva.obtenerEventoReserva != null ? "EVENTO" : (reserva.obtenerPartidoReserva != null ? "PARTIDO" : "INSTALACION");
        var nombre = (reserva.obtenerPartidoReserva ? `${reserva.obtenerUsuarioCreador.nombre} ${reserva.obtenerUsuarioCreador.apellidos}` : (reserva.obtenerEventoReserva ? reserva.obtenerEventoReserva.nombre : reserva.obtenerPista.obtenerInstalaciones.nombre));
        return `${t("VALORA_" + tipo)} ${nombre}`
    }

    const deporteIcon = (item: Deporte | undefined) => (
        <View style={{ flexDirection: 'row', marginBottom: 0 }}>
            {
                (item && item.icono.endsWith("&ionic") &&
                    <Ionicons
                        name={item.icono.replace("&ionic", "")}
                        color={'#04D6C8'}
                        size={25}
                    />)
            }
            {
                (item && item.icono.endsWith("&materialcomunnityicons") &&
                    <MaterialCommunityIcons
                        name={item.icono.replace("&materialcomunnityicons", "")}
                        color={'#04D6C8'}
                        size={25}
                    />)
            }
            {
                (item && item.icono.endsWith("&fontawesome5") &&
                    <FontAwesome5
                        name={item.icono.replace("&fontawesome5", "")}
                        color={'#04D6C8'}
                        size={25}
                    />)
            }
            <Text style={{ marginLeft: 6, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#04D6C8' }}>{translatesport(item)}</Text>
        </View>
    );

    const ReservaItem = ({ reserva }: { reserva: Reserva | undefined }) => (
        <>
            <View style={styles.itemContainer}>
                {estado == 'Activa' &&
                    <TouchableOpacity style={styles.button} onPress={() => handleDelete(reserva)}>
                        <FontAwesome name="remove" size={20} color="red" />
                    </TouchableOpacity>
                }
                {estado == 'Finalizada' &&
                    <TouchableOpacity style={styles.button} onPress={() => { setReserva(reserva); setModalvisible(true) }}>
                        <FontAwesome name="star" size={20} color="orange" />
                    </TouchableOpacity>
                }
                <View style={styles.dateCircle}>
                    {
                        type == 'Evento' && (
                            <>
                                <Text style={styles.dateText}>{new Date(reserva.obtenerEventoReserva.inicio).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')}</Text>
                                <Text style={{ margin: -6, color: 'white' }}>-</Text>
                                <Text style={styles.dateText}>{new Date(reserva.obtenerEventoReserva.fin).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')}</Text>
                            </>
                        )
                    }
                    {
                        type != 'Evento' && <Text style={styles.dateText}>{new Date(reserva.fecha).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')}</Text>
                    }
                </View>
                <View style={styles.itemContent}>
                    {(type != 'Evento') && (
                        <>
                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={styles.timeText}>{obtenerHorario(reserva)}</Text>
                                {
                                    type == 'Partido' && reserva.obtenerPartidoReserva.obtenerUsuarioCreador.idusuario == user.idusuario && (
                                        <FontAwesome5 name="user-check" size={20} color="green" style={{marginLeft:10}} />
                                    )
                                }
                            </View>
                        </>
                    )}
                    {(reserva.obtenerEventoReserva || reserva.obtenerPartidoReserva) && (
                        <>
                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text style={{ fontSize: 16 }} className="font-semibold">{getName(reserva)}</Text>
                            </View>
                        </>
                    )}
                    <View style={{ flexDirection: 'row', marginBottom: 5, marginRight: 10 }}>
                        <Text style={{ fontSize: 14 }} className="font-semibold" numberOfLines={3} ellipsizeMode="tail">{getInstalacion(reserva)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Text style={{ fontSize: 14 }} numberOfLines={3} ellipsizeMode="tail">{getPista(reserva)}</Text>
                    </View>
                    {type == 'Evento' && estado != 'Cancelada' && (
                        <Text style={{ marginBottom: 10, marginTop: -8 }}>{formatHorarios(reserva.obtenerEventoReserva.obtenerHorariosEvento)}</Text>
                    )

                    }
                    {estado == 'Cancelada' && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <FontAwesome name="remove" size={16} color="red" style={{ marginRight: 5 }} />
                            <Text style={{ fontWeight: 'bold', color: 'red' }}>{new Date(reserva.fechaCancelada).toLocaleDateString()}</Text>
                        </View>
                    )

                    }
                    {(reserva.obtenerDeporteReserva) && (
                        deporteIcon(reserva.obtenerDeporteReserva)
                    )}
                </View>
            </View>
        </>
    );

    return (
        <>
            <View>
                {reservas && reservas.length > 0 && reservas.sort((a, b) => {
                    if (a.fecha && b.fecha) {
                        // Comparar las fechas de inicio en orden descendente
                        return crearNuevaFecha(new Date(b.fecha), obtenerHorarioInicioReserva(b)).getTime() - crearNuevaFecha(new Date(a.fecha), obtenerHorarioInicioReserva(a)).getTime();
                    } else {
                        // Manejar el caso en el que alguna fecha sea nula o no esté definida
                        return 0;
                    }
                }).map((reserva) => (
                    <React.Fragment key={reserva.idreserva}>
                        <ReservaItem
                            reserva={reserva}
                        />
                        <View style={styles.separator} />
                    </React.Fragment>
                ))}
                {!reservas || reservas.length == 0 &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                        <FontAwesome5 name="calendar" size={100} color="#04D6C8" />
                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20, alignContent: 'center' }}>
                            {type == 'Pista' ? t("NO_HAY_RESERVAS") : (type == 'Evento' ? t("NO_HAY_EVENTOS") : t("NO_HAY_PARTIDOS"))}
                        </Text>
                    </View>
                }
            </View>
            <CreateReviewModal visible={modalvisible} title={reserva ? obtenerNombreValoracion(reserva) : ""} animationType={"none"}
                onConfirm={handleReview} onCancel={() => setModalvisible(false)} />
        </>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingRight: 10
    },
    dateCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: '#106F69',
        borderWidth: 2,
        backgroundColor: '#04D6C8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    itemContent: {
        flex: 1,
        marginLeft: 20,
    },
    timeText: {
        fontSize: 14,
        color: '#000000',
    },
    deporteText: {
        fontSize: 12,
        color: '#666666',
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
    },
    button: {
        position: 'absolute',
        top: 12,
        right: 6,
        zIndex: 1,
    },
});

export default ReservaList;