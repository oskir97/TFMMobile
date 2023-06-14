import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Reserva } from '../../../models/Reserva';
import { FilterReserva } from '../../../models/Filter';

export const useReservas = () => {
  const { t } = useTranslation();

  const obtenerReservas = async (filtroReserva: FilterReserva): Promise<Reserva[]> => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (token !== null) {
        const api = new Api<any, Reserva[]>(token);
        const reservas = await api.post('/Reserva/Listarfiltros', filtroReserva);
  
        if (!reservas.error && reservas.data) {
          return reservas.data;
        } else {
          const errormessage = t("ERROR");
          const erroraplicacion = t("ERROR_APLICACION");
          Alert.alert(errormessage, erroraplicacion);
          return [];
        }
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
      return [];
    }
  };
  return obtenerReservas;
};