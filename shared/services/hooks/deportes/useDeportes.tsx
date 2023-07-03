import { useContext, useEffect, useState } from 'react';
import { Deporte } from '../../../models/Deporte';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { I18nContext, useTranslation } from 'react-i18next';

export const useDeportes = () => {
  const [deportes, setDeportes] = useState<Deporte[] | undefined>([]);
  const { t } = useTranslation();
  const { i18n } = useContext(I18nContext);

  const obtenerDeporte = async (iddeporte: number | undefined): Promise<Deporte | undefined> => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (iddeporte && token !== null) {
        const api = new Api<any, Deporte[]>(token);
        const deportes = await api.get('/Deporte/Listar');
        
        if (!deportes.error && deportes.data) {
          return deportes.data.find(d => d.iddeporte == iddeporte);
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
      console.error('Error al obtener las reservas:', error);
      return undefined;
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('token').then((value) => {
      if (value !== null) {
        const api = new Api<null, Deporte[]>(value);
        api.get('/Deporte/Listar').then((deportes) => {
          if (!deportes.error && deportes.data) {
            const updatedDeportes: Deporte[] = [];
            deportes.data?.forEach((deporte) => {
              const nombreTraducido = deporte.traduccionesDeporte.find((tr) => tr.getIdiomaDeporte.cultura === i18n.language)?.nombre;
              deporte.nombre = nombreTraducido || deporte.nombre;
              updatedDeportes.push(deporte);
            });
            setDeportes(updatedDeportes);
          } else {
            const errormessage = t("ERROR");
            const erroraplicacion = t("ERROR_APLICACION");
            Alert.alert(errormessage, erroraplicacion);
            setDeportes([]);
            alert(deportes.error);
          }
        });
      } else {
        setDeportes([]);
      }
    });
  }, []);
  return { deportes, setDeportes, obtenerDeporte };
};