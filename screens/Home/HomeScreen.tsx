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
  const [type, setType] = useState<TypeReservation | undefined>(filter?.type?filter?.type:"Pista");
  const [sort, setSort] = useState<Sort | undefined>(filter?.sort?filter?.sort : "Distancia");
  const [nivel, setNivel] = useState<string | undefined>(filter?.level?filter?.level : undefined);
  const [filterText, setFilterText] = useState('');
  const [textAssign, setTextAssign] = useState<string | undefined>(filter?.localidad);
  const [filterReserva, setFilterReserva] = useState<FilterReserva>({filtro:filterText, localidad:filter?.localidad,latitud: location?.coords.latitude.toString(), longitud: location?.coords.longitude.toString(), fecha:filter && filter.fecha? sumarundia(filter.fecha) : new Date(), deporte:filter?.deporte, orden: filter?.sort, nivel:filter?.level  });
  const [loadingFilters, setLoadingFilters] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleFilters = (filter: Filter) => {
    storageFilter(filter).then(() => {
      setLoadingFilters(true);
      setFilter(filter);
      setType(filter.type);
      setSort(filter.sort);
      setFilterOpen(false);
      setNivel(filter.level);
      setFilterReserva({filtro:filterText, localidad:filter?.localidad,latitud: location?.coords.latitude.toString(), longitud: location?.coords.longitude.toString(), fecha:filter && filter.fecha? sumarundia(filter.fecha) : new Date(), deporte:filter?.deporte, orden: filter?.sort, nivel:filter?.level  });
    });
  }

  function sumarundia(fecha: Date) : Date {
    var date = new Date(fecha);
    date.setDate(date.getDate() + 1);

    return date;
  }

  async function storageFilter(filter: Filter) {
    if (filter.sort)
      await AsyncStorage.setItem('sort', filter.sort.toString());
    if (filter.type)
      await AsyncStorage.setItem('type', filter.type.toString());
      if (filter.level)
      await AsyncStorage.setItem('level', filter.level.toString());
  }

  useEffect(() => {

    const unsubscribe = navigation.addListener('focus', () => {
      setTextAssign(filter?.localidad);

      if (!filter || (filter.fecha && filter.fecha.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))) {
        navigation.navigate("Ubicación");
      } else {
        if (!filter.localidad) {
          AsyncStorage.getItem("localidad").then((value: any) => { filter.localidad = value });
        }
        if(!filter.level){
          AsyncStorage.getItem("level").then((value: any) => { filter.level = value });
        }
      }
      setLoadingFilters(false);
      setFilterReserva({filtro:filterText, localidad:filter?.localidad,latitud: location?.coords.latitude.toString(), longitud: location?.coords.longitude.toString(), fecha:filter && filter.fecha? sumarundia(filter.fecha) : new Date(), deporte:filter?.deporte, orden: filter?.sort, nivel:filter?.level  });
    });
    return unsubscribe;
  }, [navigation, filter?.localidad, location]);

  const handleFilterChange = (text:string) => {
    setLoadingFilters(true);
    setFilterText(text);
    setFilterReserva({filtro:text, localidad:filter?.localidad,latitud: location?.coords.latitude.toString(), longitud: location?.coords.longitude.toString(), fecha:filter && filter.fecha? sumarundia(filter.fecha) : new Date(), deporte:filter?.deporte, orden: filter?.sort, nivel:filter?.level  });
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
              <AdjustmentsHorizontalIcon size={30} color={"#04D6C8"} style={{ marginTop: 8 }} />
            </TouchableOpacity>
          </View>
          <BookList type={type} filter={filterReserva} navigation={navigation} loading={loadingFilters}/>
        </ScrollView>
        <CustomFilter visible={filterOpen} setVisible={setFilterOpen} transparent={true} animationType={"fade"} title={t("FILTROS")} filter={filter} onConfirm={handleFilters} onCancel={() => setFilterOpen(false)} />
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;