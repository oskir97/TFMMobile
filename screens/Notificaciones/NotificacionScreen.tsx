import { View, Text, BackHandler, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "../../components/Menu/Menu";
import { I18nContext, useTranslation } from "react-i18next";
import ListItems from "../../components/ListItems/ListItems";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useNotifications } from "../../shared/services/hooks/notifications/useNotifications"
import { Notificacion } from "../../shared/models/Notificacion";
import { Button } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome';

interface NotificacionScreenProps {
    navigation: any;
}

type ParamList = {
    Item: {
        notificacion?: Notificacion;
    };
};

const NotificacionScreen: React.FC<NotificacionScreenProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const { i18n } = useContext(I18nContext);
    const { obtenerNotificaciones } = useNotifications();
    const [notificaciones, setNotificaciones] = useState<Notificacion[] | undefined>(undefined);
    const { user } = useContext(LoginContext);
    const route = useRoute<RouteProp<ParamList, 'Item'>>();

    const goBack = () => {
        navigation.navigate("Notificaciones" as never)
    };

    function obtenerHorasYMinutos(fecha: Date): string {
        const horas = fecha.getHours();
        const minutos = fecha.getMinutes();

        const horasFormateadas = horas.toString().padStart(2, '0');
        const minutosFormateados = minutos.toString().padStart(2, '0');

        return `${horasFormateadas}:${minutosFormateados}`;
    }

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


    return (
        <>
            <Menu showReturnWizard={true} showLang={true} text={t("NOTIFICACIONES")} showusuario={true} userMenu={() => navigation.openDrawer()} functionGoBack={goBack} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ margin: 20 }}>
                    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#106F69" }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom:10 }}>{route.params.notificacion.asunto}</Text>
                        <Text style={{ fontSize: 18, marginBottom: 20 }}>{route.params.notificacion.descripcion}</Text>
                        <Text>{`${new Date(route.params.notificacion.fecha).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')} ${obtenerHorasYMinutos(new Date(route.params.notificacion.fecha))}`}</Text>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
};

export default NotificacionScreen;