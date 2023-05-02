import { View, Text, TextInput, Pressable, Platform } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from "react";
import { InputDateProps } from "../../tfmmobile";
import { Controller, useController } from 'react-hook-form';
const CustomDateInput: React.FC<InputDateProps> = ({ label, icon, mode, placeholder, control, onSubmit, nameController, defaultValue, rules, errors
}) => {
  const maxDate: Date = new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000);

  const [showPicker, setShowPicker] = useState(false);

  const toggleDatepicker = ()=>{
    setShowPicker(!showPicker);
    console.log(showPicker);
  };

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
          render={({ field}) => (
            <>
              {showPicker && (
                <DateTimePicker className="flex flex-1 bg-transparent text-lg text-[#EFE3C895] h-[50px] pl-2" mode={mode} display={'spinner'} maximumDate={maxDate}
                value={field.value} onChange={({type}, selectedDate) => {
                  if(type == "set"){
                    field.onChange(selectedDate || maxDate);
  
                    if(Platform.OS === "android"){
                      toggleDatepicker();
                    }
                  }else{
                    toggleDatepicker();
                  }
                }} />
              )}
              {!showPicker && (
                <Pressable onPress={toggleDatepicker}>
                <TextInput className="flex flex-1 bg-transparent text-lg text-[#EFE3C895] h-[50px] pl-2"
                  placeholder={placeholder} value={field.value.toLocaleDateString()} onSubmitEditing={onSubmit} editable={false} onPressIn={toggleDatepicker}
                  placeholderTextColor={"#EFE3C825"} />
                </Pressable>
              )}
            </>
          )}
        />
      </View>
      {errors}
    </View>
  );
};
export default CustomDateInput;
