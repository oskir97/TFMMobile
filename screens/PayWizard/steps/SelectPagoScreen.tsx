import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, BackHandler } from "react-native";
import { MD3Colors, ProgressBar } from "react-native-paper";
import CustomButton from "../../../components/Buttons/CustomButton";
import { useTranslation } from "react-i18next";
import { Pago } from "../../../shared/models/Pago";
import { LoginContext } from "../../../shared/services/hooks/login/contexts/LoginContext";
import SportTypes from "../../../components/SportTypes/SportTypes";
import Menu from "../../../components/Menu/Menu";
import { Instalacion } from "../../../shared/models/Instalacion";
import { Evento } from "../../../shared/models/Evento";
import { Reserva } from "../../../shared/models/Reserva";
import { Pista } from "../../../shared/models/Pista";
import { Horario } from "../../../shared/models/Horario";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";

interface PagoScreenProps {
  navigation: any;
}

type ParamList = {
  Item: {
    instalacion?: Instalacion;
    evento?: Evento;
    partido?: Reserva;
    fecha:string,
    pista:Pista,
    horario:Horario
  };
};

const SelectPagoScreen: React.FC<PagoScreenProps> = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const route = useRoute<RouteProp<ParamList, 'Item'>>();

  const { t } = useTranslation();

  const onSubmit = () => {
    
  };

  const goBack = () => {
    if (route.params.instalacion) {
      navigation.navigate("Horario" as never, { instalacion: route.params.instalacion, previousPage: "SelectPago"} as never)
    } else if (route.params.evento) {
      navigation.navigate("Horario" as never, { evento: route.params.evento, previousPage: "SelectPago"} as never)
    } else if (route.params.partido) {
      navigation.navigate("Horario" as never, { partido: route.params.partido, previousPage: "SelectPago"} as never)
    }
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // if (route.params.instalacion) {
      //   setFecha(route.params.fecha ? route.params.fecha : filter?.fecha);
      //   setInstalacion(route.params.instalacion);
      //   obtenerPistas(route.params.fecha ? route.params.fecha : filter?.fecha);
      // }
      // setPista(route.params.pista);
      // setHorario(route.params.horario);
    });
    return unsubscribe;
  }, [navigation, route.params]);

  const toHorario = () => {
    navigation.navigate("Horario");
  };

  return (
    <>
    <Menu showReturnWizard={true} showLang={true} text={t("SELECCIONAR_HORARIO")} showusuario={true} userMenu={() => navigation.openDrawer()} functionGoBack={goBack} />
    <View style={styles.container}>
      <ProgressBar
        style={styles.progressBar}
        progress={0.35}
        color={MD3Colors.primary60}
      />
      <View style={{ flex: 1, justifyContent: 'space-between', margin: 20 }}>
        <View>
          
        </View>

        <View style={{ justifyContent: 'flex-end' }}>
          <CustomButton
            onPress={() => onSubmit()}
            buttonText={t("RESUMEN")}
            colorButtom='#04D6C8'
            colorText='white'
            colorButtomHover="#04D6C8"
            colorTextHover="white"
            iconRight="chevron-right"
          />
          <CustomButton
            onPress={goBack}
            buttonText={t("VOLVER_HORARIO")}
            colorButtom='transparent'
            colorText='#04D6C8'
            colorButtomHover="#04D6C850"
            colorTextHover="white"
            iconLeft="chevron-left"
          // onPress={() => console.log(password)}
          />
        </View>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 8,
  },
  formEntry: {
    margin: 8,
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  progressBar: {
    marginBottom: 16,
    height: 6,
    paddingHorizontal: 0,
  },
});

export default SelectPagoScreen;