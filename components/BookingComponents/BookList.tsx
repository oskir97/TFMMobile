import { View, FlatList, ScrollView, Text, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { FilterReserva, TypeReservation } from '../../shared/models/Filter';
import { useInstalaciones } from '../../shared/services/hooks/instalaciones/useInstalaciones';
import { useEventos } from '../../shared/services/hooks/eventos/useEventos';
import { useReservas } from '../../shared/services/hooks/reservas/useReservas';
import { Instalacion } from '../../shared/models/Instalacion';
import { Evento } from '../../shared/models/Evento';
import { Reserva } from '../../shared/models/Reserva';
import InstalacionItem from './Items/InstalacionItem';
import PartidoItem from './Items/PartidoItem';
import EventoItem from './Items/EventoItem';
import { FontAwesome5 } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

export interface BookListProps {
    type: TypeReservation | undefined,
    filter: FilterReserva;
    navigation: any;
}

type ParamList = {
    loadingItems: {
      loadingItems?: boolean;
    };
  };

const BookList: React.FC<BookListProps> = ({ type, filter, navigation }) => {
    const obtenerInstalaciones = useInstalaciones();
    const obtenerEventos = useEventos();
    const obtenerReservas = useReservas();
    const [instalaciones, setInstalaciones] = useState<Instalacion[] | undefined>([]);
    const [eventos, setEventos] = useState<Evento[] | undefined>([]);
    const [partidos, setPartidos] = useState<Reserva[] | undefined>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const { t } = useTranslation();
    const route = useRoute<RouteProp<ParamList, 'loadingItems'>>();

    useEffect(() => {
        if (!route.params || (route.params && !route.params.loadingItems)) {
            if (type) {
                switch (type) {
                    case 'Pista':
                        setCargando(true);
                        obtenerInstalaciones(filter).then((instalaciones: Instalacion[]) => { setInstalaciones(instalaciones); setCargando(false); });
                        break;
                    case 'Evento':
                        setCargando(true);
                        obtenerEventos(filter).then((eventos: Evento[]) => { setEventos(eventos); setCargando(false); });
                        break;
                    case 'Partido':
                        setCargando(true);
                        obtenerReservas(filter).then((reservas: Reserva[]) => { setPartidos(reservas); setCargando(false); });
                        break;
                }
            }
        }
    }, [filter]);

    return (
        <>
            {
                (type == 'Pista' &&
                    <>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 20 }} className="font-semibold mt-1">{t("INSTALACIONES_DISPONIBLES")}</Text>
                        </View>
                        {
                            (!cargando && instalaciones && instalaciones.length > 0 && instalaciones?.map((item, index) => (
                                <InstalacionItem key={index} item={item} navigation={navigation} />
                            ))) ||
                            (!cargando &&
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                                    <FontAwesome5 name="sad-tear" size={100} color="#04D6C8" />
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20, alignContent: 'center' }}>
                                        {t('NO_HAY_INSTALACIONES_DISPONIBLES')}
                                    </Text>
                                </View>
                            )
                            ||
                            (cargando &&
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 30 }}>
                                        <ImageBackground source={require('../../assets/images/loading.gif')} style={{ height: 230, width: 230 }} imageStyle={{ borderRadius: 10 }}></ImageBackground>
                                    </View>
                                </View>
                            )
                        }
                    </>
                ) || (type == 'Partido' &&
                    <>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 20 }} className="text-base font-semibold mt-1">{t("PARTIDOS_DISPONIBLES")}</Text>
                        </View>
                        {
                            (!cargando && partidos && partidos.length > 0 && partidos?.map((item, index) => (
                                <PartidoItem key={index} item={item} />
                            ))) ||
                            (!cargando &&
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                                    <FontAwesome5 name="sad-tear" size={100} color="#04D6C8" />
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20, alignContent: 'center' }}>
                                        {t('NO_HAY_PARTIDOS_DISPONIBLES')}
                                    </Text>
                                </View>
                            ) ||
                            (cargando &&
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 70 }}>
                                        <ImageBackground source={require('../../assets/images/loading.gif')} style={{ height: 230, width: 230 }} imageStyle={{ borderRadius: 10 }}></ImageBackground>
                                    </View>
                                </View>
                            )
                        }
                    </>
                ) || (type == 'Evento' &&
                    <>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 20 }} className="text-base font-semibold mt-1">{t("EVENTOS_DISPONIBLES")}</Text>
                        </View>
                        {
                            (!cargando && eventos && eventos.length > 0 && eventos?.map((item, index) => (
                                <EventoItem key={index} item={item} />
                            ))) ||
                            (!cargando && (!eventos || eventos.length == 0) &&
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                                    <FontAwesome5 name="sad-tear" size={100} color="#04D6C8" />
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20, alignContent: 'center' }}>
                                        {t('NO_HAY_EVENTOS_DISPONIBLES')}
                                    </Text>
                                </View>
                            ) ||
                            (cargando &&
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 70 }}>
                                        <ImageBackground source={require('../../assets/images/loading.gif')} style={{ height: 230, width: 230 }} imageStyle={{ borderRadius: 10 }}></ImageBackground>
                                    </View>
                                </View>
                            )
                        }
                    </>)
            }
        </>
    );
};

export default BookList;