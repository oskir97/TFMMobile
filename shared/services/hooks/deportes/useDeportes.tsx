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

  useEffect(() => {
    AsyncStorage.getItem('token').then((value) => {
      if (value !== null) {
        const api = new Api<Deporte[]>(value);
        api.get('/Deporte/Listar').then((deportes) => {
          if (!deportes.error && deportes.data) {
            const updatedDeportes = deportes.data?.map((deporte) => {
              const nombreTraducido = deporte.traduccionesDeporte.find((tr) => tr.getIdiomaDeporte.cultura === i18n.language)?.nombre;
              return {
                ...deporte,
                nombre: nombreTraducido || deporte.nombre,
              };
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
  return { deportes, setDeportes };
};