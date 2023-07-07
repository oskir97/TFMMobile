import { View, Text} from "react-native";
import React, { useContext, useState } from "react";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "../../components/Menu/Menu";
import { useTranslation } from "react-i18next";
import ListItems from "../../components/ListItems/ListItems";

interface EventosScreenProps {
    navigation: any;
}

const EventosScreen: React.FC<EventosScreenProps> = ({ navigation }) => {
    const { filter } = useContext(LoginContext);
    const [textAssign, setTextAssign] = useState<string | undefined>(filter?.localidad);
    const { t } = useTranslation();

    return (
        <>
            <Menu showReturnWizard={true} showLang={true} text={textAssign} showusuario={true} userMenu={() => navigation.openDrawer()} />
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