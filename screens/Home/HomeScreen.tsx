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

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, localidad, setLocalidad, filter, setFilter, location } = useContext(LoginContext);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [type, setType] = useState<TypeReservation | undefined>(filter?.type);
  const [sort, setSort] = useState<Sort | undefined>(filter?.sort);
  const [filterText, setFilterText] = useState('');
  const [textAssign, setTextAssign] = useState<string | undefined>(filter?.localidad);
  const [filterReserva, setFilterReserva] = useState<FilterReserva>({filtro:filterText, localidad:filter?.localidad,latitud: location?.coords.latitude.toString(), longitud: location?.coords.longitude.toString(), fecha:filter?.fecha, deporte:filter?.deporte, orden: filter?.sort  });
  const { t } = useTranslation();

  const handleFilters = (filter: Filter) => {
    storageFilter(filter).then(() => {
      setFilter(filter);
      setType(filter.type);
      setSort(filter.sort);
      setFilterOpen(false);
      setFilterReserva({filtro:filterText, localidad:filter?.localidad,latitud: location?.coords.latitude.toString(), longitud: location?.coords.longitude.toString(), fecha:filter?.fecha, deporte:filter?.deporte, orden: filter?.sort  });
    });
  }

  async function storageFilter(filter: Filter) {

    if (filter.sort)
      await AsyncStorage.setItem('sort', filter.sort.toString());
    if (filter.type)
      await AsyncStorage.setItem('type', filter.type.toString());
  }

  useEffect(() => {

    const unsubscribe = navigation.addListener('focus', () => {
      setTextAssign(filter?.localidad);

      if (!filter) {
        navigation.navigate("Ubicación");
      } else if (!filter.localidad) {
        AsyncStorage.getItem("localidad").then((value: any) => { filter.localidad = value });
      }
      setFilterReserva({filtro:filterText, localidad:filter?.localidad,latitud: location?.coords.latitude.toString(), longitud: location?.coords.longitude.toString(), fecha:filter?.fecha, deporte:filter?.deporte, orden: filter?.sort  });
    });
    return unsubscribe;
  }, [navigation, filter?.localidad]);

  const handleFilterChange = (text:string) => {
    setFilterText(text);
  };

  const buscarText = t('BUSCAR') as string;

  return (
    <>
      <Menu showReturnWizard={true} showLang={true} text={textAssign} showusuario={true} userMenu={() => navigation.openDrawer()} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ paddingLeft: 20, paddingRight: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', flex: 0.91, borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginRight: 10 }}>
              <MagnifyingGlassIcon size={22} color={"#C6C6C6"} style={{ marginRight: 5, marginTop: 4 }} />
              <TextInput placeholder={buscarText} style={{ flex: 1 }} value={filterText} onChangeText={handleFilterChange} />
            </View>
            <TouchableOpacity style={{ flex: 0.09 }} onPress={() => setFilterOpen(true)}>
              <AdjustmentsHorizontalIcon size={30} color={"#04D6C8"} style={{ marginTop: 4 }} />
            </TouchableOpacity>
          </View>
          <BookList type={type} filter={filterReserva}/>
        </ScrollView>
        <CustomFilter visible={filterOpen} setVisible={setFilterOpen} transparent={true} animationType={"fade"} title={t("FILTROS")} filter={filter} onConfirm={handleFilters} onCancel={() => setFilterOpen(false)} />
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;