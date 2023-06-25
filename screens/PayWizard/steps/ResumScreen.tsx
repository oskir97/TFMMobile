import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, BackHandler, Pressable, Modal, TouchableOpacity, Alert } from "react-native";
import { MD3Colors, ProgressBar } from "react-native-paper";
import CustomButton from "../../../components/Buttons/CustomButton";
import { I18nContext, useTranslation } from "react-i18next";
import Menu from "../../../components/Menu/Menu";
import { Instalacion } from "../../../shared/models/Instalacion";
import { Evento } from "../../../shared/models/Evento";
import { Reserva } from "../../../shared/models/Reserva";
import { Pista } from "../../../shared/models/Pista";
import { Horario } from "../../../shared/models/Horario";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { Deporte } from "../../../shared/models/Deporte";
import { PaymentMethodType } from "../../../components/PaymentMehodSelector/PaymentMehodSelector";
import { Tarjeta } from "../../../shared/models/Tarjeta";
import Icon from "react-native-vector-icons/FontAwesome";
import { XCircleIcon } from "react-native-heroicons/solid";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import CustomCardInputText from "../../../components/CardInputText/CustomCardInputText";
import CustomMonthDateInput from "../../../components/InputMonthDate/CustomMonthDateInput";
import cardValidator from 'card-validator';
import { useReservas } from "../../../shared/services/hooks/reservas/useReservas";
import { LoginContext } from "../../../shared/services/hooks/login/contexts/LoginContext";
import { usePagos } from "../../../shared/services/hooks/pagos/usePagos";
import { PagoDTO } from "../../../shared/models/dtos/PagoDTO";
import shortid from 'shortid';
import { enviarCorreo } from "../../../shared/services/hooks/emails/useEmail";

interface PagoScreenProps {
  navigation: any;
}

type ParamList = {
  Item: {
    instalacion?: Instalacion;
    evento?: Evento;
    partido?: Reserva;
    pista: Pista,
    horario: Horario,
    reserva: Reserva,
    fecha: string
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
  const { setPagando } = useContext(LoginContext);
  const { i18n } = useContext(I18nContext);
  const [methodType, setMethodType] = useState<PaymentMethodType | undefined>(undefined);
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [card, setCard] = useState<Tarjeta | undefined>(undefined);
  const { eliminarReserva } = useReservas();
  const { crearPago, obtenerTiposPagos } = usePagos();

  const NUM_CARD_REQUERIDO = t("NUM_CARD_REQUERIDO");
  const FECHA_EXP_REQUERIDA = t("FECHA_EXP_REQUERIDA");
  const CVV_REQUERIDO = t("CVV_REQUERIDO");

  const schema = yup.object().shape({
    numero: yup.string().required(NUM_CARD_REQUERIDO),
    fechaExp: yup.string().required(FECHA_EXP_REQUERIDA),
    cvv: yup.string().required(CVV_REQUERIDO)
  });

  const { control, handleSubmit, formState: { errors }, reset, setError } = useForm<Tarjeta>({
    resolver: yupResolver(schema),
    defaultValues: {
      numero: '',
      fechaExp: '',
      cvv: ''
    },
  });

  const onSubmit = () => {
    setPagando(true);
    var idpista = route.params.pista.idpista;
    var idevento = route.params.evento?.idevento;
    var idpartido = route.params.partido?.idreserva;
    var fecha = route.params.fecha;
    var precio: number = -1;
    var subtotal: number = -1;

    if (route.params.pista) {
      precio = route.params.pista.precio;
      subtotal = calcularPrecioSinIVA(precio, 21);
    } else if (route.params.evento) {
      precio = route.params.evento.precio;
      subtotal = calcularPrecioSinIVA(precio, 21);
    } else if (route.params.partido) {
      precio = route.params.partido.obtenerPista.precio / route.params.partido.maxparticipantes;
      subtotal = calcularPrecioSinIVA(precio, 21);
    }

    if (precio > -1 && subtotal > -1) {
      const pause = setTimeout(() => {
        obtenerTiposPagos().then((tipospagos) => {
          if (tipospagos.length > 0) {
            var tipopago = tipospagos.find(t => methodType == 'Tarjeta' ? t.nombre.includes("tarjeta") : t.nombre.includes("PayPal"));
            if (tipopago) {
              const guid = shortid.generate();
              var pago: PagoDTO = { subtotal: subtotal, total: precio, iva: 0.21, tipo_oid: tipopago?.idtipo, fecha: new Date(fecha), reserva_oid: route.params.reserva.idreserva, token: guid }
              crearPago(idpista, idevento, idpartido, new Date(fecha), pago).then((pago) => {
                if (pago) {
                  enviarCorreo(route.params.reserva.email, t("RESERVA_REALIZADA"),
                    `${t("RESERVA_REALIZADA_EXITO")}<br><br>
                  ${route.params.evento || route.params.partido ? ((route.params.evento && t("EVENTO")) || (route.params.partido && t("PARTIDO"))) + ": " + getName() + "<br>" : ""}
                  ${t("INSTALACION") + ": " + getInstalacion() + "<br>"}
                  ${t("PISTA") + ": " + route.params.pista.nombre + "<br>"}
                  ${t("FECHA") + ": " + new Date(route.params.reserva.fecha ? route.params.reserva.fecha : new Date()).toLocaleDateString() + "<br>"}
                  ${t("HORARIO") + ": " + formatTime(route.params.horario.inicio) + " - " + formatTime(route.params.horario.fin) + "<br>"}
                  ${t("PISTA") + ": " + route.params.pista.nombre + "<br>"}
                  ${t("PRECIO") + ": " + route.params.pista.precio + "<br>"}
                  `

                  );
                  finishPayment(true);
                  setPagando(false);
                } else {
                  const errormessage = t("NO_SE_PUEDE_RESERVAR");
                  const erroraplicacion = t("RESERVA_NO_DISPONIBLE");
                  Alert.alert(errormessage, erroraplicacion);
                  finishPayment(false);
                  setPagando(false);
                }
              });
            }
          }
        });
      }, 5000);
    }
  };

  const finishPayment = (payok: boolean) => {
    if (payok) {
      navigation.navigate("CompletedPago" as never);
    } else {
      if (route.params.reserva)
        eliminarReserva(route.params.reserva);
      if (route.params.instalacion) {
        navigation.navigate("Horario" as never, { instalacion: route.params.instalacion, previousPage: "Resumen" } as never)
      } else if (route.params.evento) {
        navigation.navigate("Horario" as never, { evento: route.params.evento, previousPage: "Resumen" } as never)
      } else if (route.params.partido) {
        navigation.navigate("Horario" as never, { partido: route.params.partido, previousPage: "Resumen" } as never)
      }
    }
  }

  function calcularPrecioSinIVA(precioConIVA: number, ivaPorcentaje: number): number {
    const ivaFactor = 1 + (ivaPorcentaje / 100);
    const precioSinIVA = precioConIVA / ivaFactor;
    return precioSinIVA;
  }

  function getPrecio(): number {
    if (route.params.instalacion)
      return route.params.pista.precio;
    else if (route.params.evento)
      return route.params.evento.precio;
    else if (route.params.partido)
      return route.params.partido.obtenerPista.precio / route.params.partido.maxparticipantes;
    else
      return 0;
  }

  const goBack = () => {
    if (route.params.reserva)
      eliminarReserva(route.params.reserva);
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

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     // if (route.params.instalacion) {
  //     //   setFecha(route.params.fecha ? route.params.fecha : filter?.fecha);
  //     //   setInstalacion(route.params.instalacion);
  //     //   obtenerPistas(route.params.fecha ? route.params.fecha : filter?.fecha);
  //     // }
  //     // setPista(route.params.pista);
  //     // setHorario(route.params.horario);
  //   });
  //   return unsubscribe;
  // }, [navigation, route.params]);

  // const toHorario = () => {
  //   navigation.navigate("Horario");
  // };

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

  function formatDate(date: Date | undefined) {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } else
      return undefined;
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

  const onSubmitCard = async (data: Tarjeta) => {

    if (cardValidator.number(data.numero).isValid) {
      setCard({ numero: data.numero, fechaExp: data.fechaExp, cvv: data.cvv });
      setMethodType('Tarjeta');
      setShowCardModal(false);
    } else {
      const NUMERO_TARJETA_INVALIDO = t("NUMERO_TARJETA_INVALIDO");
      setError('numero', {
        type: 'manual',
        message: NUMERO_TARJETA_INVALIDO,
      });
    }

  };

  const today = new Date();

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
                  <Text style={{ fontSize: 16 }} >{(route.params.evento && t("EVENTO")) || (route.params.partido && t("PARTIDO"))}: </Text>
                  <Text style={{ fontSize: 16 }} className="font-semibold">{getName()}</Text>
                </View>
              </>
            )}
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Text style={{ fontSize: 16 }} >{t("INSTALACION")}: </Text>
              <Text style={{ fontSize: 16 }} className="font-semibold" numberOfLines={3} ellipsizeMode="tail">{getInstalacion()}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Text style={{ fontSize: 16 }} >{t("PISTA")}: </Text>
              <Text style={{ fontSize: 16 }} className="font-semibold" numberOfLines={3} ellipsizeMode="tail">{route.params.pista.nombre}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Text style={{ fontSize: 16 }} >{t("FECHA")}: </Text>
              <Text style={{ fontSize: 16 }} className="font-semibold" numberOfLines={3} ellipsizeMode="tail">{new Date(route.params.reserva.fecha ? route.params.reserva.fecha : new Date()).toLocaleDateString()}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Text style={{ fontSize: 16 }} >{t("HORARIO")}: </Text>
              <Text style={{ fontSize: 16 }} className="font-semibold" numberOfLines={3} ellipsizeMode="tail">{formatTime(route.params.horario.inicio)} - {formatTime(route.params.horario.fin)}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Text style={{ fontSize: 16 }} >{t("PRECIO")}: </Text>
              <Text style={{ fontSize: 16 }} className="font-semibold" numberOfLines={3} ellipsizeMode="tail">{getPrecio()}€</Text>
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
                  <Pressable onPress={() => { reset(); setShowCardModal(true); }} style={[styles.selectButton, { marginLeft: 20 }]}>
                    <Text style={styles.boldText}>{t("TARJETA")}</Text>
                  </Pressable>
                </View>
              </>
            }
            {methodType &&
              <Pressable
                onPress={() => { setMethodType(undefined); setCard(undefined); }}
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
                      ......{card?.numero.substring(12)}
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
                  cvv={false}
                  rules={{
                    required: { value: true },
                    pattern: {
                      value: true
                    }
                  }}
                  errors={errors.numero && (
                    <Text className="text-error">{errors.numero.message}</Text>
                  )}
                  onSubmit={handleSubmit(onSubmitCard)}
                />
                <CustomMonthDateInput
                  nameController="fechaExp"
                  control={control}
                  label={t("FECHA_EXPIRACION")}
                  placeholder={t("INTRODUCE_LA_FECHA_EXPIRACION")}
                  minDate={formatDate(new Date())}
                  maxDate={formatDate(new Date(today.getFullYear() + 10, today.getMonth(), today.getDate()))}
                  rules={{
                    required: { value: true },
                    pattern: {
                      value: true
                    }
                  }}
                  errors={errors.fechaExp && (
                    <Text className="text-error">{errors.fechaExp.message}</Text>
                  )}
                  onSubmit={handleSubmit(onSubmitCard)}
                />
                <CustomCardInputText
                  nameController="cvv"
                  // ref={nombreInputRef}
                  control={control}
                  label={t("CVV")}
                  placeholder={t("INTRODUCE_EL_CVV")}
                  editable={true}
                  maxLength={4}
                  keyboardType={'numeric'}
                  cvv={true}
                  rules={{
                    required: { value: true },
                    pattern: {
                      value: true
                    }
                  }}
                  errors={errors.cvv && (
                    <Text className="text-error">{errors.cvv.message}</Text>
                  )}
                  onSubmit={handleSubmit(onSubmitCard)}
                />
              </View>

              <CustomButton
                onPress={handleSubmit(onSubmitCard)}
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