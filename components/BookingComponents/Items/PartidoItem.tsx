import { View, Text, Pressable, ImageBackground, Linking, Image } from 'react-native'
import React, { useContext } from 'react'
import { I18nContext, useTranslation } from 'react-i18next';
import { Reserva } from '../../../shared/models/Reserva';
import { MaterialIcons } from '@expo/vector-icons';
import { Valoracion } from '../../../shared/models/Valoracion';

export interface PartidoItemProps {
    item: Reserva,
    navigation: any
}

const PartidoItem: React.FC<PartidoItemProps> = ({ item, navigation }) => {

    const { t } = useTranslation();
    const { i18n } = useContext(I18nContext);

    function openMaps() {
        if (item.obtenerPista.obtenerInstalaciones.latitud != null && item.obtenerPista.obtenerInstalaciones.longitud) {
            const url = `geo:${item.obtenerPista.obtenerInstalaciones.latitud},${item.obtenerPista.obtenerInstalaciones.longitud}`;
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

    function formatDate(date: Date | undefined): string {
        if (date) {
            return new Date(date).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es');
        }
        return '';
    }

    function formatTime(timeString: Date | null | undefined): string {
        if (timeString && timeString != null) {
            const date = new Date(timeString);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        } else {
            return "";
        }
    }

    function obtenerDosPrimerosDecimales(numero: number): number {
        const parteEntera = Math.floor(numero);
        const decimales = Number((numero % 1).toFixed(2));
        const numeroFinal = parteEntera + decimales;
        return numeroFinal;
    }

    const renderImage = () => {
        if (item.imagen) {
            return (
                <ImageBackground
                    imageStyle={{ borderRadius: 6 }}
                    style={{ height: 190 }}
                    source={{ uri: item.imagen }}
                >
                </ImageBackground>
            );
        } else {
            return (
                <ImageBackground
                    imageStyle={{ borderRadius: 6 }}
                    style={{ height: 190 }}
                    source={require('../../../assets/images/partidodefault.jpg')}
                >
                </ImageBackground>
            );
        }
    };

    const renderImageUser = () => {
        if (item.obtenerUsuarioCreador.imagen) {
          return (
            <Image
              source={{ uri: item.obtenerUsuarioCreador.imagen }}
              style={{ height: 35, width: 35, marginRight: 10, borderRadius: 25 }}
              resizeMode="cover"
            />
          );
        } else {
          return (
            <ImageBackground
              source={require('../../../assets/images/user.png')}
              style={{ height: 35, width: 35, marginRight: 10 }} imageStyle={{ borderRadius: 25 }}></ImageBackground>
          );
        }
      };


    return (
        <View style={{ margin: 10 }}>
            <Pressable
                onPress={() =>
                    navigation.navigate("PartidoScreen" as never, { item } as never)
                }

            >
                <View>
                   {
                    renderImage()
                   }
                </View>

                <View style={{ marginLeft: 10, flexShrink: 1, marginTop: 5 }}>
                    <View style={{flexDirection:'row'}}>{renderImageUser()}
                    <Text style={{ fontSize: 18, fontWeight: 'bold', flexWrap: 'wrap', marginTop:5 }} numberOfLines={2}>{`${item?.nombre} ${item?.apellidos}`}</Text></View>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', flexWrap: 'wrap', color: "gray" }} numberOfLines={2}>{item.obtenerPista.obtenerInstalaciones.nombre}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
                        <MaterialIcons name="stars" size={24} color="orange" />
                        <Text style={{ marginLeft: 3, fontSize: 15, fontWeight: "400" }}>
                            {average(item?.obtenerUsuarioCreador.obtenerValoracionesAUsuarioPartido)}
                        </Text>
                        <Text style={{ marginLeft: 3 }}>•</Text>
                        <Text style={{ marginLeft: 3, fontSize: 15, fontWeight: "400" }}>
                            {item?.obtenerPista.obtenerInstalaciones.tiempo}
                        </Text>
                        <Pressable
                            onPress={() =>
                                openMaps()
                            }
                            style={{ flexDirection: "row" }}
                        >
                            <MaterialIcons name="location-on" size={24} color="red" />
                        </Pressable>
                        <MaterialIcons name="payments" size={24} color="#00CC99" style={{ marginLeft: 10 }} />

                        <Text style={{ marginLeft: 4, fontSize: 12, fontWeight: "500" }}>
                            {`${t("PRECIO")} ${obtenerDosPrimerosDecimales(item.obtenerPista.precio)}€`}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Text style={{ marginLeft: 6, fontSize: 12 }}>{new Date(item.fecha).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')}</Text>
                        <Text style={{ marginLeft: 6, fontSize: 12 }}>{`${formatTime(item.obtenerHorarioReserva.inicio)} - ${formatTime(item.obtenerHorarioReserva.fin)}`}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Text style={{ marginLeft: 6, fontSize: 14, fontWeight: 'bold' }}>{item?.maxparticipantes - item?.obtenerInscripciones.length > 1 ? t("QUEDAN") : t("QUEDA")} {item.maxparticipantes - item.obtenerInscripciones.length} {item?.maxparticipantes - item?.obtenerInscripciones.length > 1 ? t("PLAZAS") : t("PLAZA")}!</Text>
                    </View>
                </View>
            </Pressable>
        </View>
    );
};

export default PartidoItem;