import { View, Text, Dimensions, ImageBackground, TextInput, Pressable } from "react-native";
import React, { useContext, useState } from "react";
import MainContainer from "../../components/Container/MainContainer";
import DashboardCard from "../../components/Cards/DashboardCard";
import { MagnifyingGlassIcon } from "react-native-heroicons/solid";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import SportTypes from "../../components/SportTypes/SportTypes";
import { Deporte } from "../../shared/models/Deporte";
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomFilter, { FilterData } from "../../components/Filter/CustomFilter";


interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, location, localidad } = useContext(LoginContext);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const handleFilters = (filter: FilterData) => {
    console.log(filter.localidad);
    console.log(filter.fecha);
    console.log(filter.deporte);
    console.log(filter.sort);
    setFilterOpen(false);
  }
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
          <View style={{ flexDirection: 'row',flex: 0.97, borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 }}>
            <MagnifyingGlassIcon size={22} color={"#C6C6C6"} style={{ marginRight: 5, marginTop: 4 }} />
            <TextInput placeholder="Buscar" style={{ flex: 1 }} />
          </View>
          <TouchableOpacity style={{ flex: 0.03 }} onPress={() => setFilterOpen(true)}>
            <Ionicons name="filter" size={30} color={'#aa18ea'} style={{ marginLeft: 5, marginTop: 4 }} />
          </TouchableOpacity>
        </View>
        
      </ScrollView>
      <CustomFilter visible={filterOpen} setVisible={setFilterOpen} transparent={true} animationType={"fade"} title="Filtro de pistas" onConfirm={handleFilters} onCancel={() => setFilterOpen(false)} localidad={localidad}/>
    </SafeAreaView>
  );
};

export default HomeScreen;