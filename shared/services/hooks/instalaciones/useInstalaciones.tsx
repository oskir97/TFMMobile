import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Instalacion } from '../../../models/Instalacion';
import { FilterReserva } from '../../../models/Filter';

export const useInstalaciones = () => {
  const { t } = useTranslation();

  const obtenerInstalaciones = async (filtroInstalacion: FilterReserva): Promise<Instalacion[] | undefined> => {
    if (filtroInstalacion) {
      AsyncStorage.getItem('token').then((value) => {
        if (value !== null) {
          const api = new Api<any, Instalacion[]>(value);

          api.post('/Instalacion/Listarfiltros', filtroInstalacion).then((instalaciones) => {
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
  return obtenerInstalaciones;
};