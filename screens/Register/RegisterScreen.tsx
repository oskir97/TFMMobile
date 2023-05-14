import { View, Text, Pressable, Alert } from "react-native";
import React from "react";
import MainContainer from "../../components/Container/MainContainer";
import KeyboardAvoidWrapper from "../../components/Container/KeyboardAvoidWrapper";
import CustomTextInput from "../../components/InputText/CustomTextInput";
import { AtSymbolIcon, LockClosedIcon } from "react-native-heroicons/solid";
import CustomButton from "../../components/Buttons/CustomButton";
import { RegisterData, useRegister } from '../../shared/services/hooks/register/useRegister';
import CustomDateInput from "../../components/InputDate/CustomDateInput";
import PostalCodeInput from "../../components/PostalCode/PostalCodeInput";
import { Picker } from "@react-native-picker/picker";

const RegisterScreen = (props: RegisterProps) => {

  const { control, handleSubmit, formState, handleRegistro } = useRegister();

  const login = () => props.navigation.navigate("Login")

  const onSubmit = async (data: RegisterData) => {
    try {
      const result = await handleRegistro(data);
      if (result) {
        Alert.alert('Registro exitoso', '¡Bienvenido! Por favor inicia sesión');
        login();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <MainContainer>
      <KeyboardAvoidWrapper>
        <View className="flex flex-row items-center justify-center gap-0 pt-[25%]">
          <Text className="text-3xl text-[#EFE3C8] font-semibold">Secure</Text>
          <Text className="text-3xl text-[#EFE3C850] font-semibold">App</Text>
        </View>
        <View className="flex flex-1 justify-center items-center pt-[7%] px-[25px]">
          <Text className="text-[#EFE3C8] text-md">
            Introduce tus datos para registrarte!
          </Text>
          <View className="h-[30px] w-full"></View>

          <CustomTextInput
            nameController="nombre"
            control={control}
            label="Nombre"
            placeholder="Introduce tu nombre"
            editable={true}
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
            label="Apellidos"
            placeholder="Introduce tus apellidos"
            editable={true}
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
            icon={<AtSymbolIcon color={"#EFE3C850"} width={35} height={35} />}
            label="Email"
            keyboardType={"email-address"}
            placeholder="Introduce tu email"
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
          <CustomTextInput
            nameController="password"
            control={control}
            icon={<LockClosedIcon color={"#EFE3C850"} width={35} height={35} />}
            label="Contraseña"
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

          <CustomTextInput
            nameController="confirmPassword"
            control={control}
            icon={<LockClosedIcon color={"#EFE3C850"} width={35} height={35} />}
            label="Confirmar contraseña"
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
          <CustomTextInput
            nameController="domicilio"
            control={control}
            label="Domicilio"
            editable={true}
            placeholder="Introduce tu domicilio"
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
            nameController="telefono"
            control={control}
            label="Teléfono"
            placeholder="Introduce tu teléfono"
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
            label="Teléfono alternativo"
            placeholder="Introduce tu teléfono alternativo"
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
          <CustomDateInput
            nameController="fechaNacimiento"
            control={control}
            label="Fecha de nacimiento"
            placeholder="Introduce tu fecha de nacimiento"
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
          <PostalCodeInput
            nameControllerCodigoPostal="codigoPostal"
            nameControllerProvincia="provincia"
            nameControllerLocalidad="localidad"
            control={control}
            defaultValueProvincia="Seleccione una provincia"
            defaultValueLocalidad="Seleccione una localidad"
            editable={true}
            maxLength={5}
            rules={{
              required: { value: true },
              pattern: {
                value: true
              }
            }}
            errorsProvincia={formState.errors.provincia && (
              <Text className="text-error">{formState.errors.provincia.message}</Text>
            )}
            errorsLocalidad={formState.errors.localidad && (
              <Text className="text-error">{formState.errors.localidad.message}</Text>
            )}
            errorsCodigoPostal={formState.errors.codigoPostal && (
              <Text className="text-error">{formState.errors.codigoPostal.message}</Text>
            )}
            onSubmit={handleSubmit(onSubmit)}
          />
          <CustomButton
            buttonText="Register"
            buttonClassNames="w-full rounded-md p-3 bg-[#EFE3C8] flex justify-center items-center mt-5"
            textClassNames="text-[#4A2B29] text-[18px] font-semibold"
            onPress={handleSubmit(onSubmit)}
          />

          <View className="flex w-full justify-end items-end pt-4">
            <Pressable onPress={login}>
              <Text className="text-center text-gray-500 text-sm">
                ¿Ya tienes una cuenta?
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidWrapper>
    </MainContainer>
  );
};

export default RegisterScreen;