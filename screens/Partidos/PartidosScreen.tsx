import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "../../components/Menu/Menu";
import { useTranslation } from "react-i18next";
import ListItems from "../../components/ListItems/ListItems";
import { UserGroupIcon } from "react-native-heroicons/solid";
import { Button } from "react-native-paper";

interface PartidosScreenProps {
    navigation: any;
}

const PartidosScreen: React.FC<PartidosScreenProps> = ({ navigation }) => {
    const { filter } = useContext(LoginContext);
    const [textAssign, setTextAssign] = useState<string | undefined>(filter?.localidad);
    const { t } = useTranslation();

    function handleCreateMatch() {

    }

    return (
        <>
            <Menu showReturnWizard={true} showLang={true} text={textAssign} showusuario={true} userMenu={() => navigation.openDrawer()} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', marginTop: -10, marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                    <Text style={{ flex: 1, fontSize: 20, fontWeight: 'bold', marginTop: 1 }}>{t("MIS_PARTIDOS")}</Text>
                    <Button
                        mode="contained"
                        onPress={handleCreateMatch}
                        icon={() => <UserGroupIcon size={22} color={'white'} />}
                        style={{ marginLeft: 'auto', borderColor:'#106F69', borderWidth:2, marginTop:-5 }}
                        contentStyle={{flexDirection: 'row-reverse'}}
                        buttonColor='#04D6C8'
                        rippleColor='#106F69'
                    >
                        {t("CREAR_PARTIDO")}
                    </Button>
                </View>
                <ListItems type="Partido" navigation={navigation}></ListItems>
            </SafeAreaView>
        </>
    );
};

export default PartidosScreen;