import { useEffect, useState } from 'react';
import { Deporte } from '../../../models/Deporte';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '../../api';

export const useDeportes = () => {
  const [deportes, setDeportes] = useState<Deporte[] | undefined>([]);

  useEffect(() => {
    AsyncStorage.getItem('token').then((value) => {
      if (value !== null) {
        const api = new Api<Deporte[]>(value);
        api.get('/Deporte/Listar').then((deportes) => {
          if (!deportes.error) {
            setDeportes(deportes.data);
        } else {
            alert("Email or Password incorrect");
            setDeportes([]);
            alert(deportes.error);
        }
        });
      }else{
        setDeportes([]);
      }
    });
  }, []);
  return {deportes};
};