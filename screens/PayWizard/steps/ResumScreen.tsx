import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, BackHandler, Pressable, Modal, TouchableOpacity, Dimensions } from "react-native";
import { MD3Colors, ProgressBar } from "react-native-paper";
import CustomButton from "../../../components/Buttons/CustomButton";
import { I18nContext, useTranslation } from "react-i18next";
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
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Deporte } from "../../../shared/models/Deporte";
import PaymentMethodSelector, { PaymentMethodType } from "../../../components/PaymentMehodSelector/PaymentMehodSelector";
import { Tarjeta } from "../../../shared/models/Tarjeta";
import Icon from "react-native-vector-icons/FontAwesome";
import { XCircleIcon } from "react-native-heroicons/solid";
import CustomTextInput from "../../../components/InputText/CustomTextInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import CardIcon from "../../../components/CardIcon/CardIcon";
import CustomCardInputText from "../../../components/CardInputText/CustomCardInputText";
import CustomDateInput from "../../../components/InputDate/CustomDateInput";

interface PagoScreenProps {
  navigation: any;
}

type ParamList = {
  Item: {
    instalacion?: Instalacion;
    evento?: Evento;
    partido?: Reserva;
    fecha: string,
    pista: Pista,
    horario: Horario
  };
};

const ResumScreen: React.FC<PagoScreenProps> = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const route = useRoute<RouteProp<ParamList, 'Item'>>();

  const { t } = useTranslation();
  const { i18n } = useContext(I18nContext);
  const [methodType, setMethodType] = useState<PaymentMethodType | undefined>(undefined);
  const [card, setCard] = useState<Tarjeta | undefined>(undefined);
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvv, setCvv] = useState('');

  const NUM_CARD_REQUERIDO = t("NUM_CARD_REQUERIDO");
  const FECHA_EXP_REQUERIDA = t("FECHA_EXP_REQUERIDA");
  const CVC_REQUERIDO = t("CVC_REQUERIDO");

  const schema = yup.object().shape({
    nombre: yup.string().required(NUM_CARD_REQUERIDO),
    apellidos: yup.string().required(FECHA_EXP_REQUERIDA),
    email: yup.string().required(CVC_REQUERIDO)
  });

  const { control, setValue, handleSubmit, formState, register, formState: { errors }, reset } = useForm<Tarjeta>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      numero: '',
      fechaExp: new Date(),
      csv: ''
    },
  });

  const onSubmit = () => {

  };

  const goBack = () => {
    if (route.params.instalacion) {
      navigation.navigate("Horario" as never, { instalacion: route.params.instalacion, previousPage: "Resumen" } as never)
    } else if (route.params.evento) {
      navigation.navigate("Horario" as never, { evento: route.params.evento, previousPage: "Resumen" } as never)
    } else if (route.params.partido) {
      navigation.navigate("Horario" as never, { partido: route.params.partido, previousPage: "Resumen" } as never)
    }
  };

  const translations = {
    tab1: t("INTRODUCIR_PAGO"),
    tab2: t("PAGOS_GUARDADOS"),
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

  // const Tab = createMaterialTopTabNavigator();

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

  function translatesport(deporte: Deporte) {
    const nombreTraducido = deporte.traduccionesDeporte.find((tr) => tr.getIdiomaDeporte.cultura === i18n.language)?.nombre;
    return nombreTraducido;
  }

  function getName(): string | undefined {
    return (route.params.evento && route.params.evento.nombre) || (route.params.partido && `${t("PARTIDO")} ${t("DE")} ${translatesport(route.params.partido.obtenerDeporteReserva)}`);
  }

  function getInstalacion(): string | undefined {
    return (route.params.instalacion && route.params.instalacion.nombre) || (route.params.evento && route.params.evento.obtenerInstalacion.nombre) || (route.params.partido && route.params.pista.obtenerInstalaciones.nombre);
  }

  const selectPayment = () => {

  };

  const insertCard = async (data: Tarjeta) => {


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
          <View style={{ justifyContent: 'flex-start' }}>
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <Text style={{ fontSize: 24 }} className="font-semibold">{t("RESUMEN")}</Text>
            </View>
            {(route.params.evento || route.params.partido) && (
              <>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <Text style={{ fontSize: 16 }} >{(route.params.evento && t("INSTALACION")) || (route.params.partido && t("INSTALACION"))}: </Text>
                  <Text style={{ fontSize: 16 }} className="font-semibold">{getName()}</Text>
                </View>
              </>
            )}
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Text style={{ fontSize: 16 }} >{t("INSTALACION")}: </Text>
              <Text style={{ fontSize: 16 }} className="font-semibold">{getInstalacion()}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Text style={{ fontSize: 16 }} >{t("PISTA")}: </Text>
              <Text style={{ fontSize: 16 }} className="font-semibold">{route.params.pista.nombre}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Text style={{ fontSize: 16 }} >{t("HORARIO")}: </Text>
              <Text style={{ fontSize: 16 }} className="font-semibold">{formatTime(route.params.horario.inicio)} - {formatTime(route.params.horario.fin)}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Text style={{ fontSize: 16 }} >{t("PRECIO")}: </Text>
              <Text style={{ fontSize: 16 }} className="font-semibold">{route.params.pista.precio}€</Text>
            </View>
          </View>
          <View style={{ marginVertical: 48 }}>
            {!methodType &&
              <>
                <Text style={{
                  marginBottom: 20,
                  fontSize: 14,
                  letterSpacing: 1.5,
                  fontWeight: 'bold',
                  color: 'black',
                  textTransform: 'uppercase',
                  textAlign: 'center'
                }}>
                  {t("SELECCIONA_METODO_PAGO")}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 16,
                  marginTop: 8
                }}>
                  <Pressable onPress={() => setMethodType('Paypal')} style={[styles.selectButton, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Icon name="paypal" size={24} color="#007DFF" style={{ marginRight: 5 }} />
                    <Text style={styles.boldText}>Paypal</Text>
                  </Pressable>
                  <Pressable onPress={() => setShowCardModal(true)} style={[styles.selectButton, { marginLeft: 20 }]}>
                    <Text style={styles.boldText}>{t("TARJETA")}</Text>
                  </Pressable>
                </View>
              </>
            }
            {methodType &&
              <Pressable
                onPress={() => setMethodType(undefined)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 8,
                }}
              >
                <View style={[styles.selectButton, { marginRight: 16 }]}>
                  {methodType !== 'Paypal' && (
                    <Text style={[styles.boldText, { color: '#007DFF' }]}>
                      ......03564
                    </Text>
                  )}
                  {methodType === 'Paypal' && (
                    <Text style={[styles.boldText, { color: '#007DFF' }]}>
                      <Icon name="paypal" size={24} color="#007DFF" />
                    </Text>
                  )}
                </View>
                <Text style={[styles.boldText, { color: '#007DFF', flex: 1 }]}>
                  {t("CAMBIAR_METODO_PAGO")}
                </Text>
              </Pressable>
            }
          </View>
          {/* <Tab.Navigator
              initialRouteName="PaymentForm"
              screenOptions={{
                tabBarPressColor: "#04D6C8",
                tabBarIndicatorStyle: { borderBottomColor: "#106F69", borderBottomWidth: 3 }
              }}
            >
              <Tab.Screen name={"PaymentForm"} component={PaymentFormScreen} options={{ title: translations.tab1 }} />
              <Tab.Screen name="SavedPayments" component={SavedUserPaymentsScreen} options={{ title: translations.tab2 }} />
            </Tab.Navigator> */}

          <View style={{ justifyContent: 'flex-end' }}>
            <CustomButton
              onPress={() => onSubmit()}
              buttonText={t("PAGAR")}
              colorButtom='#04D6C8'
              colorText='white'
              colorButtomHover="#04D6C8"
              colorTextHover="white"
              iconRight="chevron-right"
              animated={true}
              visible={methodType ? true : false}
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
      <Modal transparent={true} visible={showCardModal} animationType={"fade"}>
        <View style={styles.containerModal}>
          <View style={styles.modal}>
            <View style={{ padding: 20 }}>
              <Text style={styles.title}>{t('PAGO_CON_TARJETA')}</Text>
              <Text className="font-semibold" style={{ fontSize: 18 }}>{t('INTRODUCE_TU_TARJETA')}</Text>
              <View style={{ minHeight: 150 }}>
                <CustomCardInputText
                  nameController="numero"
                  // ref={nombreInputRef}
                  control={control}
                  label={t("NUMERO_TARJETA")}
                  placeholder={t("INTRODUCE_TU_NUMERO_TARJETA")}
                  editable={true}
                  keyboardType={'numeric'}
                  maxLength={16}
                  card={true}
                  rules={{
                    required: { value: true },
                    pattern: {
                      value: true
                    }
                  }}
                  errors={formState.errors.numero && (
                    <Text className="text-error">{formState.errors.numero.message}</Text>
                  )}
                  onSubmit={handleSubmit(insertCard)}
                />
                <CustomDateInput
                  nameController="fechaExp"
                  control={control}
                  label={t("FECHA_EXPIRACION")}
                  placeholder={t("INTRODUCE_LA_FECHA_EXPIRACION")}
                  mode="month"
                  minDate={new Date()}
                  rules={{
                    required: { value: true },
                    pattern: {
                      value: true
                    }
                  }}
                  errors={formState.errors.fechaExp && (
                    <Text className="text-error">{formState.errors.fechaExp.message}</Text>
                  )}
                  onSubmit={handleSubmit(insertCard)}
                />
                <CustomTextInput
                  nameController="cvc"
                  // ref={nombreInputRef}
                  control={control}
                  label={t("CVC")}
                  placeholder={t("INTRODUCE_EL_CVC")}
                  editable={true}
                  maxLength={4}
                  keyboardType={'numeric'}
                  rules={{
                    required: { value: true },
                    pattern: {
                      value: true
                    }
                  }}
                  errors={formState.errors.fechaExp && (
                    <Text className="text-error">{formState.errors.fechaExp.message}</Text>
                  )}
                  onSubmit={handleSubmit(insertCard)}
                />
              </View>

              <CustomButton
                onPress={insertCard}
                buttonText={t("ACEPTAR")}
                colorButtom='#04D6C8'
                colorText='white'
                colorButtomHover="#04D6C8"
                colorTextHover="white"

              // onPress={() => console.log(password)}
              />
              <CustomButton
                onPress={() => setShowCardModal(false)}
                buttonText={t("CANCELAR")}
                colorButtom='transparent'
                colorText='#04D6C8'
                colorButtomHover="#04D6C850"
                colorTextHover="white"
              // onPress={() => console.log(password)}
              />
              <TouchableOpacity style={styles.cancel} onPress={() => setShowCardModal(false)}>
                <XCircleIcon size={24} color="#999" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
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
  row: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 36,
    minHeight: 50
  },
  progressBar: {
    marginBottom: 16,
    height: 6,
    paddingHorizontal: 0,
  },
  selectButton: {
    borderColor: '#007DFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  boldText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#007DFF'
  },
  containerModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    width: '95%',
    maxWidth: 400,
    minHeight: 50
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'left'
  },
  buttoms: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 40
  },
  buttomReset: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    width: 160,
    justifyContent: "center",
    backgroundColor: 'white',
    borderRadius: 4,
  },
  buttomConfirm: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#04D6C8',
    borderRadius: 4,
  },
  buttomCancel: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#999',
    borderRadius: 4,
  },
  buttomText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancel: {
    position: 'absolute',
    top: 4,
    right: 8,
  },
});

export default ResumScreen;