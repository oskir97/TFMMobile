import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Valoracion } from '../../../models/Valoracion';
import { ValoracionDTO } from '../../../models/dtos/ValoracionDTO';

export const useValoraciones = () => {
    const { t } = useTranslation();

    const crearValoracion = async (valoracion: ValoracionDTO): Promise<Valoracion | undefined> => {
        if (valoracion) {
            try {
                const token = await AsyncStorage.getItem('token');

                if (token !== null) {
                    const apiValoraciones = new Api<ValoracionDTO, Valoracion>(token);
                    const valoraciones = await apiValoraciones.post('/Valoracion/Crear', valoracion);
                    if (!valoraciones.error && valoraciones.data) {
                        return valoraciones.data;
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
                console.error('Error al obtener las valoraciones:', error);
                return undefined;
            }
        } else {
            return undefined;
        }
    };


    return { crearValoracion };
};