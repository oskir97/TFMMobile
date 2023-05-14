import { useState, useCallback, useContext } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginContext } from './contexts/LoginContext'

import { Api, ApiResponse } from '../../api';

export default function useLogin() {

    // Creamos el contexto de nuestra aplicación
    const { loginFunction } = useContext(LoginContext);
    //Utilizamos el estado para poder saber si está o no cargando

    const api = new Api<any>();

    const logFunction =
        ({ email, password }: any) => {
            loginFunction(email, password);
        };

    return {
        logFunction
    };
}