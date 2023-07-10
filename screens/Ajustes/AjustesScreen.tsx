import { View, Text, Alert, ImageBackground, Keyboard, BackHandler } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import KeyboardAvoidWrapper from "../../components/Container/KeyboardAvoidWrapper";
import CustomTextInput from "../../components/InputText/CustomTextInput";
import CustomButton from "../../components/Buttons/CustomButton";
import { ajustesData, useAjustes } from '../../shared/services/hooks/ajustes/useAjustes';
import CustomDateInput from "../../components/InputDate/CustomDateInput";
import CustomPasswordTextInput from "../../components/InputPasswordText/CustomPasswordTextInput";
import { Ubication } from "../../shared/models/Ubication";
import CustomInputModalMaps from "../../components/Modals/CustomInputModalMaps";
import { I18nContext, useTranslation } from "react-i18next";
import Menu from "../../components/Menu/Menu";
import { useFocusEffect } from "@react-navigation/native";

interface AjusteProps {
    navigation: any;
}

const AjusteScreen = (props: AjusteProps) => {

    const { control, handleSubmit, formState, handleRegistro, setValue, errors, register, reset } = useAjustes();
    const [locationOpen, setLocationOpen] = useState(false);
    const [location, setLocation] = useState<Ubication>({ codigoPostal: "", localidad: "", provincia: "", domicilio: "" });

    const { t } = useTranslation();
    const { i18n } = useContext(I18nContext);

    useEffect(() => {
        register('fieldName', { required: false });
    }, [register]);

    const handleLocation = (location: Ubication) => {
        Keyboard.dismiss();
        setLocation(location);
        setValue('domicilio', `${location.domicilio}`);
        setLocationOpen(false);
    }

    const login = () => props.navigation.navigate("Login");

    const onSubmit = async (data: ajustesData) => {
        try {
            data.codigoPostal = location.codigoPostal;
            data.provincia = location.provincia;
            data.localidad = location.localidad;

            const result = await handleRegistro(data);

            const registroExitoso = t("REGISTRO_EXITOSO");
            const bienvenidoIniciaSesion = t("BIENVENIDO_INICIA_SESION");

            if (result) {
                if (registroExitoso && bienvenidoIniciaSesion) {
                    Alert.alert(registroExitoso, bienvenidoIniciaSesion);
                }

                login();
            } else {
                const ERROR_REGISTRO = t("ERROR_REGISTRO");
                const SE_PRODUCIDO_ERROR = t("SE_PRODUCIDO_ERROR");
                if (ERROR_REGISTRO && SE_PRODUCIDO_ERROR) {
                    Alert.alert(ERROR_REGISTRO, SE_PRODUCIDO_ERROR);
                }
            }
        } catch (error: any) {
            console.log(error.message);
            const errormessage = t("ERROR");
            const erroraplicacion = t("ERROR_APLICACION");
            console.log("error en ajustes");
            Alert.alert(errormessage, erroraplicacion);
        }
    };

    useEffect(() => {
        const handleLanguageChange = () => {
            Object.keys(errors).forEach((fieldName) => {
                reset({ [fieldName]: '' });
            });
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n]);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                goBack();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [props.navigation])
    );

    const goBack = () => {
        props.navigation.navigate("Inicio" as never)
    };

    return (
        <>
            <Menu showReturnWizard={true} showLang={true} text={t("RESERVAR")} showusuario={true} userMenu={() => props.navigation.openDrawer()} functionGoBack={goBack} />
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', marginBottom: 10, marginLeft: 20, marginTop:20 }}>
                    <Text style={{ fontSize: 20 }} className="font-semibold mt-1">{t("MODIFICAR_USUARIO")}</Text>
                </View>
                <KeyboardAvoidWrapper>
                    <View style={{ paddingHorizontal: 16, marginBottom: 30 }}>

                        <CustomTextInput
                            nameController="nombre"
                            // ref={nombreInputRef}
                            control={control}
                            label={t("NOMBRE")}
                            placeholder={t("INTRODUCE_NOMBRE")}
                            editable={true}
                            autoCapitalize={'words'}
                            maxLength={50}
                            rules={{
                                required: { value: true },
                                pattern: {
                                    value: true
                                }
                            }}
                            errors={formState.errors.nombre && (
                                <Text className="text-error">{formState.errors.nombre.message}</Text>
                            )}
                            onSubmit={handleSubmit(onSubmit)}
                        />
                        <CustomTextInput
                            nameController="apellidos"
                            control={control}
                            label={t("APELLIDOS")}
                            placeholder={t("INTRODUCE_APELLIDOS")}
                            editable={true}
                            autoCapitalize={'words'}
                            maxLength={100}
                            rules={{
                                required: { value: true },
                                pattern: {
                                    value: true
                                }
                            }}
                            errors={formState.errors.apellidos && (
                                <Text className="text-error">{formState.errors.apellidos.message}</Text>
                            )}
                            onSubmit={handleSubmit(onSubmit)}
                        />
                        <CustomTextInput
                            nameController="email"
                            control={control}
                            label={t("EMAIL")}
                            keyboardType={"email-address"}
                            placeholder={t("INTRODUCE_EMAIL")}
                            editable={true}
                            maxLength={75}
                            rules={{
                                required: { value: true },
                                pattern: {
                                    value: true
                                },
                            }}
                            errors={formState.errors.email && (
                                <Text className="text-error">{formState.errors.email.message}</Text>
                            )}
                            onSubmit={handleSubmit(onSubmit)}
                        />
                        <CustomPasswordTextInput
                            nameController="password"
                            control={control}
                            label={t("PASSWORD")}
                            IsSecureText={true}
                            keyboardType="default"
                            placeholder="* * * * * * * *"
                            editable={true}
                            maxLength={255}
                            rules={{
                                required: { value: true },
                                pattern: {
                                    value: true
                                }
                            }}
                            errors={formState.errors.password && (
                                <Text className="text-error">{formState.errors.password.message}</Text>
                            )}
                            onSubmit={handleSubmit(onSubmit)}
                        />

                        <CustomPasswordTextInput
                            nameController="confirmPassword"
                            control={control}
                            label={t("CONFIRMAR_PASSWORD")}
                            IsSecureText={true}
                            keyboardType="default"
                            placeholder="* * * * * * * *"
                            editable={true}
                            rules={{ required: { value: true } }}
                            maxLength={255}
                            errors={formState.errors.confirmPassword && (
                                <Text className="text-error">{formState.errors.confirmPassword.message}</Text>
                            )}
                            onSubmit={handleSubmit(onSubmit)}
                        />
                        <CustomDateInput
                            nameController="fechaNacimiento"
                            control={control}
                            label={t("FECHA_NACIMIENTO")}
                            placeholder={t("FECHA_NACIMIENTO")}
                            mode="date"
                            maxDate={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)}
                            rules={{
                                required: { value: true },
                                pattern: {
                                    value: true
                                }
                            }}
                            errors={formState.errors.fechaNacimiento && (
                                <Text className="text-error">{formState.errors.fechaNacimiento.message}</Text>
                            )}
                            onSubmit={handleSubmit(onSubmit)}
                        />
                        <CustomTextInput
                            nameController="telefono"
                            control={control}
                            label={t("TELEFONO")}
                            placeholder={t("INTRODUCE_TELEFONO")}
                            editable={true}
                            maxLength={9}
                            rules={{
                                required: { value: true },
                                pattern: {
                                    value: true
                                }
                            }}
                            errors={formState.errors.telefono && (
                                <Text className="text-error">{formState.errors.telefono.message}</Text>
                            )}
                            onSubmit={handleSubmit(onSubmit)}
                        />
                        <CustomTextInput
                            nameController="telefonoAlternartivo"
                            control={control}
                            label={t("TELEFONO_ALTERNATIVO")}
                            placeholder={t("INTRODUCE_TELEFONO_ALTERNATIVO")}
                            editable={true}
                            maxLength={9}
                            rules={{
                                required: { value: true },
                                pattern: {
                                    value: true
                                }
                            }}
                            errors={formState.errors.telefonoAlternartivo && (
                                <Text className="text-error">{formState.errors.telefonoAlternartivo.message}</Text>
                            )}
                            onSubmit={handleSubmit(onSubmit)}
                        />
                        <CustomTextInput
                            nameController="domicilio"
                            // icon="map-marker-plus"
                            control={control}
                            label={t("DOMICILIO")}
                            editable={true}
                            valueAssign={location.domicilio}
                            onPressIn={() => { setLocationOpen(true); }}
                            placeholder={t("INTRODUCE_DOMICILIO")}
                            // onSelectIcon={() => setLocationOpen(true)}
                            maxLength={128}
                            rules={{
                                required: { value: true },
                                pattern: {
                                    value: true
                                }
                            }}
                            errors={formState.errors.domicilio && (
                                <Text className="text-error">{formState.errors.domicilio.message}</Text>
                            )}
                            onSubmit={handleSubmit(onSubmit)}
                        />
                        <CustomTextInput
                            nameController="numero"
                            control={control}
                            label={t("NUMERO_DOMICILIO")}
                            placeholder={t("INTRODUCE_NUMERO")}
                            editable={true}
                            maxLength={50}
                            rules={{
                                required: { value: true },
                                pattern: {
                                    value: true
                                }
                            }}
                            errors={formState.errors.numero && (
                                <Text className="text-error">{formState.errors.numero.message}</Text>
                            )}
                            onSubmit={handleSubmit(onSubmit)}
                        />

                        <CustomButton
                            onPress={handleSubmit(onSubmit)}
                            buttonText={t("MODIFICAR")}
                            colorButtom='#04D6C8'
                            colorText='white'
                            colorButtomHover="#04D6C8"
                            colorTextHover="white"

                        // onPress={() => console.log(password)}
                        />
                        <CustomButton
                            onPress={goBack}
                            buttonText={t("CANCELAR")}
                            colorButtom='transparent'
                            colorText='#04D6C8'
                            colorButtomHover="#04D6C850"
                            colorTextHover="white"
                        // onPress={() => console.log(password)}
                        />
                    </View>
                </KeyboardAvoidWrapper>
                <CustomInputModalMaps login={true} visible={locationOpen} setVisible={setLocationOpen} animationType={"none"} title={t("MODIFICAR_UBICACION")} lastlocation={location.domicilio} onConfirm={handleLocation} onCancel={() => setLocationOpen(false)} />
            </View>
        </>
    );
};

export default AjusteScreen;