import { View, Text, ScrollView, Pressable, Alert, } from "react-native";
import React, {useEffect} from "react";
import MainContainer from "../../components/Container/MainContainer";
import KeyboardAvoidWrapper from "../../components/Container/KeyboardAvoidWrapper";
import CustomTextInput from "../../components/InputText/CustomTextInput";

import { AtSymbolIcon, LockClosedIcon } from "react-native-heroicons/solid";
import CustomButton from "../../components/Buttons/CustomButton";

import { useForm } from 'react-hook-form';
import loginHook from "../../shared/services/hooks/login/useLogin";

const LoginScreen = (props:LoginProps) => {
  const { logFunction } = loginHook();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginData>({
    mode: "onChange",
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(({ email, password }) => {
    logFunction({email, password});
  });

  const register = () => props.navigation.navigate("Register");

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return (
    <MainContainer>
      <KeyboardAvoidWrapper>
        <View className="flex flex-row items-center justify-center gap-0 pt-[25%]">
          <Text className="text-3xl text-[#EFE3C8] font-semibold">Secure</Text>
          <Text className="text-3xl text-[#EFE3C850] font-semibold">App</Text>
        </View>
        <View className="flex flex-1 justify-center items-center pt-[20%] px-[25px]">
          <Text className="text-[#EFE3C8] text-md">
            Enter your account credentials
          </Text>
          <View className="h-[50px] w-full"></View>
          <CustomTextInput
            nameController="email"
            control={control}
            icon={<AtSymbolIcon color={"#EFE3C850"} width={35} height={35} />}
            label="Email"
            keyboardType={"email-address"}
            placeholder="Enter your email"
            editable={true}
            maxLength={75}
            rules={{
              required: { value: true, message: 'Email is requiered' },
              pattern: {
                value: EMAIL_REGEX,
                message: 'Not a valid email',
              },
            }}
            errors={errors.email && (
              <Text className="text-error">{errors.email.message}</Text>
            )}
          />
          <CustomTextInput
            nameController="password"
            control={control}
            icon={<LockClosedIcon color={"#EFE3C850"} width={35} height={35} />}
            label="Password"
            IsSecureText={true}
            keyboardType="default"
            placeholder="* * * * * * * *"
            editable={true}
            maxLength={255}
            rules={{ required: { value: true, message: 'Password is requried' } }}
            errors={errors.password && (
              <Text className="text-error">{errors.password.message}</Text>
            )}
          />
          <CustomButton
            onPress={onSubmit}
            buttonText="Login"
            buttonClassNames="w-full rounded-md p-3 bg-[#EFE3C8] flex justify-center items-center mt-5"
            textClassNames="text-[#4A2B29] text-[18px] font-semibold"
          // onPress={() => console.log(password)}
          />
          <CustomButton
            onPress={register}
            buttonText="Register"
            buttonClassNames="w-full rounded-md p-3 bg-transparent flex justify-center items-center mt-3 border-[1px] border-[#EFE3C8] border-solid"
            textClassNames="text-[#EFE3C8] text-[18px] font-semibold"
          // onPress={() => console.log(password)}
          />
          <View className="flex w-full justify-end items-end pt-4">
            <Pressable onPress={onSubmit}>
              <Text className="text-center text-gray-500 text-sm">
                Forgot your password?
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidWrapper>
    </MainContainer>
  );
};

export default LoginScreen;