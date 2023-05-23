import React, { useContext, useState } from "react";
import { Text, View, StyleSheet } from "react-native";

import { SubmitHandler, useForm, Controller, Control } from "react-hook-form";
import { MD3Colors, ProgressBar, TextInput } from "react-native-paper";
import { LoginContext } from "../../../shared/services/hooks/login/contexts/LoginContext";
import { useTranslation } from "react-i18next";
import CustomButton from "../../../components/Buttons/CustomButton";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

interface UbicationScreenProps {
  navigation: any;
}

const UbicacionScreen: React.FC<UbicationScreenProps> = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const { filter, setFilter, localidad } = useContext(LoginContext);
  const [localidadAsignada, setLocalidadAsignada] = useState<string | undefined>(localidad);
  const [error, setError] = useState(false);

  const { t } = useTranslation();

  const onSubmit = () => {
    if (localidadAsignada != undefined) {
      var filterUbicacion = filter;
      if (filterUbicacion == undefined)
        filterUbicacion = { localidad: localidadAsignada, fecha: undefined, deporte: undefined };
      else
        filterUbicacion.localidad = localidadAsignada

      setFilter(filterUbicacion);

      navigation.navigate("Deporte");
    } else {
      setError(true);
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar
        style={styles.progressBar}
        progress={0}
        color={MD3Colors.primary60}
      />
      <View style={{ flex: 1, justifyContent: 'space-between', margin: 20 }}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 24 }} className="font-semibold mt-1">{t("DONDE_RESERVAR")}</Text>
          </View>
          {localidadAsignada != undefined &&
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginLeft: 15 }}>
              <Text style={{ fontSize: 18 }}>
              {t("EN")}<Text style={{ fontWeight: 'bold', color:'#04D6C8' }}>{localidadAsignada}</Text>
              </Text>
            </View>}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <GooglePlacesAutocomplete keyboardShouldPersistTaps="always"
              fetchDetails
              placeholder={localidadAsignada != undefined ? `${t("SELECCIONAR_OTRA_LOCALIDAD")}...` : `${t("SELECCIONAR_UNA_LOCALIDAD")}...`}
              styles={{
                textInput: { borderColor: 'black', borderWidth: 1, height: 50 },
              }}
              textInputProps={{
                autoFocus: localidadAsignada == undefined
              }}
              onPress={(data, details = null) => {
                // const provincia = details?.address_components.find(component => component.types.includes('administrative_area_level_2'));
                const localidadMaps = details?.address_components.find(component => component.types.includes('locality'));
                // const domicilio = details?.address_components.find(component => component.types.includes('route'));
                // const codigoPostal = details?.address_components.find(component => component.types.includes('postal_code'));
                if(localidadMaps){
                  setLocalidadAsignada(localidadMaps?.long_name);
                  setError(false);
                }else if(localidad != undefined){
                  setLocalidadAsignada(localidad);
                  setError(false);
                }else{
                  setError(true);
                }
              }}
              query={{
                key: 'AIzaSyDB2bGI_qo-wtNjBZ690FvrcVeQK4kS7Jg',
                language: 'es',
                components: 'country:es', // Limitar búsqueda a España
              }}
            />
          </View>
          {error && (
              <Text className="text-error">{t("SELECCIONAR_UNA_LOCALIDAD")}</Text>
            )}
        </View>

        <CustomButton
          onPress={() => onSubmit()}
          buttonText={t("ASIGNAR_DEPORTE")}
          colorButtom='#04D6C8'
          colorText='white'
          colorButtomHover="#04D6C8"
          colorTextHover="white"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 8
  },
  formEntry: {
    margin: 8,
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  progressBar: {
    marginBottom: 16,
    height: 6,
    paddingHorizontal: 0,

  },
});

export default UbicacionScreen;