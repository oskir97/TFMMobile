import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Reserva } from '../../../models/Reserva';
import { FilterReserva } from '../../../models/Filter';
import { ReservaDTO } from '../../../models/dtos/ReservaDTO';
import { useReservas } from '../reservas/useReservas';
import { Pago } from '../../../models/Pago';
import { PagoDTO } from '../../../models/dtos/PagoDTO';
import { useEventos } from '../eventos/useEventos';
import { TipoPago } from '../../../models/TipoPago';

export const usePagos = () => {
  const { t } = useTranslation();
  const { existeReserva, partidoDisponible } = useReservas();
  const { eventoDisponible } = useEventos();

  const sePuedePagar = async (idpista: number | undefined, idevento: number | undefined, idpartido: number | undefined, fecha: Date): Promise<boolean> => {
    if (fecha) {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token !== null) {
          var disponible: boolean = false;
          if (idpista) {
            disponible = !(await existeReserva(idpista, fecha));
          } else if (idevento) {
            disponible = await eventoDisponible(idevento);
          } else if (idpartido) {
            disponible = await partidoDisponible(idpartido);
          }
          return disponible;
        } else {
          return false;
        }
      } catch (error) {
        console.error('Error al crear el pago:', error);
        return false;
      }
    } else {
      return false;
    }
  };

  const crearPago = async (pago: PagoDTO | undefined): Promise<Pago | undefined> => {
    if (pago) {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token !== null) {
          const apiPagos = new Api<any, Pago>(token);
          const pagos = await apiPagos.post('/Pago/Crear', pago);
          if (!pagos.error && pagos.data) {
            return pagos.data;
          } else {
            const errormessage = t("ERROR");
            const erroraplicacion = t("ERROR_APLICACION");
            Alert.alert(errormessage, erroraplicacion);
            return undefined;
          }
        } else {
          return undefined;
        }
      } catch (error) {
        console.error('Error al crear el pago:', error);
        return undefined;
      }
    } else {
      return undefined;
    }
  };
  const obtenerTiposPagos = async (): Promise<TipoPago[]> => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token !== null) {
        const api = new Api<any, TipoPago[]>(token);
        const horarios = await api.get('/PagoTipo/Listar');

        if (!horarios.error && horarios.data) {
          return horarios.data;
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
      console.error('Error al obtener los horarios disponibles:', error);
      return [];
    }
  };
  return { crearPago, obtenerTiposPagos, sePuedePagar };
};