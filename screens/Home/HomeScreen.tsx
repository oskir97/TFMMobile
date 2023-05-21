import { View, Text, Dimensions, ImageBackground, TextInput, Pressable, ScrollView, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MainContainer from "../../components/Container/MainContainer";
import DashboardCard from "../../components/Cards/DashboardCard";
import { MagnifyingGlassIcon, PencilSquareIcon } from "react-native-heroicons/solid";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomFilter, { FilterData } from "../../components/Filter/CustomFilter";
import CustomInputModalMaps from "../../components/Modals/CustomInputModalMaps";


interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, localidad, setLocalidad } = useContext(LoginContext);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [locationOpen, setLocationOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterData>({ fecha: new Date(), deporte: undefined, sort: undefined });

  const handleFilters = (filter: FilterData) => {
    console.log(filter);
    setFilter(filter);
    setFilterOpen(false);
  }
  const handleLocation = (localidad: string) => {
    console.log(localidad);
    setLocalidad(localidad);
    setLocationOpen(false);
  }

  useEffect(() => {
    if(localidad == undefined){
      setLocationOpen(true);
    }
  }, [localidad]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <Text className="text-base font-semibold mt-1">Hola, {`${user?.nombre} ${user?.apellidos}`}</Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <ImageBackground source={require('../../assets/images/user.png')} style={{ height: 35, width: 35 }} imageStyle={{ borderRadius: 25 }}></ImageBackground>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', flex: 0.89, borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 }}>
            <MagnifyingGlassIcon size={22} color={"#C6C6C6"} style={{ marginRight: 5, marginTop: 4 }} />
            <TextInput placeholder="Buscar" style={{ flex: 1 }} />
          </View>
          <TouchableOpacity style={{ flex: 0.11 }} onPress={() => setFilterOpen(true)}>
            <Ionicons name="filter" size={30} color={'#04D6C8'} style={{ marginLeft: 6, marginTop: 4 }} />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row'}}>
        <Text className="text-base font-semibold mt-1">Pistas disponibles</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 0.90 }}>
            <Text className="font-semibold mt-1" style={{ fontSize: 14 }}>{localidad}</Text>
          </View>
          <View style={{ flex: 0.10 }}>
            <TouchableOpacity style={{ marginLeft: 5, marginTop: 10 }} onPress={() => setLocationOpen(true)}>
              <PencilSquareIcon size={30} color={"#04D6C8"} style={{ marginRight: 5 }} />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
      <CustomFilter visible={filterOpen} setVisible={setFilterOpen} transparent={true} animationType={"fade"} title="Filtro de pistas" filter={filter} onConfirm={handleFilters} onCancel={() => setFilterOpen(false)} />
      <CustomInputModalMaps login={false} visible={locationOpen} setVisible={setLocationOpen} animationType={"fade"} title="Modificar ubicación de las pistas" lastlocation={localidad} onConfirm={handleLocation} onCancel={() => setLocationOpen(false)} />
    </SafeAreaView>
  );
};

export default HomeScreen;