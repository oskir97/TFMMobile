import { View, FlatList, ScrollView, Text } from 'react-native'
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

export interface BookListProps {
    type: TypeReservation | undefined,
    filter: FilterReserva;
}

const BookList: React.FC<BookListProps> = ({ type, filter }) => {
    const obtenerInstalaciones = useInstalaciones();
    const obtenerEventos = useEventos();
    const obtenerReservas = useReservas();
    const [instalaciones, setInstalaciones] = useState<Instalacion[] | undefined>([]);
    const [eventos, setEventos] = useState<Evento[] | undefined>([]);
    const [partidos, setPartidos] = useState<Reserva[] | undefined>([]);

    const { t } = useTranslation();

    useEffect(() => {
        console.log(type);
        if (type) {
            switch (type) {
                case 'Pista':
                    obtenerInstalaciones(filter).then((instalaciones: Instalacion[] | undefined) => setInstalaciones(instalaciones));
                    break;
                case 'Evento':
                    obtenerEventos(filter).then((eventos: Evento[] | undefined) => setEventos(eventos));
                    break;
                case 'Partido':
                    obtenerReservas(filter).then((reservas: Reserva[] | undefined) => setPartidos(reservas));
                    break;
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
                        {instalaciones?.map((item, index) => (
                            <InstalacionItem key={index} item={item} />
                        ))}
                    </>
                ) || (type == 'Partido' &&
                    <>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 20 }} className="text-base font-semibold mt-1">{t("PARTIDOS_DISPONIBLES")}</Text>
                        </View>
                        {partidos?.map((item, index) => (
                            <PartidoItem key={index} item={item} />
                        ))}
                    </>
                ) || (type == 'Evento' &&
                    <>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 20 }} className="text-base font-semibold mt-1">{t("EVENTOS_DISPONIBLES")}</Text>
                        </View>
                        {eventos?.map((item, index) => (
                            <EventoItem key={index} item={item} />
                        ))}
                    </>)
            }
        </>
    );
};

export default BookList;