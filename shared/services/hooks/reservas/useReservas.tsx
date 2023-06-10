import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Reserva } from '../../../models/Reserva';
import { FilterReserva } from '../../../models/Filter';

export const useReservas = (filtro:FilterReserva) => {
  const [reservas, setReservas] = useState<Reserva[] | undefined>([]);
  const [filtroReserva, setFiltroReserva] = useState<FilterReserva>(filtro);
  const { t } = useTranslation();

  useEffect(() => {
    if (filtroReserva) {
      AsyncStorage.getItem('token').then((value) => {
        if (value !== null) {
          const api = new Api<FilterReserva, Reserva[]>(value);

          api.post('/Reserva/Listarfiltros', filtroReserva).then((reservas) => {
            if (!reservas.error && reservas.data) {
              setReservas(reservas.data);
            } else {
              const errormessage = t("ERROR");
              const erroraplicacion = t("ERROR_APLICACION");
              Alert.alert(errormessage, erroraplicacion);
              setReservas([]);
              alert(reservas.error);
            }
          });
        } else {
          setReservas([]);
        }
      });
    }
  }, [filtroReserva]);
  return { reservas, setReservas, setFiltroReserva };
};