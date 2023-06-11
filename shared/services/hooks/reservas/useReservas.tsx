import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Reserva } from '../../../models/Reserva';
import { FilterReserva } from '../../../models/Filter';

export const useReservas = () => {
  const { t } = useTranslation();

  const obtenerReservas = async (filtroReserva: FilterReserva): Promise<Reserva[] | undefined> => {
    if (filtroReserva) {
      AsyncStorage.getItem('token').then((value) => {
        if (value !== null) {
          const api = new Api<any, Reserva[]>(value);

          api.post('/Reserva/Listarfiltros', filtroReserva).then((reservas) => {
            console.log(reservas.data);
            if (!reservas.error && reservas.data) {
              return reservas.data;
            } else {
              const errormessage = t("ERROR");
              const erroraplicacion = t("ERROR_APLICACION");
              Alert.alert(errormessage, erroraplicacion);
             return [];
            }
          });
        } else {
          return [];
        }
      });
    }else{
      return [];
    }
  };
  return obtenerReservas;
};