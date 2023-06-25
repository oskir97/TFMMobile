import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Evento } from '../../../models/Evento';
import { FilterReserva } from '../../../models/Filter';

export const useEventos = () => {
  const { t } = useTranslation();

  const obtenerEventos = async (filtroEvento: FilterReserva): Promise<Evento[]> => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (token !== null) {
        const api = new Api<any, Evento[]>(token);
        const eventos = await api.post('/Evento/Listarfiltros', filtroEvento);
  
        if (!eventos.error && eventos.data) {
          return eventos.data;
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
      console.error('Error al obtener las eventos:', error);
      return [];
    }
  };
  const eventoDisponible = async (idevento: number | undefined): Promise<boolean> => {
    if (idevento) {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token !== null) {
          const api = new Api<any, boolean>(token);
          const evento = await api.post('/Evento/Eventodisponible?p_oid=' + idevento,null);
          if (!evento.error && typeof evento.data !== 'undefined') {
            return evento.data;
          } else {
            const errormessage = t("ERROR");
            const erroraplicacion = t("ERROR_RESERVA_EXISTENTE");
            Alert.alert(errormessage, erroraplicacion);
            return false;
          }
        } else {
          return false;
        }
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
        return false;
      }
    } else {
      return false;
    }
  };
  return {obtenerEventos, eventoDisponible};
};