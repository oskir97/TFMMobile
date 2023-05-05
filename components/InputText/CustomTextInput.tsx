import { View, Text, TextInput } from "react-native";
import React from "react";
import { InputProps } from "../../tfmmobile";
import { useForm, Controller } from 'react-hook-form';
const CustomTextInput: React.FC<InputProps> = ({ label, icon, IsSecureText, keyboardType, placeholder, control, onSubmit, nameController, defaultValue, rules, errors, editable, maxLength
}) => {
  return (
    <View className="flex justify-start w-full mb-4">
      {label && (
        <Text className="text-[#EFE3C8] mb-2 text-[13px]">{label}</Text>
      )}
      <View className="w-full bg-[#171017] border-[#EFE3C850] border-[1px] rounded-md h-[57px] p-1 flex justify-center items-center flex-row ">
        {icon && (
          <View className="flex items-center justify-center h-[38px] w-[38px]">
            {icon}
          </View>
        )}
        <Controller
          control={control}
          name={nameController}
          defaultValue={defaultValue}
          rules={rules}
          render={({
            field: { onChange, onBlur, value }
          }) => (
            <TextInput autoCapitalize="none" className="flex flex-1 bg-transparent text-lg text-[#EFE3C895] h-[50px] pl-2" editable={editable} maxLength={maxLength}
              onChangeText={onChange} secureTextEntry={IsSecureText} keyboardType={keyboardType} placeholder={placeholder} onBlur={onBlur} value={value} onSubmitEditing={onSubmit}
              placeholderTextColor={"#EFE3C825"}
            />
          )}
        />
      </View>
      {errors}
    </View>
  );
};
export default CustomTextInput;
