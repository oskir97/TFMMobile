import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Instalacion } from '../../../models/Instalacion';
import { FilterReserva } from '../../../models/Filter';
import { Pista } from '../../../models/Pista';
import { useContext } from 'react';
import { LoginContext } from '../login/contexts/LoginContext';

export const useInstalaciones = () => {
  const { t } = useTranslation();
  const { location } = useContext(LoginContext);

  const calculateTravelDuration = async (instalacion: Instalacion) => {
    if (location) {
      try {
        const apiKey = 'AIzaSyDB2bGI_qo-wtNjBZ690FvrcVeQK4kS7Jg';
        const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${location?.coords.latitude},${location?.coords.longitude}&destination=${instalacion.latitud},${instalacion.longitud}&mode=walking&key=${apiKey}`;
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.routes.length > 0) {
          const distance = result.routes[0].legs[0].distance.text;
          const duration = result.routes[0].legs[0].duration.text;
          return [distance,duration];
        } else {
          return "";
        }
      } catch (error) {
        return "";
      }
    } else {
      return "";
    }
  };

  const obtenerInstalaciones = async (filtroInstalacion: FilterReserva): Promise<Instalacion[]> => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token !== null) {
        const api = new Api<any, Instalacion[]>(token);
        const instalaciones = await api.post('/Instalacion/Listarfiltros', filtroInstalacion);

        if (!instalaciones.error && instalaciones.data) {

          const apiFav = new Api<any, boolean>(token);
          const apiPistas = new Api<any, Pista[]>(token);

          for (const instalacion of instalaciones.data) {
            const favorita = await apiFav.get('/Instalacion/Esfavorita?p_oid=' + instalacion.idinstalacion);

            if (!favorita.error && favorita.data != undefined) {
              instalacion.favorita = favorita.data;
            }
            var distanciaTiempo = await calculateTravelDuration(instalacion);

            instalacion.distancia = distanciaTiempo[0];
            instalacion.tiempo = distanciaTiempo[1];

            const pistas = await apiPistas.post('/Instalacion/ObtenerPistasDisponibles?p_oid=' + instalacion.idinstalacion, filtroInstalacion.fecha);
            if (!pistas.error && pistas.data) {
              instalacion.pistasDisponibles = pistas.data;
            }
          }

          return instalaciones.data;
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
      console.error('Error al obtener las instalaciones:', error);
      return [];
    }
  };
  return obtenerInstalaciones;
};