import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Evento } from '../../../models/Evento';
import { FilterReserva } from '../../../models/Filter';
import { useInstalaciones } from '../instalaciones/useInstalaciones';
import { useReservas } from '../reservas/useReservas';
import { Reserva } from '../../../models/Reserva';

export const useEventos = () => {
  const { t } = useTranslation();
  const {obtenerInstalacion} = useInstalaciones();

  const obtenerEventos = async (filtroEvento: FilterReserva): Promise<Evento[]> => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (token !== null) {
        const api = new Api<any, Evento[]>(token);
        const eventos = await api.post('/Evento/Listarfiltros', filtroEvento);
  
        if (!eventos.error && eventos.data) {

          for (const evento of eventos.data) {

            const reservas = await obtenerReservasEventos(evento.idevento);
            if (reservas) {
              evento.obtenerInscripciones = reservas.filter(i=>i.getPagoOfReserva != null && !i.cancelada);
            }
            const instalacion = await obtenerInstalacion(evento.obtenerInstalacion.idinstalacion);
            if (instalacion) {
              evento.obtenerInstalacion = instalacion;
            }
          }

          return eventos.data.filter(e=> e.activo && e.plazas > e.obtenerInscripciones.length && isTodayInRange(e.inicio,e.fin));
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
  function isTodayInRange(startDate: Date, endDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setHours(0, 0, 0, 0);
  
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);
  
    return adjustedStartDate <= today && today <= adjustedEndDate;
  }
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
  const obtenerReservasEventos = async (idevento: number): Promise<Reserva[]> => {
    if(idevento){
      try {
        const token = await AsyncStorage.getItem('token');
  
        if (token !== null) {
          const api = new Api<number, Reserva[]>(token);
          const reservas = await api.get('/Reserva/ObtenerReservasEvento?idEvento=' + idevento);
          if (!reservas.error) {
            if(reservas.data)
              return reservas.data;
              else
                return [];
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
    }
  };
  return {obtenerEventos, eventoDisponible, obtenerReservasEventos};
};