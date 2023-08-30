import React, { useContext, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { MD3Colors, ProgressBar } from "react-native-paper";
import { LoginContext } from "../../../shared/services/hooks/login/contexts/LoginContext";
import { useTranslation } from "react-i18next";
import CustomButton from "../../../components/Buttons/CustomButton";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Menu from "../../../components/Menu/Menu";
import { Ionicons } from "@expo/vector-icons";

interface UbicationScreenProps {
  navigation: any;
}

const UbicacionScreen: React.FC<UbicationScreenProps> = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const { filter, setFilter, localidad, getLocation } = useContext(LoginContext);
  const [localidadAsignada, setLocalidadAsignada] = useState<string | undefined>(filter && filter.localidad ? filter.localidad : localidad);
  // const [error, setError] = useState(false);

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
    } 
    // else {
    //   setError(true);
    // }
  };

  const obtenerUbicacion = () => {
    getLocation().then((location: string | undefined) => {
      if (location) {
        setLocalidadAsignada(location);
      }
    });
  }

  const ref = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      ref.current?.clear();
    });
    return unsubscribe;
  }, [navigation, filter?.localidad]);

  return (
    <>
      <Menu showReturnWizard={false} showLang={true} showusuario={true} userMenu={() => navigation.openDrawer()} />
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
                  {t("EN")} <Text style={{ fontWeight: 'bold', color: '#04D6C8' }}>{localidadAsignada}</Text>
                </Text>
              </View>}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', flex: 0.91, marginRight: 10 }}>
                <GooglePlacesAutocomplete keyboardShouldPersistTaps="always"
                  ref={ref}
                  fetchDetails
                  placeholder={localidadAsignada != undefined ? `${t("SELECCIONAR_OTRA_LOCALIDAD")}...` : `${t("SELECCIONAR_UNA_LOCALIDAD")}...`}
                  styles={{
                    textInput: { borderColor: 'black', borderWidth: 1, height: 50 },
                  }}
                  textInputProps={{
                    value:undefined,
                    autoFocus: localidadAsignada == undefined
                  }}
                  onPress={(data, details = null) => {
                    // const provincia = details?.address_components.find(component => component.types.includes('administrative_area_level_2'));
                    const localidadMaps = details?.address_components.find(component => component.types.includes('locality'));
                    // const domicilio = details?.address_components.find(component => component.types.includes('route'));
                    // const codigoPostal = details?.address_components.find(component => component.types.includes('postal_code'));
                    if (localidadMaps) {
                      setLocalidadAsignada(localidadMaps?.long_name);
                      // setError(false);
                    } else if (localidad != undefined) {
                      setLocalidadAsignada(localidad);
                      // setError(false);
                    } 
                    // else {
                    //   setError(true);
                    // }
                  }}
                  query={{
                    key: 'AIzaSyDk2FMHqx4YxsS-LkVt4wtzhHM4iM1_gxU',
                    language: 'es',
                    components: 'country:es', // Limitar búsqueda a España
                  }}
                />
              </View>
              {/* {error && (
                <Text className="text-error">{t("SELECCIONAR_UNA_LOCALIDAD")}</Text>
              )} */}
              <TouchableOpacity style={{ flex: 0.09 }} onPress={() => obtenerUbicacion()}>
                <Ionicons name="locate" color={"#04D6C8"} size={30} style={{ marginTop: 6 }} />
              </TouchableOpacity>
            </View>
          </View>

          <CustomButton
            onPress={() => onSubmit()}
            buttonText={t("ASIGNAR_DEPORTE")}
            colorButtom='#04D6C8'
            colorText='white'
            colorButtomHover="#04D6C8"
            colorTextHover="white"
            iconRight="chevron-right"
            animated={true}
            visible={localidadAsignada?true : false}
          />
        </View>
      </View>
    </>
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