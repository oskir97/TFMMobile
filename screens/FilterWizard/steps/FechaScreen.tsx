import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions, Alert } from "react-native";
import { MD3Colors, ProgressBar } from "react-native-paper";
import { LoginContext } from "../../../shared/services/hooks/login/contexts/LoginContext";
import { I18nContext, useTranslation } from "react-i18next";
import CustomButton from "../../../components/Buttons/CustomButton";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Menu from "../../../components/Menu/Menu";
import { Filter } from "../../../shared/models/Filter";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UbicationScreenProps {
  navigation: any;
}

const FechaScreen: React.FC<UbicationScreenProps> = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const { filter, setFilter } = useContext(LoginContext);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(filter && filter.fecha && filter.fecha.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) ? filter.fecha : undefined);
  // const [error, setError] = useState(false);
  const today = new Date();

  const handleDateSelect = (date: string) => {
    const selected = new Date(date);
    setSelectedDate(selected);
    // setError(false);
  };

  const { t } = useTranslation();
  const { i18n } = useContext(I18nContext);
  const [calendarKey, setCalendarKey] = useState(Date.now());

  useEffect(() => {
    const updateLanguage = () => {
      LocaleConfig.defaultLocale = i18n.language;
    };

    i18n.on('languageChanged', updateLanguage);

    return () => {
      i18n.off('languageChanged', updateLanguage);
    };
  }, [i18n]);

  async function storageFilter(filter: Filter) {

    if (filter.localidad && filter.deporte && filter.fecha) {
      await AsyncStorage.setItem('localidad', filter.localidad);
      await AsyncStorage.setItem('iddeporte', filter.deporte.toString());
      await AsyncStorage.setItem('fecha', filter.fecha.toString());

      if (filter.sort)
        await AsyncStorage.setItem('sort', filter.sort.toString());
      else
        await AsyncStorage.setItem('sort', 'Distancia');
      if (filter.type)
        await AsyncStorage.setItem('type', filter.type.toString());
      else
        await AsyncStorage.setItem('type', 'Pista');
      return true;
    } else {
      const errormessage = t("ERROR");
      const erroraplicacion = "";

      if (filter.localidad)
        t("ERROR_LOCALIDAD_FILTRO");
      else if (filter.deporte)
        t("ERROR_DEPORTE_FILTRO");
      else
        t("ERROR_FECHA_FILTRO");

      Alert.alert(errormessage, erroraplicacion);

      return false;
    }
  }

  const onSubmit = () => {
    if (selectedDate != null) {
      var filterFecha = filter;
      if (filterFecha == null)
        filterFecha = { localidad: undefined, fecha: ajustarFechaConZonaHoraria(selectedDate), deporte: undefined };
      else
        filterFecha.fecha = ajustarFechaConZonaHoraria(selectedDate);

      if (!filterFecha.sort)
        filterFecha.sort = "Distancia";

      if (!filterFecha.type)
        filterFecha.type = "Pista";

      setFilter(filterFecha);

      storageFilter(filterFecha).then((result: boolean) => {
        if (result)
          navigation.navigate("Inicio");
        else {
          if (filter?.localidad)
            navigation.navigate("Ubicación");
          else if (filter?.deporte)
            navigation.navigate("Deporte");
          else
            navigation.navigate("Fecha");
        }
      });
    }
    // else {
    //   setError(true);
    // }
  };

  function ajustarFechaConZonaHoraria(fecha: Date): Date {
    const [day, month, year] = fecha.toLocaleDateString().split("/");

    // Convert the string values to numbers
    const numericMonth = parseInt(month, 10);
    const numericDay = parseInt(day, 10);
    const numericYear = parseInt(year, 10);

    // Create the Date object with the numeric year, month (zero-based), and day
    const dateObject = new Date(numericYear, numericMonth - 1, numericDay);
    return dateObject;
  }

  const toDeporte = () => {
    navigation.navigate("Deporte");
  };

  LocaleConfig.locales['es'] = {
    monthNames: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
      'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthNamesShort: [
      'Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.',
      'Jul.', 'Ago.', 'Sept.', 'Oct.', 'Nov.', 'Dic.'
    ],
    dayNames: [
      'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ],
    dayNamesShort: ['Do', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    today: 'Hoy'
  };

  LocaleConfig.locales['en'] = {
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ],
    monthNamesShort: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    dayNames: [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    today: 'Today'
  };

  LocaleConfig.locales['ca'] = {
    monthNames: [
      'Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol',
      'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'
    ],
    monthNamesShort: [
      'Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'
    ],
    dayNames: [
      'Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'
    ],
    dayNamesShort: ['Dg', 'Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds'],
    today: 'Avui'
  };

  useEffect(() => {
    const updateDeportesWithTranslation = () => {
      LocaleConfig.defaultLocale = i18n.language;
      setCalendarKey(Date.now());
    };

    i18n.on('languageChanged', updateDeportesWithTranslation);

    return () => {
      i18n.off('languageChanged', updateDeportesWithTranslation);
    };
  }, [i18n]);

  const markedDates = {
    [today.toISOString().slice(0, 10)]: { selected: false, marked: true, selectedColor: '#04D6C8' },
    [selectedDate ? convertDateFormat(new Date(selectedDate).toLocaleDateString()) : '']: { selected: true, marked: true, selectedColor: '#04D6C8' }
  };

  function convertDateFormat(originalDate: string): string {
    const [day, month, year] = originalDate.split('/');
    const formattedDate = `${year}-${padNumber(month)}-${padNumber(day)}`;
    return formattedDate;
  }

  function padNumber(num: string): string {
    return num.padStart(2, '0');
  }

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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontSize: 24 }} className="font-semibold mt-1">{t("SELECCIONAR_FECHA_JUGAR")}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Calendar
                key={calendarKey}
                firstDay={1}
                onDayPress={(day) => handleDateSelect(day.dateString)}
                markedDates={
                  markedDates
                }
                style={{ width: Dimensions.get('window').width - 40 }}
                theme={{
                  todayTextColor: "#04D6C8",
                  arrowColor: "#04D6C8",
                  dotColor: "#04D6C8",
                  textDayFontSize: 20,
                  textMonthFontSize: 24,
                  textDayHeaderFontSize: 16,
                }}

                minDate={today.toISOString().slice(0, 10)}
              />
            </View>
            {/* {error && (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text className="text-error">{t("SELECCIONAR_UNA_FECHA")}</Text>
              </View>
            )} */}
            {selectedDate && (
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, textAlign: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: '#04D6C8' }}>{selectedDate.toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')}</Text>
                </Text>
              </View>
            )}
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
              animated={true}
              visible={selectedDate ? true : false}
            />
            <CustomButton
              onPress={toDeporte}
              buttonText={t("VOLVER_DEPORTE")}
              colorButtom='transparent'
              colorText='#04D6C8'
              colorButtomHover="#04D6C850"
              colorTextHover="white"
              iconLeft="chevron-left"
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

export default FechaScreen;