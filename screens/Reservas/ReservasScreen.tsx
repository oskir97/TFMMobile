import { View, Text, Dimensions, ImageBackground, Pressable, ScrollView, TouchableOpacity, TextInput } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from "react-native-heroicons/solid";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomFilter from "../../components/Filter/CustomFilter";
import Menu from "../../components/Menu/Menu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import { Filter, FilterReserva, Sort, TypeReservation } from "../../shared/models/Filter";
import BookList from "../../components/BookingComponents/BookList";
import ListItems from "../../components/ListItems/ListItems";

interface ReservasScreenProps {
    navigation: any;
}

const ReservasScreen: React.FC<ReservasScreenProps> = ({ navigation }) => {
    const { filter } = useContext(LoginContext);
    const [textAssign, setTextAssign] = useState<string | undefined>(filter?.localidad);
    const { t } = useTranslation();

    return (
        <>
            <Menu showReturnWizard={true} showLang={true} text={textAssign} showusuario={true} userMenu={() => navigation.openDrawer()} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', marginTop: -10, marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                    <Text style={{ fontSize: 20 }} className="font-semibold mt-1">{t("MIS_RESERVAS")}</Text>
                </View>
                <ListItems type="Pista" navigation={navigation}></ListItems>
            </SafeAreaView>
        </>
    );
};

export default ReservasScreen;