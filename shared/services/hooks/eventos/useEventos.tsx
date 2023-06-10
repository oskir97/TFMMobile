import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Evento } from '../../../models/Evento';
import { FilterReserva } from '../../../models/Filter';

export const useEventos = (filtro:FilterReserva) => {
  const [eventos, setEventos] = useState<Evento[] | undefined>([]);
  const [filtroEvento, setFiltroEvento] = useState<FilterReserva>(filtro);
  const { t } = useTranslation();

  useEffect(() => {
    if (filtroEvento) {
      AsyncStorage.getItem('token').then((value) => {
        if (value !== null) {
          const api = new Api<FilterReserva, Evento[]>(value);

          api.post('/Evento/Listarfiltros', filtroEvento).then((eventos) => {
            if (!eventos.error && eventos.data) {
              setEventos(eventos.data);
            } else {
              const errormessage = t("ERROR");
              const erroraplicacion = t("ERROR_APLICACION");
              Alert.alert(errormessage, erroraplicacion);
              setEventos([]);
              alert(eventos.error);
            }
          });
        } else {
          setEventos([]);
        }
      });
    }
  }, [filtroEvento]);
  return { eventos, setEventos, setFiltroEvento };
};