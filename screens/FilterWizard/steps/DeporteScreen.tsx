import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { MD3Colors, ProgressBar } from "react-native-paper";
import CustomButton from "../../../components/Buttons/CustomButton";
import { useTranslation } from "react-i18next";
import { Deporte } from "../../../shared/models/Deporte";
import { LoginContext } from "../../../shared/services/hooks/login/contexts/LoginContext";
import SportTypes from "../../../components/SportTypes/SportTypes";
import Menu from "../../../components/Menu/Menu";

interface DeporteScreenProps {
  navigation: any;
}

const DeporteScreen: React.FC<DeporteScreenProps> = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const { filter, setFilter, localidad } = useContext(LoginContext);
  const [deporteAsignado, setDeporteAsignado] = useState<Deporte | undefined>();
  // const [error, setError] = useState(false);

  const { t } = useTranslation();

  const onSubmit = () => {
    if (deporteAsignado != undefined) {
      var filterUbicacion = filter;
      if (filterUbicacion == undefined)
        filterUbicacion = { localidad: localidad, fecha: undefined, deporte: deporteAsignado.iddeporte };
      else
        filterUbicacion.deporte = deporteAsignado.iddeporte

      setFilter(filterUbicacion);

      // setError(false);

      navigation.navigate("Fecha");
    } 
    // else {
    //   setError(true);
    // }
  };

  const toUbicacion = () => {
    navigation.navigate("Ubicación");
  };

  return (
    <>
    <Menu showReturnWizard={false} showLang={true} showusuario={true} userMenu={() => navigation.openDrawer()}/>
    <View style={styles.container}>
      <ProgressBar
        style={styles.progressBar}
        progress={0.35}
        color={MD3Colors.primary60}
      />
      <View style={{ flex: 1, justifyContent: 'space-between', margin: 20 }}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 24 }} className="font-semibold mt-1">{t("SELECCIONAR_UN_DEPORTE")}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <SportTypes setSelectedDeporte={setDeporteAsignado} selectedDeporte={deporteAsignado} iddeporte={filter && filter.deporte?filter.deporte : undefined} vertical={true} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

          </View>
          {/* {error && (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text className="text-error">{t("SELECCIONAR_UN_DEPORTE")}</Text>
            </View>
          )} */}
        </View>

        <View style={{ justifyContent: 'flex-end' }}>
          <CustomButton
            onPress={() => onSubmit()}
            buttonText={t("SELECCIONAR_FECHA")}
            colorButtom='#04D6C8'
            colorText='white'
            colorButtomHover="#04D6C8"
            colorTextHover="white"
            iconRight="chevron-right"
            animated={true}
            visible={deporteAsignado?true : false}
          />
          <CustomButton
            onPress={toUbicacion}
            buttonText={t("VOLVER_UBICACION")}
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

export default DeporteScreen;