import { View, Text, Pressable } from "react-native";
import React from "react";
import MainContainer from "../../components/Container/MainContainer";
import KeyboardAvoidWrapper from "../../components/Container/KeyboardAvoidWrapper";
import CustomTextInput from "../../components/InputText/CustomTextInput";
import { AtSymbolIcon, LockClosedIcon } from "react-native-heroicons/solid";
import CustomButton from "../../components/Buttons/CustomButton";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required'),
    surnames: Yup.string()
      .required('Surnames are required'),
    email: Yup.string()
      .required('Email is required')
      .email('Not a valid email'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    password2: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match')

  });

const Register = (props:RegisterProps) => {

  const login = () => props.navigation.navigate("Login")

  const { control, handleSubmit, formState } = useForm<RegisterData>({
    mode: "onChange",
    defaultValues: {
      name: '',
      surnames: '',
      email: '',
      password: '',
      password2: ''
    },
    resolver: yupResolver(validationSchema)
  });
  const { errors } = formState;

  const onSubmit = handleSubmit(({ name, surnames, email, password }) => {
    alert({ name, surnames, email, password });
  });

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return (
    <MainContainer>
      <KeyboardAvoidWrapper>
        <View className="flex flex-row items-center justify-center gap-0 pt-[25%]">
          <Text className="text-3xl text-[#EFE3C8] font-semibold">Secure</Text>
          <Text className="text-3xl text-[#EFE3C850] font-semibold">App</Text>
        </View>
        <View className="flex flex-1 justify-center items-center pt-[7%] px-[25px]">
          <Text className="text-[#EFE3C8] text-md">
            Enter your account details to register
          </Text>
          <View className="h-[30px] w-full"></View>

          <CustomTextInput
            nameController="name"
            control={control}
            label="Name"
            placeholder="Enter your name"
            rules={{
              required: { value: true, message: 'Name is requiered' }
            }}
            errors={errors.name && (
              <Text className="text-error">{errors.name.message}</Text>
            )}
            onSubmit={onSubmit}
          />
          <CustomTextInput
            nameController="surnames"
            control={control}
            label="Surnames"
            placeholder="Enter your surname"
            rules={{
              required: { value: true, message: 'Surname is requiered' }
            }}
            errors={errors.surnames && (
              <Text className="text-error">{errors.surnames.message}</Text>
            )}
            onSubmit={onSubmit}
          />
          <CustomTextInput
            nameController="email"
            control={control}
            icon={<AtSymbolIcon color={"#EFE3C850"} width={35} height={35} />}
            label="Email"
            keyboardType={"email-address"}
            placeholder="Enter your email"
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
            onSubmit={onSubmit}
          />
          <CustomTextInput
            nameController="password"
            control={control}
            icon={<LockClosedIcon color={"#EFE3C850"} width={35} height={35} />}
            label="Password"
            IsSecureText={true}
            keyboardType="default"
            placeholder="* * * * * * * *"
            rules={{ required: { value: true, message: 'Password is requried' } }}
            errors={errors.password && (
              <Text className="text-error">{errors.password.message}</Text>
            )}
            onSubmit={onSubmit}
          />

          <CustomTextInput
            nameController="password2"
            control={control}
            icon={<LockClosedIcon color={"#EFE3C850"} width={35} height={35} />}
            label="Confirm Password"
            IsSecureText={true}
            keyboardType="default"
            placeholder="* * * * * * * *"
            rules={{ required: { value: true, message: 'Confirm Password is requried' } }}
            errors={errors.password2 && (
              <Text className="text-error">{errors.password2.message}</Text>
            )}
            onSubmit={onSubmit}
          />
          <CustomButton
            buttonText="Register"
            buttonClassNames="w-full rounded-md p-3 bg-[#EFE3C8] flex justify-center items-center mt-5"
            textClassNames="text-[#4A2B29] text-[18px] font-semibold"
            onPress={onSubmit}
          />

          <View className="flex w-full justify-end items-end pt-4">
            <Pressable onPress={login}>
              <Text className="text-center text-gray-500 text-sm">
                Already have an account?
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidWrapper>
    </MainContainer>
  );
};

export default Register;