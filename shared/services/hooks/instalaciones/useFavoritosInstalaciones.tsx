import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Reserva } from '../../../models/Reserva';
import { FilterReserva } from '../../../models/Filter';

export const useFavoritosInstalaciones = () => {
  const { t } = useTranslation();

  const Asignarinstalacionfavoritos = async (idpista: number): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (token !== null) {
        const api = new Api<any, boolean>(token);
        const asignado = await api.put('/UsuarioRegistrado/Asignarinstalacionfavoritos', [idpista]);
  
        if (!asignado.error && asignado.data) {
          return asignado.data;
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

  const Eliminarinstalacionfavoritos = async (idpista: number): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (token !== null) {
        const api = new Api<any, boolean>(token);
        const asignado = await api.put('/UsuarioRegistrado/Eliminarinstalacionfavoritos', [idpista]);
  
        if (!asignado.error && asignado.data) {
          return asignado.data;
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
  return {Asignarinstalacionfavoritos, Eliminarinstalacionfavoritos};
};