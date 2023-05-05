import { View, Text, Platform } from "react-native";
import { Picker } from '@react-native-picker/picker';
import React from "react";
import { InputPickerProps } from "../../tfmmobile";
import { useForm, Controller } from 'react-hook-form';
import { useProvincias } from "../../services/hooks/postalCodes/usePostalCodes";

const CustomPickerInput: React.FC<InputPickerProps> = ({ label, icon, control, onSubmit, nameController, defaultValue, rules, errors, itemsMapping
}) => {
  return (
    <View className="flex justify-start w-full mb-4">
      {label && (
        <Text className="text-[#EFE3C8] mb-2 text-[13px]">{label}</Text>
      )}
      <View className="w-full bg-[#171017] text-[#EFE3C8] border-[#EFE3C850] border-[1px] rounded-md p-1 flex ">
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
            <Picker
            style={{ color: "#EFE3C895" }}
              selectedValue={value}
              onValueChange={(itemValue) => {
                onChange(itemValue);
              }}>
              <Picker.Item label={defaultValue} value="" />
              {itemsMapping}
            </Picker>
          )}
        />
      </View>
      {errors}
    </View>
  );
};
export default CustomPickerInput;
