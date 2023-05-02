import { View, Text, ScrollView, Pressable, Alert, } from "react-native";
import React, {useEffect} from "react";
import MainContainer from "../../components/Container/MainContainer";
import KeyboardAvoidWrapper from "../../components/Container/KeyboardAvoidWrapper";
import CustomTextInput from "../../components/InputText/CustomTextInput";

import { AtSymbolIcon, LockClosedIcon } from "react-native-heroicons/solid";
import CustomButton from "../../components/Buttons/CustomButton";

import { useForm } from 'react-hook-form';
import loginHook from "../../services/hooks/login/useLogin";

import { useNavigation } from '@react-navigation/native';
import { NavStackParamList } from "../../tfmmobile";

const Loading = (props:LoginProps) => {

  return (
    <MainContainer>
      <KeyboardAvoidWrapper>
        <View className="flex flex-row items-center justify-center gap-0 pt-[25%]">
          <Text className="text-3xl text-[#EFE3C8] font-semibold">Secure</Text>
          <Text className="text-3xl text-[#EFE3C850] font-semibold">App</Text>
        </View>
        <View className="flex flex-1 justify-center items-center pt-[20%] px-[25px]">
          <Text className="text-[#EFE3C8] text-md">
            Loading
          </Text>
        </View>
      </KeyboardAvoidWrapper>
    </MainContainer>
  );
};

export default Loading;