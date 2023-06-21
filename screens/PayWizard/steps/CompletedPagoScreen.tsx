import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions, Alert } from "react-native";
import { MD3Colors, ProgressBar } from "react-native-paper";
import { LoginContext } from "../../../shared/services/hooks/login/contexts/LoginContext";
import { I18nContext, useTranslation } from "react-i18next";
import CustomButton from "../../../components/Buttons/CustomButton";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Menu from "../../../components/Menu/Menu";
import { Filter, Sort, TypeReservation } from "../../../shared/models/Filter";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CompletedPagoScreenProps {
  navigation: any;
}

const CompletedPagoScreen: React.FC<CompletedPagoScreenProps> = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const [error, setError] = useState(false);

  const { t } = useTranslation();

  const onSubmit = () => {
    
  };

  useEffect(() => {
    
  }, []);

  return (
    <>
      <Menu showReturnWizard={false} showLang={true} showusuario={true} userMenu={() => navigation.openDrawer()} />
      <View style={styles.container}>
        <ProgressBar
          style={styles.progressBar}
          progress={0.65}
          color={MD3Colors.primary60}
        />
        <View style={{ flex: 1, justifyContent: 'space-between', margin: 20 }}>
          <View>

          </View>

          <View style={{ justifyContent: 'flex-end' }}>
            <CustomButton
              onPress={() => onSubmit()}
              buttonText={t("MOSTRAR_RESULTADOS")}
              colorButtom='#04D6C8'
              colorText='white'
              colorButtomHover="#04D6C8"
              colorTextHover="white"
              iconRight="search"
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