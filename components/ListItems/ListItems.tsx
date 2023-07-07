import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, SafeAreaView, ScrollView, ImageBackground } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import {
    Tabs,
    TabScreen,
    useTabIndex,
    useTabNavigation,
} from 'react-native-paper-tabs';
import { TypeReservation } from '../../shared/models/Filter';
import { useReservas } from '../../shared/services/hooks/reservas/useReservas';
import { Reserva } from '../../shared/models/Reserva';
import ReservaList from './ReservaList';

interface ListItemsProps {
    type: TypeReservation;
    navigation: any;
}
const theme = {
    ...DefaultTheme,
    fonts: {
        ...DefaultTheme.fonts,
        medium: {
            fontSize: 10, // Tamaño de fuente personalizado
        },
    },
    colors: {
        ...DefaultTheme.colors,
        primary: '#04D6C8',
    },
};

function sumarTiempo(fecha1: Date, fecha2: Date): Date {
    const nuevaFecha = new Date(fecha1); // Crea una nueva instancia de Date basada en la primera fecha

    // Establece las horas, minutos y segundos de la nueva fecha a cero
    nuevaFecha.setHours(0);
    nuevaFecha.setMinutes(0);
    nuevaFecha.setSeconds(0);

    // Suma las horas, minutos y segundos de la segunda fecha a la nueva fecha
    nuevaFecha.setHours(nuevaFecha.getHours() + fecha2.getHours());
    nuevaFecha.setMinutes(nuevaFecha.getMinutes() + fecha2.getMinutes());
    nuevaFecha.setSeconds(nuevaFecha.getSeconds() + fecha2.getSeconds());

    return nuevaFecha; // Devuelve la nueva fecha resultante
}

function fechaComprendida(fecha: Date, fechaInicio: Date, fechaFin: Date): boolean {
    return fecha >= fechaInicio && fecha <= fechaFin;
}

const ListItems: React.FC<ListItemsProps> = ({ type, navigation }) => {
    const { t } = useTranslation();
    const [cargando, setCargando] = useState<boolean>(true);
    const [activas, setActivas] = useState<Reserva[] | undefined>(undefined);
    const [finalizadas, setFinalizadas] = useState<Reserva[] | undefined>(undefined);
    const [canceladas, setCanceladas] = useState<Reserva[] | undefined>(undefined);
    const [reload, setReload] = useState<boolean>(true);
    const { obtenerReservasPistaUsuario, obtenerReservasEventoUsuario, obtenerReservasPartidoUsuario } = useReservas();

    const ActivasScreen = () => (
        <ScrollView style={{ paddingLeft: 20, paddingRight: 20, marginTop: 20 }}>
            <ReservaList reservas={activas} estado='Activa' setReload={setReload} navigation={navigation} type={type} />
        </ScrollView>
    );

    const FinalizadasScreen = () => (
        <ScrollView style={{ paddingLeft: 20, paddingRight: 20, marginTop: 20 }}>
            <ReservaList reservas={finalizadas} estado='Finalizada' setReload={setReload} navigation={navigation} type={type} />
        </ScrollView>
    );

    const CanceladasScreen = () => (
        <ScrollView style={{ paddingLeft: 20, paddingRight: 20, marginTop: 20 }}>
            <ReservaList reservas={canceladas} estado='Cancelada' setReload={setReload} navigation={navigation} type={type} />
        </ScrollView>
    );

    var activasT: string;
    var finalizadasT: string;
    var canceladasT: string;

    switch (type) {
        case 'Pista':
            activasT = t('ACTIVAS');
            finalizadasT = t('FINALIZADAS');
            canceladasT = t('CANCELADAS')
            break;
        case 'Evento':
            activasT = t('ACTIVOS');
            finalizadasT = t('FINALIZADOS');
            canceladasT = t('CANCELADOS')
            break;
        case 'Partido':
            activasT = t('ACTIVOS');
            finalizadasT = t('FINALIZADOS');
            canceladasT = t('CANCELADOS')
            break;
    }

    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            if(!reload)
                obtainBooks();
        });

        obtainBooks();

    }, [reload]);

    // useEffect(() => {

    //     const unsubscribe = navigation.addListener('focus', () => {
    //         obtainBooks();
    //     });

    // });

    function obtainBooks() {
        setCargando(true);

        switch (type) {
            case 'Pista':
                obtenerReservasPistaUsuario().then((reservas) => {
                    setActivas(reservas.filter(r => !r.cancelada && sumarTiempo(new Date(r.fecha), new Date(r.obtenerHorarioReserva.fin)) >= new Date()));
                    setFinalizadas(reservas.filter(r => !r.cancelada && sumarTiempo(new Date(r.fecha), new Date(r.obtenerHorarioReserva.fin)) < new Date()));
                    setCanceladas(reservas.filter(r => r.cancelada));
                    setCargando(false);
                    setReload(false);
                });
                break;
            case 'Evento':
                obtenerReservasEventoUsuario().then((reservas) => {
                    setActivas(reservas.filter(r => !r.cancelada && fechaComprendida(new Date(), new Date(r.obtenerEventoReserva.inicio), new Date(r.obtenerEventoReserva.fin))));
                    setFinalizadas(reservas.filter(r => !r.cancelada && !fechaComprendida(new Date(), new Date(r.obtenerEventoReserva.inicio), new Date(r.obtenerEventoReserva.fin))));
                    setCanceladas(reservas.filter(r => r.cancelada));
                    setCargando(false);
                    setReload(false);
                });
                break;
            case 'Partido':
                obtenerReservasPartidoUsuario().then((reservas) => {
                    setActivas(reservas.filter(r => !r.cancelada && sumarTiempo(new Date(r.obtenerPartidoReserva.fecha), new Date(r.obtenerPartidoReserva.obtenerHorarioReserva.fin)) >= new Date()));
                    setFinalizadas(reservas.filter(r => !r.cancelada && sumarTiempo(new Date(r.obtenerPartidoReserva.fecha), new Date(r.obtenerPartidoReserva.obtenerHorarioReserva.fin)) < new Date()));
                    setCanceladas(reservas.filter(r => r.cancelada));
                    setCargando(false);
                    setReload(false);
                });
                break;
        }
    }

    return (
        <>{
            (
                !cargando && <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Tabs
                        iconPosition="top"
                        style={{ backgroundColor: '#fff' }}
                        theme={theme}
                    >
                        <TabScreen label={activasT} icon="alarm">
                            <ActivasScreen />
                        </TabScreen>
                        <TabScreen label={finalizadasT} icon="timer-off">
                            <FinalizadasScreen />
                        </TabScreen>
                        <TabScreen
                            label={canceladasT}
                            icon="cancel"
                        >
                            <CanceladasScreen />
                        </TabScreen>
                    </Tabs>
                </SafeAreaView>
            )
            ||
            (cargando &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 0 }}>
                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 0 }}>
                        <ImageBackground source={require('../../assets/images/loading.gif')} style={{ height: 230, width: 230 }} imageStyle={{ borderRadius: 10 }}></ImageBackground>
                    </View>
                </View>
            )
        }
        </>
    );
};

export default ListItems;