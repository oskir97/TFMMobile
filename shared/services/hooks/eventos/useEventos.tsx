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
  return obtenerEventos;
};