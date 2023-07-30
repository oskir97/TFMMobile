import { View, Text, Pressable, ImageBackground, Linking, Image } from 'react-native'
import React, { useContext } from 'react'
import { I18nContext, useTranslation } from 'react-i18next';
import { Evento } from '../../../shared/models/Evento';
import { MaterialIcons } from '@expo/vector-icons';
import { Valoracion } from '../../../shared/models/Valoracion';

export interface EventoItemProps {
    item: Evento,
    navigation: any
}

const EventoItem: React.FC<EventoItemProps> = ({ item, navigation }) => {

    const { t } = useTranslation();
    const { i18n } = useContext(I18nContext);

    function openMaps() {
        if (item.obtenerInstalacion.latitud != null && item.obtenerInstalacion.longitud) {
            const url = `geo:${item.obtenerInstalacion.latitud},${item.obtenerInstalacion.longitud}`;
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

    function formatDate(date: Date |undefined): string {
        if (date) {
            return new Date(date).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es');
        }
        return '';
    }

    const renderImage = () => {
        if (item.imagen) {
          return (
            <Image
              source={{ uri: item.imagen }}
              style={{ height: 190, borderRadius: 6 }}
            //   resizeMode="cover"
            />
          );
        } else {
          return (
            <ImageBackground
                        imageStyle={{ borderRadius: 6 }}
                        style={{ height: 190 }}
                        source={require('../../../assets/images/eventodefault.jpg')}
                    >
                    </ImageBackground>
          );
        }
      };

    return (
        <View style={{ margin: 10 }}>
            <Pressable
                onPress={() =>
                    navigation.navigate("EventoScreen" as never, { item } as never)
                }

            >
                <View>
                    {
                        renderImage()
                    }
                </View>

                <View style={{ marginLeft: 10, flexShrink: 1, marginTop: 5 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', flexWrap: 'wrap' }} numberOfLines={2}>{item.nombre}</Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', flexWrap: 'wrap', color: "gray" }} numberOfLines={2}>{item.obtenerInstalacion.nombre}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
                        <MaterialIcons name="stars" size={24} color="orange" />
                        <Text style={{ marginLeft: 3, fontSize: 15, fontWeight: "400" }}>
                            {average(item?.obtenerValoracionesEvento)}
                        </Text>
                        <Text style={{ marginLeft: 3 }}>•</Text>
                        <Text style={{ marginLeft: 3, fontSize: 15, fontWeight: "400" }}>
                            {item?.obtenerInstalacion.tiempo}
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
                            {`${t("PRECIO")} ${item.precio}€`}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Text style={{ marginLeft: 6, fontSize: 12 }}>{`${t("DEL")} ${formatDate(item?.inicio)} ${t("AL")} ${formatDate(item?.fin)}`}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                    <Text style={{ marginLeft: 6, fontSize: 14, fontWeight: 'bold' }}>{item?.plazas - item?.obtenerInscripciones.length > 1?t("QUEDAN") : t("QUEDA")} {item.plazas - item.obtenerInscripciones.length} {item?.plazas - item?.obtenerInscripciones.length > 1?t("PLAZAS") : t("PLAZA")}!</Text>
                    </View>
                </View>
            </Pressable>
        </View>
    );
};

export default EventoItem;