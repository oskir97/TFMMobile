import { View, Text, Dimensions, ImageBackground, Pressable, ScrollView, TouchableOpacity, TextInput } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MainContainer from "../../components/Container/MainContainer";
import DashboardCard from "../../components/Cards/DashboardCard";
import { MagnifyingGlassIcon, PencilSquareIcon } from "react-native-heroicons/solid";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomFilter, { FilterData } from "../../components/Filter/CustomFilter";
import CustomInputModalMaps from "../../components/Modals/CustomInputModalMaps";
import Menu from "../../components/Menu/Menu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, localidad, setLocalidad, filter } = useContext(LoginContext);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [locationOpen, setLocationOpen] = useState<boolean>(false);
  const [filterHome, setFilterHome] = useState<FilterData>({ fecha: new Date(), deporte: undefined, sort: undefined });
  const { t } = useTranslation();

  const handleFilters = (filter: FilterData) => {
    setFilterHome(filter);
    setFilterOpen(false);
  }
  const handleLocation = (localidad: string) => {
    setLocalidad(localidad);
    setLocationOpen(false);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Verificar si no hay un filtro
      if (!filter) {
        // Navegar a la pantalla "Ubicación"
        navigation.navigate("Ubicación");
      }
    });
    return unsubscribe;
  }, [navigation]);

  const buscarText = t('BUSCAR') as string;

  return (
    <>
      <Menu showReturnWizard={true} showLang={true} text={`${filter?.localidad}`} showusuario={true} userMenu={() => navigation.openDrawer()} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ paddingLeft: 20, paddingRight: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', flex: 0.89, borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginRight: 10 }}>
              <MagnifyingGlassIcon size={22} color={"#C6C6C6"} style={{ marginRight: 5, marginTop: 4 }} />
              <TextInput placeholder={buscarText} style={{ flex: 1 }} />
            </View>
            <TouchableOpacity style={{ flex: 0.11 }} onPress={() => setFilterOpen(true)}>
              <Ionicons name="filter" size={30} color={'#04D6C8'} style={{ marginLeft: 6, marginTop: 4 }} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text className="text-base font-semibold mt-1">{t("PISTAS_DISPONIBLES")}</Text>
          </View>

        </ScrollView>
        <CustomFilter visible={filterOpen} setVisible={setFilterOpen} transparent={true} animationType={"fade"} title={t("FILTRO_PISTAS")} filter={filterHome} onConfirm={handleFilters} onCancel={() => setFilterOpen(false)} />
        <CustomInputModalMaps login={false} visible={locationOpen} setVisible={setLocationOpen} animationType={"fade"} title={t("MODIFICAR_UBICACION")} lastlocation={localidad} onConfirm={handleLocation} onCancel={() => setLocationOpen(false)} />
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;