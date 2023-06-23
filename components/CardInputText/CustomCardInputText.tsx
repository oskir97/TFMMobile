import { View, Text, StyleSheet, Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import React, { useState } from "react";
import { InputCardProps } from "../../tfmmobile";
import { useForm, Controller } from 'react-hook-form';
import CardIcon from "../CardIcon/CardIcon";
const CustomCardInputText: React.FC<InputCardProps> = ({ label, icon, IsSecureText, keyboardType, placeholder, control, onSubmit, nameController, defaultValue, rules, errors, editable, maxLength, valueAssign, onFocus, onPressIn, onSelectIcon, ref, autoCapitalize, card
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
          <View style={{
            flexDirection: 'row',
          }}>
            <TextInput
              ref={ref}
              mode="outlined"
              style={{width:Dimensions.get("window").width * 0.78}}
              theme={{
                colors: {
                  primary: '#106F69',
                  accent: '#106F69',
                },
              }}
              label={label}
              editable={editable} maxLength={maxLength}
              autoCapitalize={autoCapitalize != null && autoCapitalize != undefined ? autoCapitalize : 'none'}
              onChangeText={onChange} onPressIn={onPressIn} secureTextEntry={secureTextEntry} keyboardType={keyboardType} placeholder={placeholder} onBlur={onBlur} value={valueAssign != null ? valueAssign : value} onSubmitEditing={onSubmit}
            />
            <CardIcon cardNumber={value}></CardIcon>
          </View>
        )}
      />
      {errors}
    </View>
  );
};
const styles = StyleSheet.create({
  formEntry: {
    margin: 8,
  }
});
export default CustomCardInputText;
