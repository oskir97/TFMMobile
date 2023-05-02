import { useState } from 'react';

export type Provincia = {
    CCOM: string;
    CPRO: string;
    PRO: string;
};
export type Localidad = {
    CMUM: string;
    CPRO: string;
    CUN: string;
    DMUN50: string;
};

export const usePostalCodes = () => {
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<Provincia | undefined>(undefined);
    const [localidadSeleccionada, setLocalidadSeleccionada] = useState<Localidad |undefined>(undefined);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);
  
    const getProvincias = async () => {
      try {
        const response = await fetch(
          `https://apiv1.geoapi.es/provincias?type=JSON&key=28500d51ee87b64d569436cca5c9ddc10023d610932f0bc283f09fa4702cfc86&sandbox=0`
        );
  
        const data = await response.json();
        console.log(data.data);
        if (data.length > 0) {
            setProvincias(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const getLocalidades = async (CPRO:string) => {
        try {
          const response = await fetch(
            `https://apiv1.geoapi.es//municipios?CPRO=`+CPRO+`&type=JSON&key=28500d51ee87b64d569436cca5c9ddc10023d610932f0bc283f09fa4702cfc86&sandbox=0`
          );
    
          const data = await response.json();
          console.log(data.data);
          if (data.length > 0) {
             setLocalidades(data.data);
          }else{
            return null;
          }
        } catch (error) {
          console.error(error);
          return null;
        }
      };

    const cambiarProvinciaSeleccionada = (CPRO:string) => {
        setProvinciaSeleccionada(provincias.find(p => p.CPRO == CPRO));
        getLocalidades(CPRO);
      };
    
      const cambiarLocalidadSeleccionada = (CMUM:string) => {
        setLocalidadSeleccionada(localidades.find(l => l.CMUM == CMUM));
      };

    return {
        getProvincias,
        provincias,
        localidades,
        provinciaSeleccionada,
        localidadSeleccionada,
        getLocalidades,
        cambiarProvinciaSeleccionada,
        cambiarLocalidadSeleccionada
    };
}