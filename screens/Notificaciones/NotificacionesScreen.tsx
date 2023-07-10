import { View, Text, BackHandler, FlatList, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "../../components/Menu/Menu";
import { I18nContext, useTranslation } from "react-i18next";
import ListItems from "../../components/ListItems/ListItems";
import { useFocusEffect } from "@react-navigation/native";
import { useNotifications } from "../../shared/services/hooks/notifications/useNotifications"
import { Notificacion } from "../../shared/models/Notificacion";
import { Button } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome';
import { NotificacionesContext } from "../../shared/services/hooks/notifications/contexts/NotificationContext";

interface NotificacionesScreenProps {
    navigation: any;
}

const NotificacionesScreen: React.FC<NotificacionesScreenProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const { i18n } = useContext(I18nContext);
    const { obtenerNotificaciones, marcarleida } = useNotifications();
    const { user } = useContext(LoginContext);
    const { notificaciones, setNotificaciones } = useContext(NotificacionesContext);

    const goBack = () => {
        navigation.navigate("Inicio" as never)
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            obtenerNotificaciones(user.idusuario).then((notificaciones) => setNotificaciones(notificaciones))
        });
        return unsubscribe;
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                goBack();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [navigation])
    );

    const verNotif = async (notificacion: Notificacion) => {
        marcarleida(notificacion.idnotificacion).then((marcada) => {
            if (marcada) {
                obtenerNotificaciones(user.idusuario).then((notificaciones) => setNotificaciones(notificaciones));
                //hacer historias
                navigation.navigate("Notificacion" as never, { notificacion: notificacion } as never)
            }
        });
    }

    const renderNotificacion = ({ item }: { item: Notificacion }) => (
        <View style={{ padding: 20, borderBottomWidth: 1, borderColor: "#106F69", backgroundColor: item.leida ? "white" : "#04D6C850", paddingBottom: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.asunto}</Text>
            <Text style={{ fontSize: 16, marginBottom: 10 }} numberOfLines={1} ellipsizeMode="tail">{item.descripcion}</Text>
            <Text>{`${new Date(item.fecha).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')} ${obtenerHorasYMinutos(new Date(item.fecha))}`}</Text>
            <Button buttonColor="white" style={{ marginLeft: 'auto', borderColor: 'green', borderWidth: 2, marginTop: -10 }} mode="text" textColor="green" icon={() => <Icon name="hand-o-down" size={15} color="green" />} contentStyle={{ flexDirection: 'row-reverse' }} onPress={() => { verNotif(item) }}>
                <Text style={{ fontSize: 12 }}>
                    {t("VER_NOTIFICACION")}
                </Text>
            </Button>
        </View>
    );

    function obtenerHorasYMinutos(fecha: Date): string {
        const horas = fecha.getHours();
        const minutos = fecha.getMinutes();

        const horasFormateadas = horas.toString().padStart(2, '0');
        const minutosFormateados = minutos.toString().padStart(2, '0');

        return `${horasFormateadas}:${minutosFormateados}`;
    }

    return (
        <>
            <Menu showReturnWizard={true} showLang={true} text={t("RESERVAR")} showusuario={true} userMenu={() => navigation.openDrawer()} functionGoBack={goBack} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', marginBottom: 20, marginLeft: 20 }}>
                    <Text style={{ fontSize: 20 }} className="font-semibold mt-1">{t("NOTIFICACIONES")}</Text>
                </View>
                <View>
                    <View>
                        <FlatList
                            style={{ height: Dimensions.get('window').height * 0.80 }}
                            data={notificaciones?.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())}
                            renderItem={renderNotificacion}
                            keyExtractor={(item) => item.idnotificacion.toString()}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
};

export default NotificacionesScreen;