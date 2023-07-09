import {
  ScrollView,
  Dimensions,
  SafeAreaView,
  BackHandler,
  View,
  Text
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { Instalacion } from "../../shared/models/Instalacion";
import Menu from "../../components/Menu/Menu";
import { I18nContext, useTranslation } from "react-i18next";
import { Evento } from "../../shared/models/Evento";
import { Reserva } from "../../shared/models/Reserva";
import { Deporte } from "../../shared/models/Deporte";
import ReviewsList from "../../components/Reviews/ReviewsList";
// import Modal from "react-native-modal";
// import { useSelector } from "react-redux";

type ParamList = {
  Params: {
    instalacion?: Instalacion;
    evento?: Evento;
    partido?: Reserva;
  };
};

interface ReviewsScreenProps {
  navigation: any;
}

const ReviewsScreen: React.FC<ReviewsScreenProps> = ({ navigation }) => {
  const route = useRoute<RouteProp<ParamList, 'Params'>>();
  const [instalacion, setInstalacion] = useState<Instalacion | undefined>(route.params.instalacion);
  const [evento, setEvento] = useState<Evento | undefined>(route.params.evento);
  const [partido, setPartido] = useState<Reserva | undefined>(route.params.partido);
  const { t } = useTranslation();
  const { i18n } = useContext(I18nContext);
  // const { Asignarinstalacionfavoritos, Eliminarinstalacionfavoritos } = useFavoritosInstalaciones();

  const { width } = Dimensions.get('window');

  const goBack = () => {
    if (route.params.instalacion) {
      navigation.navigate("InstalacionScreen" as never, { item: route.params.instalacion } as never)
    } else if (route.params.evento) {
      navigation.navigate("EventoScreen" as never, { item: route.params.evento } as never)
    } else if (route.params.partido) {
      navigation.navigate("PartidoScreen" as never, { item: route.params.partido } as never)
    }
  };

  function translatesport(deporte: Deporte) {
    const nombreTraducido = deporte.traduccionesDeporte.find((tr) => tr.getIdiomaDeporte.cultura === i18n.language)?.nombre;
    return nombreTraducido;
  }

  useEffect(() => {
    const fech = () => {
      if (route.params.instalacion) {
        setInstalacion(route.params.instalacion);
      } else if (route.params.evento) {
        setEvento(route.params.evento);
      } else if (route.params.partido) {
        setPartido(route.params.partido);
      }
    };

    fech();
  }, [route.params]);

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

  return (
    <>
      <Menu showReturnWizard={true} showLang={true} text={(instalacion && instalacion.nombre) || (evento && evento.nombre) || (partido && `${t("PARTIDO")} ${t("DE")} ${translatesport(partido.obtenerDeporteReserva)}`)} showusuario={true} userMenu={() => navigation.openDrawer()} functionGoBack={goBack} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{
            marginHorizontal: 20,
            marginVertical: 5,
            padding: 10,
            borderRadius: 15
          }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 19, fontWeight: "bold" }}>
                {t("LISTA_VALORACIONES")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: 'flex-start',
                marginTop: 0,
              }}
            >
              <Text style={{ marginLeft: 3, fontSize: 14, color: 'grey' }}>{(instalacion && instalacion.nombre) || (evento && evento.nombre) || (partido && `${partido.obtenerUsuarioCreador.nombre} ${partido.obtenerUsuarioCreador.apellidos}`)}</Text>
            </View>
            <ReviewsList items={(instalacion && instalacion.obtenerValoracionesInstalacion) || (evento && evento.obtenerValoracionesEvento) || (partido && partido.obtenerUsuarioCreador.obtenerValoracionesAUsuarioPartido)} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ReviewsScreen;