import { View, Text, Platform, TextInput } from "react-native";
import { Picker } from '@react-native-picker/picker';
import React from "react";
import { InputPostalCodeProps } from "../../tfmmobile";
import { useForm, Controller } from 'react-hook-form';
import { useLocalidades, useProvincias } from "../../services/hooks/postalCodes/usePostalCodes";

const PostalCodeInput: React.FC<InputPostalCodeProps> = ({ iconCodigoPostal, iconProvincia, iconLocalidad, nameControllerCodigoPostal, nameControllerProvincia, nameControllerLocalidad, control, rules, defaultValueCodigoPostal, defaultValueProvincia, defaultValueLocalidad, errorsCodigoPostal, errorsProvincia, errorsLocalidad, editable, maxLength, onSubmit, keyboardType
}) => {
  const { provincias, provinciaSeleccionada, setProvinciaSeleccionada } = useProvincias();
  const { localidades, localidadSeleccionada, setLocalidadSeleccionada } = useLocalidades(provinciaSeleccionada);

  return (
    <>
    <View className="flex justify-start w-full mb-4">
      {"Código postal" && (
        <Text className="text-[#EFE3C8] mb-2 text-[13px]">{"Código postal"}</Text>
      )}
      <View className="w-full bg-[#171017] border-[#EFE3C850] border-[1px] rounded-md h-[57px] p-1 flex justify-center items-center flex-row ">
        {iconCodigoPostal && (
          <View className="flex items-center justify-center h-[38px] w-[38px]">
            {iconCodigoPostal}
          </View>
        )}
        <Controller
          control={control}
          name={nameControllerCodigoPostal}
          defaultValue={defaultValueCodigoPostal}
          rules={rules}
          render={({
            field: { onChange, onBlur, value }
          }) => (
            <TextInput autoCapitalize="none" className="flex flex-1 bg-transparent text-lg text-[#EFE3C895] h-[50px] pl-2" editable={editable} maxLength={maxLength}
              onChangeText={onChange} keyboardType={keyboardType} placeholder={"Introduce tu código postal"} onBlur={onBlur} value={value} onSubmitEditing={onSubmit}
              placeholderTextColor={"#EFE3C825"}
            />
          )}
        />
      </View>
      {errorsCodigoPostal}
    </View>
      <View className="flex justify-start w-full mb-4">
        {"Provincia" && (
          <Text className="text-[#EFE3C8] mb-2 text-[13px]">{"Provincia"}</Text>
        )}
        <View className="w-full bg-[#171017] text-[#EFE3C8] border-[#EFE3C850] border-[1px] rounded-md p-1 flex ">
          {iconProvincia && (
            <View className="flex items-center justify-center h-[38px] w-[38px]">
              {iconProvincia}
            </View>
          )}
          <Controller
            control={control}
            name={nameControllerProvincia}
            defaultValue={defaultValueProvincia}
            rules={rules}
            render={({
              field: { onChange, onBlur, value }
            }) => (
              <Picker
                style={{ color: "#EFE3C895" }}
                selectedValue={value}
                onValueChange={(itemValue) => {
                  onChange(itemValue);
                  setProvinciaSeleccionada(itemValue);
                }}>
                <Picker.Item label={defaultValueProvincia} value="" />
                {provincias.sort((a, b) => a.PRO.localeCompare(b.PRO)).map((provincia) => (
                  <Picker.Item key={provincia.CPRO} label={provincia.PRO} value={provincia.CPRO} />
                ))}
              </Picker>
            )}
          />
        </View>
        {errorsProvincia}
      </View>
      {provinciaSeleccionada && (
        <>
        
          <View className="flex justify-start w-full mb-4">
            {"Localidad" && (
              <Text className="text-[#EFE3C8] mb-2 text-[13px]">{"Localidad"}</Text>
            )}
            <View className="w-full bg-[#171017] text-[#EFE3C8] border-[#EFE3C850] border-[1px] rounded-md p-1 flex ">
              {iconLocalidad && (
                <View className="flex items-center justify-center h-[38px] w-[38px]">
                  {iconLocalidad}
                </View>
              )}
              <Controller
                control={control}
                name={nameControllerLocalidad}
                defaultValue={defaultValueLocalidad}
                rules={rules}
                render={({
                  field: { onChange, onBlur, value }
                }) => (
                  <Picker
                    style={{ color: "#EFE3C895" }}
                    selectedValue={value}
                    onValueChange={(itemValue) => {
                      onChange(itemValue);
                      setLocalidadSeleccionada(itemValue);
                    }}>
                    <Picker.Item label={defaultValueLocalidad} value="" />
                    {localidades.map((localidad) => (
                      <Picker.Item key={localidad.CMUM} label={localidad.DMUN50} value={localidad.DMUN50} />
                    ))}
                  </Picker>
                )}
              />
            </View>
            {errorsLocalidad}
          </View>
        </>
      )}
    </>

  );
};
export default PostalCodeInput;
