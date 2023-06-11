import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Evento } from '../../../models/Evento';
import { FilterReserva } from '../../../models/Filter';

export const useEventos = () => {
  const { t } = useTranslation();

  const obtenerEventos = async (filtroEvento: FilterReserva): Promise<Evento[] | undefined> => {
    if (filtroEvento) {
      AsyncStorage.getItem('token').then((value) => {
        if (value !== null) {
          const api = new Api<any, Evento[]>(value);

          api.post('/Evento/Listarfiltros', filtroEvento).then((instalaciones) => {
            console.log(instalaciones.data);
            if (!instalaciones.error && instalaciones.data) {
              return instalaciones.data;
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
  return obtenerEventos;
};