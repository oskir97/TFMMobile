import { View, Text, ScrollView, Pressable, Alert, ImageBackground, } from "react-native";
import React, { useContext, useEffect } from "react";
import MainContainer from "../../components/Container/MainContainer";
import KeyboardAvoidWrapper from "../../components/Container/KeyboardAvoidWrapper";
import CustomTextInput from "../../components/InputText/CustomTextInput";

import { AtSymbolIcon, LockClosedIcon } from "react-native-heroicons/solid";
import CustomButton from "../../components/Buttons/CustomButton";

import { useForm } from 'react-hook-form';
import loginHook from "../../shared/services/hooks/login/useLogin";
import CustomPasswordTextInput from "../../components/InputPasswordText/CustomPasswordTextInput";
import { useTranslation, I18nContext } from "react-i18next";
import Menu from "../../components/Menu/Menu";

const LoginScreen = (props: LoginProps) => {
  const { logFunction } = loginHook();

  const { control, register, reset, handleSubmit, formState: { errors } } = useForm<LoginData>({
    mode: "onChange",
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    register('fieldName', { required: false });
  }, [register]);

  const onSubmit = async (data: LoginData) => {
    try {
      logFunction(data);
    } catch (error: any) {
      const errormessage = t("ERROR");
      const erroraplicacion = t("ERROR_APLICACION");
      console.log("error en login screen");
      Alert.alert(errormessage, erroraplicacion);
    }
  };

  const toregister = () => props.navigation.navigate("Register");

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const { t } = useTranslation();
  const { i18n } = useContext(I18nContext);

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

  return (
    <>
    <Menu showReturnWizard={false} showLang={true}/>
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 30 }}>
          <ImageBackground source={require('../../assets/images/logo.png')} style={{ height: 160, width: 190 }} imageStyle={{ borderRadius: 10 }}></ImageBackground>
        </View>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 25 }}>
          <Text className="text-3xl text-[#106F69] font-semibold">{t("JUEGA")}</Text>
          <Text className="text-3xl text-[#04D6C8] font-semibold">{` ${t("ENTRETENTE")}`}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 10 }}>
          <Text className="text-md">
            {t("INTRODUCE_TU_USUARIO")}
          </Text>
        </View>
        <CustomTextInput
          nameController="email"
          control={control}
          label={t("EMAIL")}
          keyboardType={"email-address"}
          placeholder={t("INTRODUCE_EMAIL")}
          editable={true}
          maxLength={75}
          rules={{
            required: { value: true, message: t("CORREO_REQUERIDO") },
            pattern: {
              value: EMAIL_REGEX,
              message: t("CORREO_VALIDO"),
            },
          }}
          errors={errors.email && (
            <Text className="text-error">{errors.email.message}</Text>
          )}
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
          rules={{ required: { value: true, message: t("PASSWORD_REQUERIDA") } }}
          errors={errors.password && (
            <Text className="text-error">{errors.password.message}</Text>
          )}
        />
        <CustomButton
          onPress={handleSubmit(onSubmit)}
          buttonText={t("INICIAR_SESION")}
          colorButtom='#04D6C8'
          colorText='white'
          colorButtomHover="#04D6C8"
          colorTextHover="white"

        // onPress={() => console.log(password)}
        />
        <CustomButton
          onPress={toregister}
          buttonText={t("REGISTRARSE")}
          colorButtom='transparent'
          colorText='#04D6C8'
          colorButtomHover="#04D6C850"
          colorTextHover="white"
        // onPress={() => console.log(password)}
        />
        {/* <View style={{ marginRight: 8 }}>
          <View className="flex w-full justify-end items-end pt-4">
            <Pressable onPress={handleSubmit(onSubmit)}>
              <Text style={{ color: '#106F69' }} className="text-center text-gray-500 text-sm">
                {t("HAS_OLVIDADO_PASSWORD")}
              </Text>
            </Pressable>
          </View>
        </View> */}
      </View>
    </View>
    </>
  );
};

export default LoginScreen;