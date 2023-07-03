import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Evento } from '../../../models/Evento';
import { FilterReserva } from '../../../models/Filter';
import { Horario } from '../../../models/Horario';
import { Instalacion } from '../../../models/Instalacion';
import { Pista } from '../../../models/Pista';

export const useHorarios = () => {
    const { t } = useTranslation();

    const obtenerpistasinstalacion = async (instalacion: Instalacion, fecha:Date | undefined): Promise<Pista[]> => {
        if(fecha){
            try {
                const token = await AsyncStorage.getItem('token');
    
                if (token !== null) {
                    const api = new Api<any, Pista[]>(token);
                    const pistas = await api.get('/Pista/Obtenerpistasinstalacion?p_idinstalacion=' + instalacion.idinstalacion);
    
                    if (!pistas.error && pistas.data) {
                        var result = pistas.data.filter(p=>p.obtenerHorarios != null && p.obtenerHorarios.length > 0);
                        for(var pista of result){
                            if(pista.obtenerHorarios.length > 0){
                                const horariosDisponibles = await listarhorariosdisponibles(pista,fecha);
                                pista.obtenerHorariosDisponibles = horariosDisponibles;
                            }
                        }
                        return result;
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
                console.error('Error al obtener las intalaciones:', error);
                return [];
            }
        }else{
            return [];
        }
    };

    const listarhorariosdisponibles = async (pista: Pista, fecha: Date): Promise<Horario[]> => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (token !== null) {
                const api = new Api<any, Horario[]>(token);
                const horarios = await api.post('/Pista/Listarhorariosdisponibles?p_oid=' + pista.idpista, fecha);

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

    const obtenerPistaHorario = async (idhorario:number): Promise<Pista | undefined> => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (token !== null) {
                const api = new Api<any, Pista>(token);
                const horarios = await api.get('/Pista/ObtenerPistaHorario?idHorario=' + idhorario);

                if (!horarios.error && horarios.data) {
                    return horarios.data;
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
            console.error('Error al obtener los horarios disponibles:', error);
            return undefined;
        }
    };

    return { obtenerpistasinstalacion, obtenerPistaHorario };
};