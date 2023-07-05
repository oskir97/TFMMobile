import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Reserva } from '../../shared/models/Reserva';
import { I18nContext, useTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';

const ReservaList = ({ reservas }: { reservas: Reserva[] | undefined }) => {
    const { t } = useTranslation();
    const { i18n } = useContext(I18nContext);

    function obtenerHorario(reserva: Reserva): string {
        if (reserva.obtenerPartidoReserva != null) {
            return (formatTime(reserva.obtenerPartidoReserva.obtenerHorarioReserva.inicio) + " - " + formatTime(reserva.obtenerPartidoReserva.obtenerHorarioReserva.fin));
        } else if (reserva.ObtenerEventoReserva != null) {
            return (new Date(reserva.ObtenerEventoReserva.inicio).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')) + " " + new Date(reserva.ObtenerEventoReserva.inicio).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es') + " - " + (new Date(reserva.ObtenerEventoReserva.fin).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')) + " " + new Date(reserva.ObtenerEventoReserva.fin).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es');
        } else {
            return (formatTime(reserva.obtenerHorarioReserva.inicio) + " - " + formatTime(reserva.obtenerHorarioReserva.fin));
        }
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

    const ReservaItem = ({ reserva }: { reserva: Reserva | undefined }) => (
        <View style={styles.itemContainer}>
            <View style={styles.dateCircle}>
                <Text style={styles.dateText}>{new Date(reserva.fecha).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')}</Text>
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.timeText}>{obtenerHorario(reserva)}</Text>
                {/* <Text style={styles.deporteText}>{deporte}</Text> */}
            </View>
        </View>
    );

    return (
        <View>
            {reservas && reservas.length > 0 && reservas.map((reserva) => (
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
                        {t('NO_HAY_RESERVAS')}
                    </Text>
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    dateCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
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
});

export default ReservaList;