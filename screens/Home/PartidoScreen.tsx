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
  Alert,
  Image,
  ImageBackground
} from "react-native";
import { Button } from "react-native-paper";
import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useFocusEffect, useLinkTo, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Reserva } from "../../shared/models/Reserva";
import { Valoracion } from "../../shared/models/Valoracion";
import Menu from "../../components/Menu/Menu";
import MapView, { Marker } from "react-native-maps";
import { I18nContext, useTranslation } from "react-i18next";
import CustomButton from "../../components/Buttons/CustomButton";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Pista } from "../../shared/models/Pista";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";
import { TipoReserva } from "../../shared/models/TipoReserva";
import { ReservaDTO, TipoReservaEnum } from "../../shared/models/dtos/ReservaDTO";
import { useReservas } from "../../shared/services/hooks/reservas/useReservas";
import { Horario } from "../../shared/models/Horario";
import { NivelPartido } from "../../shared/models/NivelPartido";

type ParamList = {
  Item: {
    item: Reserva;
  };
};

interface PartidoScreenProps {
  navigation: any;
}

const PartidoScreen: React.FC<PartidoScreenProps> = ({ navigation }) => {
  const { location } = useContext(LoginContext);
  const route = useRoute<RouteProp<ParamList, 'Item'>>();
  const [partido, setPartido] = useState<Reserva | undefined>(route.params.item);
  const { user } = useContext(LoginContext);
  const { t } = useTranslation();
  const { crearReserva } = useReservas();
  const mapRef = useRef<MapView>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: route.params.item.obtenerPista.obtenerInstalaciones.latitud,
    longitude: route.params.item.obtenerPista.obtenerInstalaciones.longitud,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const { width } = Dimensions.get('window');
  const { i18n } = useContext(I18nContext);

  const seeReviews = () => {
    navigation.navigate("ReviewsScreen" as never, { partido: partido } as never)
  };

  const goBack = () => {
    navigation.navigate("Inicio" as never, { loadingItems: true, partido: partido } as never)
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

  function booking() {
    if (user.idusuario != partido.obtenerUsuarioCreador.idusuario && !partido.obtenerInscripciones.find(i => i.obtenerUsuarioCreador.idusuario == user.idusuario)) {
      var reservaDTO: ReservaDTO = { nombre: user?.nombre, horario_oid: -1, pista_oid: -1, evento_oid: -1, apellidos: user?.apellidos, email: user?.email, telefono: user?.telefono, cancelada: false, maxparticipantes: 1, tipo: TipoReservaEnum.Inscripcion, usuario_oid: user?.idusuario, deporte_oid: partido.obtenerDeporteReserva.iddeporte, partido_oid: partido.idreserva, fecha: partido.fecha };
      crearReserva(reservaDTO, reservaDTO.fecha).then((reserva) => {
        if (reserva) {
          navigation.navigate("Resumen" as never, { partido: partido, reserva: reserva } as never)
        } else {
          const errormessage = t("NO_SE_PUEDE_RESERVAR");
          const erroraplicacion = t("RESERVA_NO_DISPONIBLE");
          Alert.alert(errormessage, erroraplicacion);
        }
      });
    } else {
      const errormessage = t("USUARIO_INSCRITO");
      const erroraplicacion = t("USUARIO_YA_INSCRITO");
      Alert.alert(errormessage, erroraplicacion);
    }
  }

  function formatDate(date: Date | undefined): string {
    if (date) {
      return new Date(date).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es');
    }
    return '';
  }

  function formatTime(timeString: Date | null | undefined): string {
    if (timeString && timeString != null) {
      const date = new Date(timeString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } else {
      return "";
    }
  }

  function formatHorarios(horarios: Horario[] | undefined): JSX.Element {
    if (horarios) {
      const formattedHorarios: JSX.Element[] = [];

      for (const horario of horarios) {
        const diasSemana = horario.obtenerDiasSemana.map(dia => t(dia.nombre.toUpperCase().replace("É", "E").replace("Á", "A"))).join(', ');
        const inicio = horario.inicio ? new Date(horario.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        const fin = horario.fin ? new Date(horario.fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

        const diasSemanaElement = <Text style={{ fontWeight: 'bold', marginBottom: 4 }} numberOfLines={3} ellipsizeMode="tail">{diasSemana}</Text>;
        const horasElement = <Text style={{ fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">{t('DE2')} {inicio} {t('A2')} {fin}</Text>;
        formattedHorarios.push(
          <View key={horario.idhorario}>
            {diasSemanaElement}
            {horasElement}
          </View>
        );
      }

      return <>{formattedHorarios}</>;
    } else {
      return <></>
    }
  }

  function obtenerDosPrimerosDecimales(numero: number): number {
    const parteEntera = Math.floor(numero);
    const decimales = Number((numero % 1).toFixed(2));
    const numeroFinal = parteEntera + decimales;
    return numeroFinal;
  }

  function obtenerNivelPartido() {
    var nivelPartido: string;
    switch (route.params.item?.nivelpartido) {
      case NivelPartido.basico:
        nivelPartido = t("BASICO");
        break;
      case NivelPartido.medio:
        nivelPartido = t("MEDIO");
        break;
      case NivelPartido.avanzado:
        nivelPartido = t("AVANZADO");
        break;
    }
    return nivelPartido;
  }

  useEffect(() => {
    const fetchMenu = () => {
      setPartido(route.params.item);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      const newMapRegion = {
        latitude: route.params.item.obtenerPista.obtenerInstalaciones.latitud,
        longitude: route.params.item.obtenerPista.obtenerInstalaciones.longitud,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setMapRegion(newMapRegion);

      mapRef.current?.fitToSuppliedMarkers(["marker"]);
    });
    fetchMenu();

  }, [route.params.item]);

  const renderImageUser = () => {
    if (route.params.item.obtenerUsuarioCreador.imagen) {
      return (
        <Image
          source={{ uri: route.params.item.obtenerUsuarioCreador.imagen }}
          style={{ height: 35, width: 35, marginRight: 10, borderRadius: 25 }}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <ImageBackground
          source={require('../../assets/images/user.png')}
          style={{ height: 35, width: 35, marginRight: 10 }} imageStyle={{ borderRadius: 25 }}></ImageBackground>
      );
    }
  };

  return (
    <>
      <Menu showReturnWizard={true} showLang={true} text={t("PARTIDOS")} showusuario={true} userMenu={() => navigation.openDrawer()} functionGoBack={goBack} />
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
                <View style={{ flexDirection: 'row' }}>{renderImageUser()}
                  <Text style={{ width: width * 0.7, fontSize: 19, fontWeight: "bold", marginTop:5 }}>
                    {`${partido?.nombre} ${partido?.apellidos}`}
                  </Text>
                </View>
                {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AntDesign
                    style={{ marginHorizontal: 7 }}
                    name="sharealt"
                    size={24}
                    color="black"
                  />

                </View> */}
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
                  {average(partido?.obtenerUsuarioCreador.obtenerValoracionesAUsuarioPartido)}
                </Text>
                <Text style={{ marginLeft: 3, fontSize: 17, fontWeight: "400", marginRight: 10 }}>{t("SOBRE")} 5</Text>
                {partido?.obtenerUsuarioCreador.obtenerValoracionesAUsuarioPartido && partido?.obtenerUsuarioCreador.obtenerValoracionesAUsuarioPartido.length > 0 && (
                  <Button buttonColor="transparent" style={{ marginLeft: 'auto', borderColor: 'green', borderWidth: 2 }} mode="text" textColor="green" icon={() => <Icon name="hand-o-down" size={15} color="green" />} contentStyle={{ flexDirection: 'row-reverse' }} onPress={seeReviews}>
                    <Text style={{ fontSize: 12 }}>
                      {t("VER_RESENAS")}
                    </Text>
                  </Button>
                )}
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <Text style={{ marginLeft: 6, fontSize: 12 }}>{new Date(partido?.fecha).toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')}</Text>
                <Text style={{ marginLeft: 6, fontSize: 12 }}>{`${formatTime(partido?.obtenerHorarioReserva.inicio)} - ${formatTime(partido?.obtenerHorarioReserva.fin)}`}</Text>
                <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: 'bold' }}>{`|`}</Text>
                <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: 'bold' }}>{`${partido?.maxparticipantes - partido?.obtenerInscripciones.length} ${partido?.maxparticipantes - partido?.obtenerInscripciones.length > 1 ? t("PLAZAS") : t("PLAZA")}`}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <Text style={{ marginLeft: 6, fontSize: 14 }}>{partido?.obtenerPista.obtenerInstalaciones.nombre}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ marginLeft: 6, fontSize: 14 }}>{partido?.obtenerPista.nombre}</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ marginTop: 10, marginLeft: 6, fontSize: 16, fontWeight: 'bold' }}>{partido?.descripcionpartido}</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: 'flex-start',
                  marginTop: 0,
                }}
              >
                <Text style={{ marginLeft: 6, fontSize: 15, marginTop: 10, marginBottom: 5, fontWeight: '400' }}>{`${t("NIVEL")}:`}</Text>
                <Text style={{ marginLeft: 3, fontSize: 15, marginTop: 10, marginBottom: 5, fontWeight: 'bold' }}>{obtenerNivelPartido()}</Text>
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
                    {partido?.obtenerPista.obtenerInstalaciones.distancia} ({partido?.obtenerPista.obtenerInstalaciones.tiempo}) |
                  </Text>
                </>
                )}
                <Text style={{ marginLeft: 7, color: "gray", fontSize: 13, fontWeight: 'bold', marginRight: 5 }} numberOfLines={1} ellipsizeMode="tail">
                  {partido?.obtenerPista.obtenerInstalaciones.domicilio}
                </Text>
              </View>
            </View>
          </View>
          {partido && partido.obtenerPista.obtenerInstalaciones.latitud && partido.obtenerPista.obtenerInstalaciones.longitud &&
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
          buttonText={`${t("INSCRIBIRSE")}`}
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

export default PartidoScreen;

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