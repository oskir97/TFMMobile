import { View, Pressable, StyleSheet, Modal, TouchableWithoutFeedback } from "react-native";
import DatePicker from 'react-native-modern-datepicker';
import { TextInput } from "react-native-paper";
import React, { useContext, useEffect, useState } from "react";
import { InputMonthDateProps } from "../../tfmmobile";
import { Controller } from 'react-hook-form';
import monthpickertrans from "../../translations/monthpicker/monthpickertrans";
import { I18nContext } from "react-i18next";
const CustomMonthDateInput: React.FC<InputMonthDateProps> = ({ label, placeholder, control, onSubmit, nameController, defaultValue, rules, errors, maxDate, minDate
}) => {

  const { i18n } = useContext(I18nContext);
  const [showPicker, setShowPicker] = useState(false);
  const [lang, setLang] = useState(monthpickertrans[i18n.language]);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  function formatYearAndMonthDate2(date: string): string {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    return `${year.toString().substring(2)}/${formattedMonth}`;
  }

  function formatYearAndMonth(date: string): string {
    const [year, month] = date.split(" ");
    const formattedMonth = month.padStart(2, '0');
    return `${formattedMonth}/${year}`;
  }

  function formatYearAndMonth2(date: string): string {
    const [year, month] = date.split(" ");
    const formattedMonth = month.padStart(2, '0');
    return `${year.substring(2)}/${formattedMonth}`;
  }

  useEffect(() => {
    const handleLanguageChange = () => {
      setLang(monthpickertrans[i18n.language])
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <View style={styles.formEntry}>
      <Controller
        control={control}
        name={nameController}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => (
          <>
            {showPicker && (
              <View style={styles.container}>
                <Modal transparent={false} visible={showPicker} animationType="fade">
                  <TouchableWithoutFeedback onPress={() => toggleDatepicker()}>
                    <View style={styles.modalContainer}>
                      <View style={styles.modal}>
                        <DatePicker
                          current={field.value?formatYearAndMonth2(field.value):formatYearAndMonthDate2(new Date().toString())}
                          locale={i18n.language}
                          minimumDate={minDate}
                          maximumDate={maxDate}
                          mode="monthYear"
                          // selectorStartingYear={new Date().getFullYear()}
                          onMonthYearChange={selectedDate => { field.onChange(selectedDate || maxDate); toggleDatepicker(); }}
                          options={{
                            mainColor: '#04D6C8'
                          }}
                        />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              </View>
            )}
            {!showPicker && (
              <Pressable onPress={toggleDatepicker}>
                <TextInput mode="outlined" label={label}
                  placeholder={placeholder} value={field.value ? formatYearAndMonth(field.value) : "MM/YYYY"} onSubmitEditing={onSubmit} editable={false} onPressIn={toggleDatepicker}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  progressBar: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
});
export default CustomMonthDateInput;
