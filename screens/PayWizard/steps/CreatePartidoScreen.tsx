import React, { useContext, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Platform, BackHandler, Alert } from "react-native";
import { MD3Colors, ProgressBar } from "react-native-paper";
import { PaperSelect } from 'react-native-paper-select';
import { I18nContext, useTranslation } from "react-i18next";
import CustomButton from "../../../components/Buttons/CustomButton";
import Menu from "../../../components/Menu/Menu";
import { Instalacion } from "../../../shared/models/Instalacion";
import { Evento } from "../../../shared/models/Evento";
import { Reserva } from "../../../shared/models/Reserva";
import { Deporte } from "../../../shared/models/Deporte";
import { LoginContext } from "../../../shared/services/hooks/login/contexts/LoginContext";
import { FlatList } from "react-native-gesture-handler";
import { useHorarios } from "../../../shared/services/hooks/horarios/useHorarios";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Horario } from "../../../shared/models/Horario";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { Pista } from "../../../shared/models/Pista";
import { ReservaDTO, TipoReservaEnum } from "../../../shared/models/dtos/ReservaDTO";
import { useReservas } from "../../../shared/services/hooks/reservas/useReservas";
import SportTypes from "../../../components/SportTypes/SportTypes";
import CustomTextInput from "../../../components/InputText/CustomTextInput";
import { Controller, useForm } from "react-hook-form";
import { SelectedItem } from "react-native-paper-select/lib/typescript/interface/paperSelect.interface";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

interface PartidoData {
    descripcion: string;
    nivel: string;
    maxparticipantes: string;
}

interface UbicationScreenProps {
    navigation: any;
}

const CreatePartidoScreen: React.FC<UbicationScreenProps> = ({ navigation }) => {
    const { filter, user } = useContext(LoginContext);
    const [nivel, setNivel] = useState<string | undefined>(undefined);
    const [deporteAsignado, setDeporteAsignado] = useState<Deporte | undefined>();

    const { t } = useTranslation();
    const { i18n } = useContext(I18nContext);

    const INTRODUCE_DESCRIPCION = t("INTRODUCE_DESCRIPCION");
    const SELECCIONAR_NIVEL_DIFICULTAD = t("SELECCIONAR_NIVEL_DIFICULTAD");
    const SELECCIONAR_MAX_PARTIPANTES = t("SELECCIONAR_MAX_PARTIPANTES");

    const schema = yup.object().shape({
        descripcion: yup.string().required(INTRODUCE_DESCRIPCION),
        nivel: yup.string().required(SELECCIONAR_NIVEL_DIFICULTAD),
        maxparticipantes: yup.string().required(SELECCIONAR_MAX_PARTIPANTES),
    });

    const { control, register, reset, handleSubmit, formState: { errors } } = useForm<PartidoData>({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            descripcion: '',
            nivel: '',
            maxparticipantes: ''
          },

    });

    const onSubmit = (data: PartidoData) => {
        console.log(data);

    };

    const goBack = () => {
        navigation.navigate("Partidos" as never)
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
            reset();
        });
        return unsubscribe;
    }, [navigation]);

    const translations = {
        acceptLabel: t("ACEPTAR"),
        cancelLabel: t("CANCELAR"),
        placeholder: t("BUSCAR"),
        error: t("ERROR_APLICACION")
    };

    const arraylist = [{ value: t("BASICO"), _id: "1" }, { value: t("MEDIO"), _id: "2" }, { value: t("AVANZADO"), _id: "3" }];

    return (
        <>
            <Menu showReturnWizard={true} showLang={true} text={t("MIS_PARTIDOS")} showusuario={true} userMenu={() => navigation.openDrawer()} functionGoBack={goBack} />
            <View style={styles.container}>
                <ProgressBar
                    style={styles.progressBar}
                    progress={0}
                    color={MD3Colors.primary60}
                />
                <View style={{ flex: 1, justifyContent: 'space-between', margin: 20 }}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ fontSize: 24 }} className="font-semibold mt-1">{t("CREAR_PARTIDO")}</Text>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <CustomTextInput
                                nameController="descripcion"
                                control={control}
                                label={t("DESCRIPCION")}
                                placeholder={t("INTRODUCE_DESCRIPCION")}
                                editable={true}
                                maxLength={4000}
                                numberLines={4}
                                autoCapitalize={'sentences'}
                                rules={{
                                    required: { value: true },
                                    pattern: {
                                        value: true
                                    }
                                }}
                                errors={errors.descripcion && (
                                    <Text style={{ color: 'red' }}>{errors.descripcion.message}</Text>
                                )}
                                onSubmit={handleSubmit(onSubmit)}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10 }}>
                            <Text style={{ fontSize: 12, marginLeft: 10 }}>{t("SELECCIONA_DEPORTE")}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                            <SportTypes setSelectedDeporte={setDeporteAsignado} selectedDeporte={deporteAsignado} iddeporte={filter && filter.deporte ? filter.deporte : undefined} vertical={false} />
                            {!deporteAsignado && (
                                    <Text style={{ color: 'red' }}>{t("SELECCIONA_DEPORTE")}</Text>
                                )}
                        </View>
                        <View style={{marginLeft:10, marginRight:10, marginBottom:10}}>
                            <Controller
                                control={control}
                                name="nivel"
                                rules={{
                                    required: true
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <PaperSelect
                                        label={t("SELECCIONAR_NIVEL_DIFICULTAD")}
                                        dialogCloseButtonText={translations.cancelLabel}
                                        dialogDoneButtonText={translations.acceptLabel}
                                        dialogCloseButtonStyle={{ color: "grey" }}
                                        dialogDoneButtonStyle={{ color: "#04D6C8" }}
                                        checkboxProps={{
                                            checkboxColor: "#04D6C8"
                                        }}
                                        searchText={translations.placeholder}
                                        value={nivel ? arraylist.find(r => r._id == nivel).value : ""}
                                        onSelection={(value: any) => {
                                            if (value.selectedList.length > 0) {
                                                setNivel(value.selectedList[0]._id);
                                                onChange(value.selectedList[0]._id);
                                            }
                                        }}
                                        arrayList={arraylist}
                                        multiEnable={false}
                                        theme={{
                                            colors: {
                                                placeholder: 'black'
                                            }
                                        }} selectedArrayList={[]} />
                                )}
                            />
                            {errors.nivel && (
                                <Text className="text-error">{errors.nivel.message}</Text>
                            )}
                        </View>
                        <View>
                            <CustomTextInput
                                nameController="maxparticipantes"
                                control={control}
                                label={t("MAX_PARTIPANTES")}
                                placeholder={t("SELECCIONAR_MAX_PARTIPANTES")}
                                editable={true}
                                maxLength={5}
                                keyboardType="numeric"
                                rules={{
                                    required: { value: true },
                                    pattern: {
                                        value: true
                                    }
                                }}
                                errors={errors.maxparticipantes && (
                                    <Text className="text-error">{errors.maxparticipantes.message}</Text>
                                )}
                                onSubmit={handleSubmit(onSubmit)}
                            />
                        </View>
                    </View>

                    <CustomButton
                        onPress={handleSubmit(onSubmit)}
                        buttonText={t("DEPORTE")}
                        colorButtom='#04D6C8'
                        colorText='white'
                        colorButtomHover="#04D6C8"
                        colorTextHover="white"
                        iconRight="chevron-right"
                        animated={true}
                        visible={!errors.descripcion && !errors.nivel && deporteAsignado != undefined}
                    />
                </View>
            </View>
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

export default CreatePartidoScreen;