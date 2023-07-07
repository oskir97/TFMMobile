import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import React, { useState } from "react";
import { InputProps } from "../../tfmmobile";
import { useForm, Controller } from 'react-hook-form';
const CustomTextInput: React.FC<InputProps> = ({ label, icon, IsSecureText, keyboardType, placeholder, control, onSubmit, nameController, defaultValue, rules, errors, editable, maxLength, valueAssign, onFocus,onPressIn, onSelectIcon, ref,autoCapitalize, numberLines, style
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
            numberOfLines={numberLines}
            style={style}
            ref={ref}
            mode="outlined"
            theme={{
              colors: {
                primary: '#106F69',
                accent: '#106F69',
              },
            }}
            label={label}
            editable={editable} maxLength={maxLength}
            autoCapitalize={autoCapitalize != null && autoCapitalize != undefined ? autoCapitalize : 'none'}
            onChangeText={onChange} onPressIn={onPressIn} secureTextEntry={secureTextEntry} keyboardType={keyboardType} placeholder={placeholder} onBlur={onBlur} value={valueAssign != null? valueAssign: value} onSubmitEditing={onSubmit}
            right={
              icon &&
              <TextInput.Icon
                icon={icon}
                onPress={()=> {onSelectIcon && onSelectIcon()}}
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
  formEntry: {
    margin: 8,
  }
});
export default CustomTextInput;
