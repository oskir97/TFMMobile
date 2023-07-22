import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
  Share
} from "react-native";
import { Button } from "react-native-paper";
import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useFocusEffect, useLinkTo, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Instalacion } from "../../shared/models/Instalacion";
import { Valoracion } from "../../shared/models/Valoracion";
import Menu from "../../components/Menu/Menu";
import MapView, { Marker } from "react-native-maps";
import { useTranslation } from "react-i18next";
import CustomButton from "../../components/Buttons/CustomButton";
import { useFavoritosInstalaciones } from "../../shared/services/hooks/instalaciones/useFavoritosInstalaciones";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Pista } from "../../shared/models/Pista";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";
import * as expoLinking from 'expo-linking';

type ParamList = {
  Item: {
    item: Instalacion;
  };
};

interface InstalacionScreenProps {
  navigation: any;
}

const InstalacionScreen: React.FC<InstalacionScreenProps> = ({ navigation }) => {
  const { location } = useContext(LoginContext);
  const route = useRoute<RouteProp<ParamList, 'Item'>>();
  const [instalacion, setInstalacion] = useState<Instalacion | undefined>(route.params.item);
  const { t } = useTranslation();
  const mapRef = useRef<MapView>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: route.params.item.latitud,
    longitude: route.params.item.longitud,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const { Asignarinstalacionfavoritos, Eliminarinstalacionfavoritos } = useFavoritosInstalaciones();
  const [favorita, setFavorita] = useState(route.params.item.favorita);

  const callInstalacion = () => {
    Linking.openURL(`tel:${route.params.item.telefono}`);
  };

  const callInstalacionAlternativo = () => {
    Linking.openURL(`tel:${route.params.item.telefonoalternativo}`);
  };

  const emailInstalacion = () => {
    const mailtoUrl = `mailto:${route.params.item?.email && route.params.item?.email != "" ? route.params.item?.email : route.params.item?.obtenerEntidadInstalacion.email}?subject=${""}&body=${encodeURIComponent("")}`;
    Linking.openURL(mailtoUrl);
  };
  const { width } = Dimensions.get('window');

  const seeReviews = () => {
    navigation.navigate("ReviewsScreen" as never, { instalacion: instalacion } as never)
  };

  const goBack = () => {
    navigation.navigate("Inicio" as never, { loadingItems: true, instalacion: instalacion } as never)
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  function average(valoraciones: Valoracion[] | undefined): number | null {
    if (valoraciones) {
      if (valoraciones.length === 0) {
        return 0;
      }

      var array: number[] = [];

      valoraciones.forEach((valoracion) => {
        array.push(valoracion.estrellas);
      })

      const suma = array.reduce((total, num) => total + num, 0);
      const media = suma / array.length;

      return media;
    } else
      return 0;
  }

  function addFav() {
    var result: boolean = !favorita;
    if (instalacion) {
      instalacion.favorita = result;
      setInstalacion(instalacion);
    }

    if (result) {
      Asignarinstalacionfavoritos(route.params.item.idinstalacion);
    } else {
      Eliminarinstalacionfavoritos(route.params.item.idinstalacion);
    }

    setFavorita(result);
  }

  function obtainMinorPistaPrice(pistas: Pista[]): Pista | undefined {
    if (pistas) {
      return pistas.reduce((menorPrecio, pista) => {
        if (pista.precio < menorPrecio.precio) {
          return pista;
        } else {
          return menorPrecio;
        }
      });
    }
  }

  function booking() {
    navigation.navigate("Horario" as never, { instalacion: instalacion, previousPage: "Horario" } as never)
  }

  useEffect(() => {
    const fetchMenu = () => {
      setInstalacion(route.params.item);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      const newMapRegion = {
        latitude: route.params.item.latitud,
        longitude: route.params.item.longitud,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setMapRegion(newMapRegion);
      setFavorita(route.params.item.favorita);

      mapRef.current?.fitToSuppliedMarkers(["marker"]);
    });
    fetchMenu();

  }, [route.params.item]);

  const compartirURL = async () => {
    const deepLink = generateDeepLink();
    const url = `whatsapp://send?text=${encodeURIComponent(deepLink)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  const generateDeepLink = () => {
    const deepLink = expoLinking.createURL('/instalacion?id=' + instalacion.idinstalacion);
    return deepLink;
  };

  return (
    <>
      <Menu showReturnWizard={true} showLang={true} text={t("INSTALACIONES")} showusuario={true} userMenu={() => navigation.openDrawer()} functionGoBack={goBack} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View
            style={{

            }}
          >

            <View
              style={{
                marginHorizontal: 20,
                marginVertical: 5,
                padding: 10,
                borderRadius: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ width: width * 0.7, fontSize: 19, fontWeight: "bold" }}>
                  {instalacion?.nombre}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* <Pressable
                    onPress={() =>
                      compartirURL()
                    }
                  >
                    <AntDesign
                      style={{ marginHorizontal: 7 }}
                      name="sharealt"
                      size={24}
                      color="black"
                    />
                  </Pressable> */}
                  <Pressable
                    onPress={() =>
                      addFav()
                    }
                    style={{ flexDirection: "row" }}
                  >
                    <AntDesign
                      name={favorita ? 'heart' : 'hearto'}
                      size={24}
                      color={favorita ? 'red' : 'black'}
                    />
                  </Pressable>

                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: 'flex-start',
                  marginTop: 0,
                }}
              >
                <Text style={{ marginLeft: 3, fontSize: 14, color: 'grey' }}>{instalacion?.obtenerEntidadInstalacion.nombre}</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 7,
                  minHeight: 30
                }}
              >
                <MaterialIcons name="stars" size={24} color="orange" />
                <Text style={{ marginLeft: 3, fontSize: 17, fontWeight: "400" }}>
                  {average(instalacion?.obtenerValoracionesInstalacion)}
                </Text>
                <Text style={{ marginLeft: 3, fontSize: 17, fontWeight: "400", marginRight: 10 }}>{t("SOBRE")} 5</Text>
                {instalacion?.obtenerValoracionesInstalacion && instalacion?.obtenerValoracionesInstalacion.length > 0 && (
                  <Button buttonColor="transparent" style={{ marginLeft: 'auto', borderColor: 'green', borderWidth: 2 }} mode="text" textColor="green" icon={() => <Icon name="hand-o-down" size={15} color="green" />} contentStyle={{ flexDirection: 'row-reverse' }} onPress={seeReviews}>
                    <Text style={{ fontSize: 12 }}>
                      {t("VER_RESENAS")}
                    </Text>
                  </Button>
                )}
              </View>

              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity onPress={callInstalacion} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="phone" size={24} color="green" />
                  <Text style={{ marginLeft: 3, fontSize: 14, fontWeight: "400" }} numberOfLines={1} ellipsizeMode="tail">
                    {instalacion?.telefono}
                  </Text>
                </TouchableOpacity>
                {instalacion?.telefonoalternativo && (
                  <TouchableOpacity onPress={callInstalacionAlternativo} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <MaterialIcons name="phone" size={24} color="green" />
                    <Text style={{ marginLeft: 3, fontSize: 14, fontWeight: "400" }} numberOfLines={1} ellipsizeMode="tail">
                      {instalacion?.telefonoalternativo}
                    </Text>
                  </TouchableOpacity>
                )}</View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 7,
                }}
              >
                <TouchableOpacity onPress={emailInstalacion} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="email" size={24} color="red" />
                  <Text style={{ marginLeft: 3, fontSize: 14, fontWeight: "400" }} numberOfLines={1} ellipsizeMode="tail">
                    {instalacion?.email && instalacion?.email != "" ? instalacion?.email : instalacion?.obtenerEntidadInstalacion.email}
                  </Text>
                </TouchableOpacity>
              </View>



              <Text
                style={{
                  borderColor: "gray",
                  borderWidth: 0.6,
                  height: 1,
                  marginTop: 12,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                  width: width * 0.6
                }}
              >
                {location && (<>
                  <FontAwesome5 name="walking" size={24} color="brown" />
                  <Text style={{ marginLeft: 7, color: "gray", fontSize: 13 }}>
                    {instalacion?.distancia} ({instalacion?.tiempo}) |
                  </Text>
                </>
                )}
                <Text style={{ marginLeft: 7, color: "gray", fontSize: 13, fontWeight: 'bold', marginRight: 5 }} numberOfLines={1} ellipsizeMode="tail">
                  {instalacion?.domicilio}
                </Text>
              </View>
            </View>
          </View>
          {instalacion && instalacion.latitud && instalacion.longitud &&
            (
              <View style={styles.container}>
                <MapView
                  ref={mapRef}
                  style={styles.map}
                  region={mapRegion}
                  zoomEnabled={true}
                  zoomControlEnabled={true}
                  zoomTapEnabled={true}
                  showsUserLocation={true}
                  minZoomLevel={1}
                  maxZoomLevel={20}
                >
                  <Marker
                    id="marker"
                    coordinate={mapRegion}
                  />
                </MapView>
              </View>
            )
          }
        </ScrollView>
      </SafeAreaView>

      <View style={{
        width: "90%",
        padding: 13,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 30,
        position: "absolute",
        borderRadius: 8,
        left: 20,
        bottom: 10,
      }}>
        <CustomButton
          onPress={() => booking()}
          buttonText={`${t("RESERVAR")} (${obtainMinorPistaPrice(route.params.item.pistasDisponibles)?.precio.toString()}€)`}
          colorButtom='#04D6C8'
          colorText='white'
          colorButtomHover="#04D6C8"
          colorTextHover="white"
          iconRight="calendar"

        // onPress={() => console.log(password)}
        />
      </View>


    </>
  );
};

export default InstalacionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.4,
  },
});