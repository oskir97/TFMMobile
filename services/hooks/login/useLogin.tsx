import { useState, useCallback, useContext } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginContext } from './contexts/LoginContext'

import { Api, ApiResponse } from '../../api';
import { LoginContextType } from './contexts/LoginContextType';

export default function useLogin() {

    // Creamos el contexto de nuestra aplicación
    const { setLogin, setLoading } = useContext(LoginContext);
    //Utilizamos el estado para poder saber si está o no cargando

    const api = new Api<any>();

    const logFunction = 
        ({ email, password }: any) => {
            loginFunction(email, password);
        };

    async function loginFunction(email:string, password:string){
        setLoading(true);
        const response: ApiResponse<string> = await api.post('/Usuario/Login', { email, password });
        if (!response.error) {
            await AsyncStorage.setItem('token', response.data!);
            setLogin(response.data != null);
            setLoading(false);
        } else {
            alert("Email or Password incorrect");
            setLogin(false);
            setLoading(false);
            setLogin(false);
            alert(response.error);
        }
    }

    return {
        logFunction
    };
}