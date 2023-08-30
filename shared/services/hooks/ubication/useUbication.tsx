import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Alert, PermissionsAndroid } from "react-native";

export const useUbication = () => {
    const [location, setLocation] = useState<Location.LocationObject>();
    const [localidad, setLocalidad] = useState<string | undefined>();

    const getLocation = async (): Promise<string | undefined> => {
        try {
            if (location == undefined || location == null) {
                let { status } = await Location.requestForegroundPermissionsAsync();
                // console.log(status);
                if (status === 'granted') {
                    await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest }).then((location) => obtenerLocalidad(location)).then((localidad) => {
                        // console.log(localidad);
                        setLocalidad(localidad);
                        return localidad;
                    });
                } else {
                    return undefined;
                }
            } else {
                if (localidad == undefined || localidad == null) {
                    await obtenerLocalidad(location).then((localidad) => {
                        setLocalidad(localidad);
                        return localidad;
                    });
                } else {
                    return localidad;
                }
            }
        } catch {
            return undefined;
        }
    }

    const obtenerLocalidad = async (location: Location.LocationObject): Promise<string | undefined> => {
        try {
            if (location != null && location != undefined) {
                setLocation(location);
                const apiKey = 'AIzaSyDk2FMHqx4YxsS-LkVt4wtzhHM4iM1_gxU';
                const lat = location.coords.latitude;
                const lon = location.coords.longitude;
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

                const response = await fetch(url);
                const data = await response.json();

                const results = data.results;

                if (results.length > 0) {
                    const addressComponents = results[0].address_components;
                    const ciudadComponent = addressComponents.find((component: any) =>
                        component.types.includes('locality')
                    );
                    const ciudad = ciudadComponent ? ciudadComponent.long_name : null;
                    return ciudad;
                } else {
                    return undefined;
                }
            } else {
                setLocation(undefined);
                return undefined;
            }
        } catch {
            return undefined;
        }
    };

    return { localidad, getLocation };
};