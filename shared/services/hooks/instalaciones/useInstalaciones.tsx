import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Instalacion } from '../../../models/Instalacion';
import { FilterReserva } from '../../../models/Filter';

export const useInstalaciones = (filtro:FilterReserva) => {
  const [instalaciones, setInstalaciones] = useState<Instalacion[] | undefined>([]);
  const [filtroInstalacion, setFiltroInstalacion] = useState<FilterReserva>(filtro);
  const { t } = useTranslation();

  useEffect(() => {
    if (filtroInstalacion) {
      AsyncStorage.getItem('token').then((value) => {
        if (value !== null) {
          const api = new Api<any, Instalacion[]>(value);

          api.post('/Instalacion/Listarfiltros', filtroInstalacion).then((instalaciones) => {
            console.log(instalaciones.data);
            if (!instalaciones.error && instalaciones.data) {
              setInstalaciones(instalaciones.data);
            } else {
              const errormessage = t("ERROR");
              const erroraplicacion = t("ERROR_APLICACION");
              Alert.alert(errormessage, erroraplicacion);
              setInstalaciones([]);
              alert(instalaciones.error);
            }
          });
        } else {
          setInstalaciones([]);
        }
      });
    }
  }, [filtroInstalacion]);
  return { instalaciones, setInstalaciones, setFiltroInstalacion };
};