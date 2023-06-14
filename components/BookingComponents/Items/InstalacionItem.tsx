import { View, FlatList, ScrollView, Text, Pressable, ImageBackground, Linking } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Instalacion } from '../../../shared/models/Instalacion';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Valoracion } from '../../../shared/models/Valoracion';
import { Pista } from '../../../shared/models/Pista';
import { useFavoritosInstalaciones } from '../../../shared/services/hooks/instalaciones/useFavoritosInstalaciones';

export interface InstalacionItemProps {
    item: Instalacion
}

const InstalacionItem: React.FC<InstalacionItemProps> = ({ item }) => {

    const { t } = useTranslation();
    const navigation = useNavigation();
    const {Asignarinstalacionfavoritos, Eliminarinstalacionfavoritos} = useFavoritosInstalaciones();
    const [favorita, setFavorita] = useState(item.favorita);

    function addFav() {
        var result: boolean = !favorita;

        if(result){
            Asignarinstalacionfavoritos(item.idinstalacion);
        }else{
            Eliminarinstalacionfavoritos(item.idinstalacion);
        }

        setFavorita(result);
    }

    function openMaps() {
        if (item.latitud != null && item.longitud) {
            const url = `geo:${item.latitud},${item.longitud}`;
            Linking.openURL(url).catch((err) => console.error('No se puede abrir la app de Mapas:', err));
        }
    }

    function average(valoraciones: Valoracion[]): number | null {
        if (valoraciones.length === 0) {
            return 0;
        }

        var array: number[] = [];

        valoraciones.forEach((valoracion) => {
            array.push(valoracion.estrellas);
        })

        const suma = array.reduce((total, num) => total + num, 0);
        const media = suma / array.length;

        return media;
    }

    function obtainMinorPistaPrice(pistas: Pista[]): Pista | undefined {
        return pistas.reduce((menorPrecio, pista) => {
            if (pista.precio < menorPrecio.precio) {
                return pista;
            } else {
                return menorPrecio;
            }
        });
    }

    function obtainAvailablePistas(): string {
        var npistas = item.pistasDisponibles.length;
        return item.pistasDisponibles ? (npistas > 1 ? `${npistas.toString()} ${t("PISTAS_DISPONIBLES")}` : `${npistas.toString()} ${t("PISTA_DISPONIBLE")}`) : `0 ${t("PISTAS_DISPONIBLES")}` 
    }

    useEffect(() => {

        setFavorita(item.favorita);
      }, [item.favorita]);

    return (
        <View style={{ margin: 10 }}>
            <Pressable
                onPress={() =>
                    navigation.navigate("Menu" as never, { item } as never)
                }
                style={{ flexDirection: "row" }}
            >
                <View>
                    <ImageBackground
                        imageStyle={{ borderRadius: 6 }}
                        style={{ aspectRatio: 5 / 6, height: 190 }}
                        source={require('../../../assets/images/instalaciondefault.jpg')}
                    >
                        <Pressable
                            onPress={() =>
                                addFav()
                            }
                            style={{ flexDirection: "row" }}
                        >
                            <AntDesign
                                style={{ position: "absolute", top: 10, right: 10 }}
                                name={favorita ? 'heart' : 'hearto'}
                                size={24}
                                color={favorita ? 'red' : 'white'}
                            />
                        </Pressable>
                    </ImageBackground>
                </View>

                <View style={{ marginLeft: 10, flexShrink: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', flexWrap: 'wrap' }} numberOfLines={2}>{item.nombre}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
                        <MaterialIcons name="stars" size={24} color="green" />
                        <Text style={{ marginLeft: 3, fontSize: 15, fontWeight: "400" }}>
                            {average(item.obtenerValoracionesInstalacion)}
                        </Text>
                        <Text style={{ marginLeft: 3 }}>•</Text>
                        <Text style={{ marginLeft: 3, fontSize: 15, fontWeight: "400" }}>
                            {item.tiempo}
                        </Text>
                        <Pressable
                            onPress={() =>
                                openMaps()
                            }
                            style={{ flexDirection: "row" }}
                        >
                            <MaterialIcons name="location-on" size={24} color="red" />
                        </Pressable>
                    </View>

                    <Text style={{ fontSize: 14, color: "gray", marginTop: 6 }}>{item.domicilio}</Text>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                        <MaterialIcons name="home-work" size={24} color="black" />
                        <Text style={{ marginLeft: 6, fontSize: 12 }}>{obtainAvailablePistas()}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <MaterialIcons name="payments" size={24} color="#04D6C8" />

                        <Text style={{ marginLeft: 4, fontSize: 12, fontWeight: "500" }}>
                            {`${t("DESDE")} ${obtainMinorPistaPrice(item.pistasDisponibles)?.precio.toString()}€`}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </View>
    );
};

export default InstalacionItem;