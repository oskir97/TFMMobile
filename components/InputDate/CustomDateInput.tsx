import { View, Text, Pressable, Platform, StyleSheet } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
// import MonthPicker from 'react-native-month-year-picker';
import { TextInput } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { InputDateProps } from "../../tfmmobile";
import { Controller, useController } from 'react-hook-form';
const CustomDateInput: React.FC<InputDateProps> = ({ label, icon, mode, placeholder, control, onSubmit, nameController, defaultValue, rules, errors, maxDate, minDate
}) => {

  const [showPicker, setShowPicker] = useState(false);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const toMonthYearString = (date: Date) => {

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${month.toString().padStart(2, '0')}/${year.toString()}`;
  }

  return (
    <View style={styles.formEntry}>
      <Controller
        control={control}
        name={nameController}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => (
          <>
            {showPicker && mode != 'month' && (
              <DateTimePicker className="flex flex-1 bg-transparent text-lg text-[#EFE3C895] h-[50px] pl-2" mode={mode} display={'spinner'} maximumDate={maxDate} minimumDate={minDate}
                value={field.value} onChange={({ type }, selectedDate) => {
                  if (type == "set") {
                    field.onChange(selectedDate || maxDate);

                    if (Platform.OS === "android") {
                      toggleDatepicker();
                    }
                  } else {
                    toggleDatepicker();
                  }
                }} />
            )}
            {/* {showPicker && mode == 'month' && (
              <MonthPicker maximumDate={maxDate} minimumDate={minDate}
                value={field.value} onChange={(selectedDate) => {
                  field.onChange(selectedDate || maxDate);
                  toggleDatepicker();
                }} />
            )} */}
            {!showPicker && (
              <Pressable onPress={toggleDatepicker}>
                <TextInput mode="outlined" label={label}
                  placeholder={placeholder} value={mode == 'month' ? toMonthYearString(field.value) : field.value.toLocaleDateString()} onSubmitEditing={onSubmit} editable={false} onPressIn={toggleDatepicker}
                  placeholderTextColor={"#EFE3C825"} />
              </Pressable>
            )}
          </>
        )}
      />
      {errors}
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    margin: 8,
  },
  formEntry: {
    margin: 8,
  },
  container: {
    flex: 1,
  },
  progressBar: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
});
export default CustomDateInput;
