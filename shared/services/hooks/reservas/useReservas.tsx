import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Reserva } from '../../../models/Reserva';
import { FilterReserva } from '../../../models/Filter';
import { ReservaDTO, TipoReservaEnum } from '../../../models/dtos/ReservaDTO';
import { useEventos } from '../eventos/useEventos';
import { useInstalaciones } from '../instalaciones/useInstalaciones';

export const useReservas = () => {
  const { t } = useTranslation();
  const { eventoDisponible } = useEventos();
  const {obtenerInstalacion} = useInstalaciones();

  const obtenerReservas = async (filtroReserva: FilterReserva): Promise<Reserva[]> => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token !== null) {
        const api = new Api<any, Reserva[]>(token);
        const reservas = await api.post('/Reserva/Listarfiltros', filtroReserva);

        if (!reservas.error && reservas.data) {
          for (const reserva of reservas.data) {
            const reservas = await ObtenerInscripciones(reserva.idreserva);
            if (reservas) {
              reserva.obtenerInscripciones = reservas.filter(i=>i.getPagoOfReserva != null);
            }
            const instalacion = await obtenerInstalacion(reserva.obtenerPista.obtenerInstalaciones.idinstalacion);
            if (instalacion) {
              reserva.obtenerPista.obtenerInstalaciones = instalacion;
            }
          }

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

  const ObtenerInscripciones = async (idreserva: number): Promise<Reserva[]> => {
    if(idreserva){
      try {
        const token = await AsyncStorage.getItem('token');
  
        if (token !== null) {
          const api = new Api<number, Reserva[]>(token);
          const reservas = await api.get('/Reserva/Reserva_obtenerinscripciones?p_idreserva=' + idreserva);
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

  function agregarMinutosSegundos(fechaBase: Date, fechaAgregar: Date): Date {
    const minutos = fechaAgregar.getMinutes();
    const segundos = fechaAgregar.getSeconds();
  
    const nuevaFecha = new Date(fechaBase.getTime());
    nuevaFecha.setMinutes(nuevaFecha.getMinutes() + minutos);
    nuevaFecha.setSeconds(nuevaFecha.getSeconds() + segundos);
  
    return nuevaFecha;
  }

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
    if (reserva && (fecha || reserva.pista_oid < 0)) {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token !== null) {
          const api = new Api<any, boolean>(token);
          var disponible:boolean = false;
          if(reserva.tipo == TipoReservaEnum.Reserva && reserva.evento_oid == -1){
            disponible = await existeReserva(reserva.pista_oid, fecha);
            disponible = !disponible;
          }else if(reserva.tipo == TipoReservaEnum.Inscripcion && reserva.evento_oid > -1){
            disponible = await eventoDisponible(reserva.evento_oid);
          }else if(reserva.tipo == TipoReservaEnum.Inscripcion){
            disponible = await partidoDisponible(reserva.partido_oid);
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
  const eliminarReserva = async (idreserva: number): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token !== null) {
        const api = new Api<any, any>(token);
        const reservas = await api.delete('/Reserva/Eliminar?p_reserva_oid=' + idreserva);
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