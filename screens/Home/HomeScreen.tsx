import { View, Text, Dimensions, ImageBackground, TextInput } from "react-native";
import React, { useContext } from "react";
import MainContainer from "../../components/Container/MainContainer";
import DashboardCard from "../../components/Cards/DashboardCard";
import { MagnifyingGlassIcon } from "react-native-heroicons/solid";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";


interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useContext(LoginContext);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <Text className="text-base font-semibold mt-1">Hola, {`${user?.nombre} ${user?.apellidos}`}</Text>
          <TouchableOpacity onPress={()=>navigation.openDrawer()}>
          <ImageBackground source={require('../../assets/images/user.png')} style={{ height: 35, width: 35 }} imageStyle={{ borderRadius: 25 }}></ImageBackground>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row', borderColor:'#C6C6C6', borderWidth:1, borderRadius:8, paddingHorizontal: 10, paddingVertical: 8}}>
          <MagnifyingGlassIcon size={22} color={"#C6C6C6"} style={{marginRight:5, marginTop:4}} />
          <TextInput placeholder="Buscar" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;