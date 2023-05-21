import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import React, { useState } from "react";
import { InputProps } from "../../tfmmobile";
import { useForm, Controller } from 'react-hook-form';
const CustomPasswordTextInput: React.FC<InputProps> = ({ label, icon, IsSecureText, keyboardType, placeholder, control, onSubmit, nameController, defaultValue, rules, errors, editable, maxLength
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(IsSecureText);
  return (
    <View style={styles.formEntry}>
      <Controller
        control={control}
        name={nameController}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            theme={{
              colors: {
                primary: '#106F69',
                accent: '#106F69',
              },
            }}
            label={label}
            editable={editable} maxLength={maxLength}
            autoCapitalize="none"
            onChangeText={onChange} secureTextEntry={secureTextEntry} keyboardType={keyboardType} placeholder={placeholder} onBlur={onBlur} value={value} onSubmitEditing={onSubmit}
            right={
              <TextInput.Icon
                icon={secureTextEntry?"eye":"eye-off"}
                color='#106F69'
                onPress={() => {
                  setSecureTextEntry(!secureTextEntry);
                  return false;
                }}
              />
            }
          />
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
export default CustomPasswordTextInput;
