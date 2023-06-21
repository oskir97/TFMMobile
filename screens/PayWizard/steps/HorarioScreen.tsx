import React, { useContext, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Platform, BackHandler } from "react-native";
import { MD3Colors, ProgressBar } from "react-native-paper";
import { PaperSelect } from 'react-native-paper-select';
import { I18nContext, useTranslation } from "react-i18next";
import CustomButton from "../../../components/Buttons/CustomButton";
import Menu from "../../../components/Menu/Menu";
import { Ionicons } from "@expo/vector-icons";
import { Instalacion } from "../../../shared/models/Instalacion";
import { Evento } from "../../../shared/models/Evento";
import { Reserva } from "../../../shared/models/Reserva";
import { Deporte } from "../../../shared/models/Deporte";
import { LoginContext } from "../../../shared/services/hooks/login/contexts/LoginContext";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useHorarios } from "../../../shared/services/hooks/horarios/useHorarios";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Horario } from "../../../shared/models/Horario";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { Pista } from "../../../shared/models/Pista";
import { date } from "yup";

interface UbicationScreenProps {
  navigation: any;
}

type ParamList = {
  Item: {
    instalacion?: Instalacion;
    evento?: Evento;
    partido?: Reserva;
    previousPage:string;
  };
};

const HorarioScreen: React.FC<UbicationScreenProps> = ({ navigation }) => {
  const route = useRoute<RouteProp<ParamList, 'Item'>>();
  const { filter } = useContext(LoginContext);
  const [fecha, setFecha] = useState<Date | undefined>(filter?.fecha);
  const [horario, setHorario] = useState<Horario | undefined>();
  const { obtenerpistasinstalacion } = useHorarios();
  const [showPicker, setShowPicker] = useState(false);
  const [instalacion, setInstalacion] = useState<Instalacion | undefined>(route.params.instalacion);
  const [evento, setEvento] = useState<Evento | undefined>(route.params.evento);
  const [partido, setPartido] = useState<Reserva | undefined>(route.params.partido);
  const [pistas, setPistas] = useState<Pista[] | undefined>();
  const [pista, setPista] = useState<Pista | undefined>();
  const newDate = new Date();

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const addTime = (value: Horario) => {
    if (value == horario) {
      setHorario(undefined);
    } else {
      setHorario(value);
    }
  }

  const { t } = useTranslation();
  const { i18n } = useContext(I18nContext);

  const onSubmit = () => {
    if (route.params.instalacion) {
      navigation.navigate("SelectPago" as never, { instalacion: route.params.instalacion, fecha: fecha ? fecha.toLocaleDateString() : new Date().toLocaleDateString(), pista: pista, horario: horario } as never)
    } else if (route.params.evento) {
      navigation.navigate("SelectPago" as never, { evento: route.params.evento, fecha: fecha ? fecha.toLocaleDateString() : new Date().toLocaleDateString(), pista: pista, horario: horario } as never)
    } else if (route.params.partido) {
      navigation.navigate("SelectPago" as never, { partido: route.params.partido, fecha: fecha ? fecha.toLocaleDateString() : new Date().toLocaleDateString(), pista: pista, horario: horario } as never)
    }
  };

  const goBack = () => {
    if (route.params.instalacion) {
      navigation.navigate("InstalacionScreen" as never, { item: route.params.instalacion } as never)
    } else if (route.params.evento) {
      navigation.navigate("EventoScreen" as never, { item: route.params.evento } as never)
    } else if (route.params.partido) {
      navigation.navigate("PartidosScreen" as never, { item: route.params.partido } as never)
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

  function obtenerPistas(fecha: Date | undefined) {
    if (route.params.instalacion && fecha) {
      obtenerpistasinstalacion(route.params.instalacion, new Date(fecha.getTime() + (24 * 60 * 60 * 1000))).then((pistas) => setPistas(pistas));
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params.previousPage != "SelectPago") {
        setFecha(filter?.fecha);

        if (route.params.instalacion) {
          setInstalacion(route.params.instalacion);
          obtenerPistas(filter?.fecha);
        }
        setPista(undefined);
        setHorario(undefined);
      }
    });
    return unsubscribe;
  }, [navigation, route.params]);

  function translatesport(deporte: Deporte) {
    const nombreTraducido = deporte.traduccionesDeporte.find((tr) => tr.getIdiomaDeporte.cultura === i18n.language)?.nombre;
    return nombreTraducido;
  }

  function horarioDisponible(horario: Horario): boolean {
    return pista?.obtenerHorariosDisponibles.find(h => h.idhorario == horario.idhorario) ? true : false;
  }

  function formatTime(timeString: Date | null): string {
    if (timeString != null) {
      const date = new Date(timeString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } else {
      return "";
    }
  }

  const translations = {
    acceptLabel: t("ACEPTAR"),
    cancelLabel: t("CANCELAR"),
    placeholder: t("BUSCAR"),
    error: t("ERROR_APLICACION")
  };

  return (
    <>
      <Menu showReturnWizard={true} showLang={true} text={(instalacion && instalacion.nombre) || (evento && evento.nombre) || (partido && `${t("PARTIDO")} ${t("DE")} ${translatesport(partido.obtenerDeporteReserva)}`)} showusuario={true} userMenu={() => navigation.openDrawer()} functionGoBack={goBack} />
      <View style={styles.container}>
        <ProgressBar
          style={styles.progressBar}
          progress={0}
          color={MD3Colors.primary60}
        />
        <View style={{ flex: 1, justifyContent: 'space-between', margin: 20 }}>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontSize: 24 }} className="font-semibold mt-1">{t("SELECCIONA_HORARIO")}</Text>
            </View>
            <View style={{ height: 70, marginTop: 20, marginBottom: 0 }}>
              <TouchableOpacity style={styles.buttonCalendar} onPress={toggleDatepicker}>
                <Text style={styles.textDate}>{fecha?.toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')}</Text>
                <Text style={styles.textDate}>{horario && horario.inicio && `${formatTime(horario.inicio)} - ${formatTime(horario.fin)}`}</Text>
              </TouchableOpacity>
            </View>
            <PaperSelect
              label={t("SELECCIONAR_PISTA")}
              dialogCloseButtonText={translations.cancelLabel}
              dialogDoneButtonText={translations.acceptLabel}
              dialogCloseButtonStyle={{color:"grey"}}
              dialogDoneButtonStyle={{color:"#04D6C8"}}
              checkboxProps={{
                checkboxColor: "#04D6C8"
              }}
              searchText={translations.placeholder}
              value={pista ? `${pista.nombre}${pista.ubicacion ? " - " + pista.ubicacion : ""}` : ""}
              onSelection={(value: any) => {
                setHorario(undefined);
                setPista(pistas?.find((pista) => pista.idpista.toString() == value.selectedList[0]._id));
              }}
              arrayList={pistas ? pistas.map((pista) => ({ value: `${pista.nombre}${pista.ubicacion ? " - " + pista.ubicacion : ""}`, _id: pista.idpista.toString() })) : []}
              multiEnable={false}
              theme={{
                colors: {
                  placeholder: 'black'
                }
              }} selectedArrayList={[]} />
            {pista && (
              <>
                <Text style={[styles.titleCategory, { fontSize: 15, marginBottom: 0, marginTop: 10 }]}>{t("HORARIOS")}</Text>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  style={styles.flatlist}
                  keyExtractor={(item) => item.idhorario.toString()}
                  data={pista.obtenerHorarios.sort((a, b) => (a.inicio ? new Date(a.inicio).getTime() : 0) - (b.inicio ? new Date(b.inicio).getTime() : 0))}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => addTime(item)} style={!horarioDisponible(item) && styles.buttonDisabled} disabled={!horarioDisponible(item)}>
                      <View style={styles.timeContainer}>
                        <Text style={horarioDisponible(item) ? (item.idhorario == horario?.idhorario ? styles.textSelected : styles.textTime) : styles.textDisabled}>{`${formatTime(item.inicio)} - ${formatTime(item.fin)}`}</Text>
                        <View style={styles.freeArea}>
                          <Text style={horarioDisponible(item) ? (item.idhorario == horario?.idhorario ? styles.textSelected : styles.textTime) : styles.textDisabled}>{pista?.precio > 0 ? `${pista?.precio}€` : t("GRATIS")}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}>
                </FlatList>
              </>
            )}
          </View>

          <CustomButton
            onPress={() => onSubmit()}
            buttonText={t("SELECCIONAR_PAGO")}
            colorButtom='#04D6C8'
            colorText='white'
            colorButtomHover="#04D6C8"
            colorTextHover="white"
            iconRight="chevron-right"
            animated={true}
            visible={fecha && horario ? true : false}
          />
        </View>
      </View>
      {showPicker && (
        <DateTimePicker className="flex flex-1 bg-transparent text-lg text-[#EFE3C895] h-[50px] pl-2" mode="date" display={'spinner'} maximumDate={new Date(newDate.getTime() + (2 * 7 * 24 * 60 * 60 * 1000))} minimumDate={newDate}
          value={fecha ? fecha : new Date()} onChange={({ type }, selectedDate) => {
            if (type == "set") {
              toggleDatepicker();
              setFecha(selectedDate);
              setHorario(undefined);
              setPista(undefined);
              obtenerPistas(selectedDate);

              // if(Platform.OS === "android"){
              //   toggleDatepicker();
              // }
            } else {
              toggleDatepicker();
            }
          }} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 8
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
  scrollView: {

  },
  titleCategory: {
    fontWeight: 'bold',
    // marginTop: 30,
    fontSize: 20,
    color: "#7D8392"
  },
  buttonCalendar: {
    height: 55,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#106F69",
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#04D6C8'
  },
  textDate: {
    textTransform: 'uppercase',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderColor: "#DBE3EB",
    borderBottomWidth: 1,
    paddingBottom: 15
  },
  freeArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
  },
  radio: {
    height: 15,
    width: 15,
    borderRadius: 30,
    borderColor: "#C7CBCF",
    borderWidth: 1,
    marginLeft: 10
  },
  flatlist: {
    marginTop: 10,
    height: Dimensions.get("window").height * 0.40,
  },
  textTime: {
    color: '#707070'
  },
  textSelected: {
    color: '#04D6C8',
    fontWeight: 'bold'
  },
  buttonDisabled: {
    opacity: 0.5, // Cambiar la opacidad para indicar que está deshabilitado
  },
  textDisabled: {
    textDecorationLine: 'line-through', // Tachar el texto
    color: 'gray', // Cambiar el color del texto
  },
});

export default HorarioScreen;