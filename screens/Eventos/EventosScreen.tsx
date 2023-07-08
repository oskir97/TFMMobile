import { View, Text, BackHandler} from "react-native";
import React, { useContext, useState } from "react";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "../../components/Menu/Menu";
import { useTranslation } from "react-i18next";
import ListItems from "../../components/ListItems/ListItems";
import { useFocusEffect } from "@react-navigation/native";

interface EventosScreenProps {
    navigation: any;
}

const EventosScreen: React.FC<EventosScreenProps> = ({ navigation }) => {
    const { t } = useTranslation();

    const goBack = () => {
        navigation.navigate("Inicio" as never)
    };

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

    function handleCreateMatch() {

    }

    return (
        <>
            <Menu showReturnWizard={true} showLang={true} text={t("RESERVAR")} showusuario={true} userMenu={() => navigation.openDrawer()} functionGoBack={goBack} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', marginTop: -10, marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                    <Text style={{ fontSize: 20 }} className="font-semibold mt-1">{t("MIS_EVENTOS")}</Text>
                </View>
                <ListItems type="Evento" navigation={navigation}></ListItems>
            </SafeAreaView>
        </>
    );
};

export default EventosScreen;