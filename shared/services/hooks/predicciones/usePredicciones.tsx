import { Api } from '../../api';
import { useTranslation } from 'react-i18next';
import { Text, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import React, { useState, useEffect } from 'react';

let url = 'https://pro.openweathermap.org/data/2.5/forecast';


export const usePredicciones = () => {
    const { t } = useTranslation();
    var tipo: string;

    const obtenerDatosDeAPI = async (latitud: any, longitud: any): Promise<any> => {
        const api = new Api<any, any>(null, url);
        const predicciones = await api.get("/hourly?lat=" + latitud + "&lon=" + longitud + "&appid=01e25a8a4c46688c674584ec2bd3df19");
        return predicciones.data;
    }

    function obtenerWeatherMainPorFecha(data: any, fecha: Date) {
        const listKeys = Object.keys(data.list);

        for (const key of listKeys) {
            const item = data.list[key];
            const fechaItem = new Date(item.dt_txt);

            if (fechaItem.getTime() === fecha.getTime()) {
                tipo = item.weather[0].main;
                return;
            }
        }
    }

    function obtainText(): string {
        switch (tipo) {
            case 'Clouds':
                return t("POSIBILIDAD_NUBES");
            case 'Clear':
                return t("DESPEJADO");
            case 'Rain':
                return t("POSIBILIDAD_LLUVIAS");
            default:
                return "";
        }
    }

    function obtainIcon(): JSX.Element {
        switch (tipo) {
            case 'Clouds':
                return <FontAwesome5 name="cloud" size={21} color="#00E6F8" style={{ marginLeft: 5, color: '#00E6F8' }} />;
            case 'Clear':
                return <FontAwesome name="sun-o" size={21} color="orange" style={{ marginLeft: 5, color: 'orange' }} />;
            case 'Rain':
                return <FontAwesome5 name="cloud-rain" size={21} color="#007DFF" style={{ marginLeft: 5, color: '#0047AB' }} />;
            default:
                return null;
        }
    }

    const obtenerPrediccion = async (fecha: Date, latitud: any, longitud: any): Promise<JSX.Element> => {
        try {
            const data = await obtenerDatosDeAPI(latitud, longitud);
            obtenerWeatherMainPorFecha(data, fecha);

            return (
                <>
                    {
                        tipo &&
                        <View style={{ marginBottom: 5, marginLeft: 5, flexDirection: 'row' }}>
                            <Text style={{ color: 'black', fontWeight: 'bold' }}>
                                {obtainText()}
                            </Text>
                            {obtainIcon()}
                        </View>
                    }
                </>
            );
        } catch (error) {
            console.error('Error al obtener la prediccion:', error);
            return (
                <>
                </>
            );
        }
    };
    return { obtenerPrediccion };
};