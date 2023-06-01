import { useEffect, useState } from 'react';

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

export const useProvincias = () => {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<string>("");

  useEffect(() => {
    fetch("https://apiv1.geoapi.es/provincias?type=JSON&key=28500d51ee87b64d569436cca5c9ddc10023d610932f0bc283f09fa4702cfc86&sandbox=0")
      .then((response) => response.json())
      .then((data) => setProvincias(data.data));
  }, []);

  return {provincias, provinciaSeleccionada, setProvinciaSeleccionada};
};

export const useLocalidades = (CPRO:string) => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState<string>("");

  useEffect(() => {
    fetch("https://apiv1.geoapi.es/municipios?CPRO="+CPRO+"&type=JSON&key=28500d51ee87b64d569436cca5c9ddc10023d610932f0bc283f09fa4702cfc86&sandbox=0")
      .then((response) => response.json())
      .then((data) => setLocalidades(data.data));
  }, [CPRO]);
  return {localidades, localidadSeleccionada, setLocalidadSeleccionada};
};