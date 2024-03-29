import React, { useState } from "react";
import { Text, View, StyleSheet, ImageBackground, BackHandler } from "react-native";
import { MD3Colors, ProgressBar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Menu from "../../../components/Menu/Menu";
import { useFocusEffect } from "@react-navigation/native";

interface CompletedPagoScreenProps {
    navigation: any;
}

const ProcessingPagoScreen: React.FC<CompletedPagoScreenProps> = ({ navigation }) => {
    React.useLayoutEffect(() => {
        navigation.setOptions({
            drawerLockMode: 'locked-closed',
        });
    }, [navigation]);

    const [error, setError] = useState(false);

    const { t } = useTranslation();

    const onSubmit = () => {

    };

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [navigation])
    );

    return (
        <>
            <Menu showReturnWizard={false} showLang={false} />
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <ProgressBar
                    style={styles.progressBar}
                    progress={0.75}
                    color={MD3Colors.primary60}
                />
                <View style={{ paddingHorizontal: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 30 }}>
                        <ImageBackground source={require('../../../assets/images/logo.png')} style={{ height: 150, width: 150 }} imageStyle={{ borderRadius: 10 }}></ImageBackground>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 25 }}>
                        <Text className="text-3xl text-[#106F69] font-semibold">{t("JUEGA")}</Text>
                        <Text className="text-3xl text-[#04D6C8] font-semibold">{` ${t("ENTRETENTE")}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: "center", alignContent:'center', justifyContent: 'center', paddingTop: 25 }}>
                        <Text style={{fontSize:22}} className="font-semibold">{t("REALIZANDO_PAGO")}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 10 }}>
                        <ImageBackground source={require('../../../assets/images/loading.gif')} style={{ height: 230, width: 230 }} imageStyle={{ borderRadius: 10 }}></ImageBackground>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    progressBar: {
        marginBottom: 16,
        height: 6,
        paddingHorizontal: 0,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default ProcessingPagoScreen;