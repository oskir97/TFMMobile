import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions, Alert } from "react-native";
import { MD3Colors, ProgressBar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import CustomButton from "../../../components/Buttons/CustomButton";
import Menu from "../../../components/Menu/Menu";

interface CompletedPagoScreenProps {
  navigation: any;
}

const CompletedPagoScreen: React.FC<CompletedPagoScreenProps> = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const { t } = useTranslation();

  const onSubmit = () => {
    navigation.navigate("Inicio" as never);
  };
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
              <Text style={{ fontSize: 24 }} className="font-semibold">{t("PAGO_REALIZADO")}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Text style={{ fontSize: 16 }} >{t("PAGO_COMPLETADO")}</Text>
            </View>
          </View>

          <View style={{ justifyContent: 'flex-end' }}>
            <CustomButton
              onPress={() => onSubmit()}
              buttonText={t("VOLVER_INICIO")}
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