import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Reserva } from '../../../models/Reserva';
import { FilterReserva } from '../../../models/Filter';
import { ReservaDTO, TipoReservaEnum } from '../../../models/dtos/ReservaDTO';
import { useEventos } from '../eventos/useEventos';

export const useReservas = () => {
  const { t } = useTranslation();
  const { eventoDisponible } = useEventos();

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

  const existeReserva = async (idpista: number | undefined, fecha: Date): Promise<boolean> => {
    if (idpista) {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token !== null) {
          const api = new Api<any, boolean>(token);
          const pista = await api.post('/Pista/ExisteReserva?p_oid=' + idpista, fecha);
          if (!pista.error && typeof pista.data !== 'undefined') {
            return pista.data;
          } else {
            const errormessage = t("ERROR");
            const erroraplicacion = t("ERROR_RESERVA_EXISTENTE");
            Alert.alert(errormessage, erroraplicacion);
            return true;
          }
        } else {
          return true;
        }
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
        return true;
      }
    } else {
      return true;
    }
  };

  const partidoDisponible = async (idreserva: number | undefined): Promise<boolean> => {
    if (idreserva) {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token !== null) {
          const api = new Api<any, boolean>(token);
          const evento = await api.post('/Reserva/PartidoDisponible?p_oid=' + idreserva,null);
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

  const crearReserva = async (reserva: ReservaDTO, fecha: Date | undefined): Promise<Reserva | undefined> => {
    if (reserva && fecha) {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token !== null) {
          const api = new Api<any, boolean>(token);
          var disponible:boolean = false;
          if(reserva.tipo == TipoReservaEnum.Reserva && reserva.evento_oid == -1){
            disponible = await existeReserva(reserva.pista_oid, fecha);
            disponible = !disponible;
          }else if(reserva.tipo == TipoReservaEnum.Reserva && reserva.evento_oid > -1){
            disponible = await eventoDisponible(reserva.evento_oid);
          }else if(reserva.tipo == TipoReservaEnum.Inscripcion){
            disponible = await partidoDisponible(reserva.pista_oid);
          }
          if (disponible) {
            const apiReservas = new Api<any, Reserva>(token);
            const reservas = await apiReservas.post('/Reserva/Crear', reserva);
            if (!reservas.error && reservas.data) {
              return reservas.data;
            } else {
              const errormessage = t("ERROR");
              const erroraplicacion = t("ERROR_APLICACION");
              Alert.alert(errormessage, erroraplicacion);
              return undefined;
            }
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
        return undefined;
      }
    } else {
      return undefined;
    }
  };
  const eliminarReserva = async (reserva: Reserva): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token !== null) {
        const api = new Api<any, any>(token);
        const reservas = await api.delete('/Reserva/Eliminar?p_reserva_oid=' + reserva.idreserva);
        if (!reservas.error && reservas.data == "") {
          return true;
        } else {
          const errormessage = t("ERROR");
          const erroraplicacion = t("ERROR_APLICACION");
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
  };
  return { obtenerReservas, crearReserva, eliminarReserva, existeReserva, partidoDisponible };
};