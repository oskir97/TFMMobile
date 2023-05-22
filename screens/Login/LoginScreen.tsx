import { View, Text, ScrollView, Pressable, Alert, ImageBackground, } from "react-native";
import React, { useEffect } from "react";
import MainContainer from "../../components/Container/MainContainer";
import KeyboardAvoidWrapper from "../../components/Container/KeyboardAvoidWrapper";
import CustomTextInput from "../../components/InputText/CustomTextInput";

import { AtSymbolIcon, LockClosedIcon } from "react-native-heroicons/solid";
import CustomButton from "../../components/Buttons/CustomButton";

import { useForm } from 'react-hook-form';
import loginHook from "../../shared/services/hooks/login/useLogin";
import CustomPasswordTextInput from "../../components/InputPasswordText/CustomPasswordTextInput";

const LoginScreen = (props: LoginProps) => {
  const { logFunction } = loginHook();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginData>({
    mode: "onChange",
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(({ email, password }) => {
    logFunction({ email, password });
  });

  const register = () => props.navigation.navigate("Register");

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 30 }}>
          <ImageBackground source={require('../../assets/images/logo.png')} style={{ height: 150, width: 150 }} imageStyle={{ borderRadius: 10 }}></ImageBackground>
        </View>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 25}}>
        <Text className="text-3xl text-[#106F69] font-semibold">Juega </Text>
          <Text className="text-3xl text-[#04D6C8] font-semibold">Entretente</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 10 }}>
          <Text className="text-md">
            Introduce tu usuario
          </Text>
        </View>
        <CustomTextInput
          nameController="email"
          control={control}
          label="Email"
          keyboardType={"email-address"}
          placeholder="Introduce tu email"
          editable={true}
          maxLength={75}
          rules={{
            required: { value: true, message: 'El email es requerido' },
            pattern: {
              value: EMAIL_REGEX,
              message: 'No es un email válido',
            },
          }}
          errors={errors.email && (
            <Text className="text-error">{errors.email.message}</Text>
          )}
        />
        <CustomPasswordTextInput
          nameController="password"
          control={control}
          label="Contraseña"
          IsSecureText={true}
          keyboardType="default"
          placeholder="* * * * * * * *"
          editable={true}
          maxLength={255}
          rules={{ required: { value: true, message: 'La contraseña es requerida' } }}
          errors={errors.password && (
            <Text className="text-error">{errors.password.message}</Text>
          )}
        />
        <CustomButton
          onPress={onSubmit}
          buttonText="Iniciar sesión"
          colorButtom='#04D6C8'
          colorText='white'
          colorButtomHover="#04D6C8"
          colorTextHover="white"
          
        // onPress={() => console.log(password)}
        />
        <CustomButton
          onPress={register}
          buttonText="Registrarse"
          colorButtom='transparent'
          colorText='#04D6C8'
          colorButtomHover="#04D6C850"
          colorTextHover="white"
        // onPress={() => console.log(password)}
        />
        <View style={{marginRight:8}}>
        <View className="flex w-full justify-end items-end pt-4">
          <Pressable onPress={onSubmit}>
            <Text style={{color:'#106F69'}} className="text-center text-gray-500 text-sm">
              ¿Has olvidado tu contraseña?
            </Text>
          </Pressable>
        </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;