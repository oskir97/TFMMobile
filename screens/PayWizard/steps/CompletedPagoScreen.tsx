import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions, Alert } from "react-native";
import { MD3Colors, ProgressBar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import CustomButton from "../../../components/Buttons/CustomButton";
import Menu from "../../../components/Menu/Menu";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TipoReserva } from "../../../shared/models/TipoReserva";

interface CompletedPagoScreenProps {
  navigation: any;
}

type ParamList = {
  Item: {
    instalacion?: boolean;
    evento?: boolean;
    partido?: boolean;
    inscripcionPartido?:boolean
  };
};

const CompletedPagoScreen: React.FC<CompletedPagoScreenProps> = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const { t } = useTranslation();

  const onSubmit = () => {
    if (route.params.instalacion) {
      navigation.navigate("Reservas" as never);
    } else if (route.params.evento) {
      navigation.navigate("Eventos" as never);
    } else if (route.params.partido || route.params.inscripcionPartido) {
      navigation.navigate("Partidos" as never);
    }
  };
  const botonTraduccion = () => {
    if (route.params.instalacion) {
      return t("MIS_RESERVAS");
    } else if (route.params.evento) {
      return t("MIS_EVENTOS");
    } else if (route.params.partido || route.params.inscripcionPartido) {
      return t("MIS_PARTIDOS");
    }
  };
  const route = useRoute<RouteProp<ParamList, 'Item'>>();

  const titulo = route.params.inscripcionPartido?t("INSCRIPCION_REALIZADA") : t("PAGO_REALIZADO");
  const subtitulo = route.params.inscripcionPartido?t("INSCRIPCION_COMPLETADA") : t("PAGO_COMPLETADO");;
  return (
    <>
      <Menu showReturnWizard={false} showLang={true} showusuario={true} userMenu={() => navigation.openDrawer()} />
      <View style={styles.container}>
        <ProgressBar
          style={styles.progressBar}
          progress={1}
          color={MD3Colors.primary60}
        />
        <View style={{ flex: 1, justifyContent: 'space-between', margin: 20 }}>
          <View style={{ justifyContent: 'flex-start' }}>
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <Text style={{ fontSize: 24 }} className="font-semibold">{titulo}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Text style={{ fontSize: 16 }} >{subtitulo}</Text>
            </View>
          </View>

          <View style={{ justifyContent: 'flex-end' }}>
            <CustomButton
              onPress={() => onSubmit()}
              buttonText={botonTraduccion()}
              colorButtom='#04D6C8'
              colorText='white'
              colorButtomHover="#04D6C8"
              colorTextHover="white"
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  progressBar: {
    marginBottom: 16,
    height: 6,
    paddingHorizontal: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default CompletedPagoScreen;