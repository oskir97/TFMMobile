import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, Modal, Button, TouchableOpacity, Pressable, ScrollView, Dimensions } from "react-native";
import { CustomInputMapsProps } from "../../tfmmobile";
import { XCircleIcon } from "react-native-heroicons/solid";
import Ionicons from "@expo/vector-icons/Ionicons";
import SportTypes from "../SportTypes/SportTypes";
import { MaterialIcons } from "@expo/vector-icons";
import CustomTextInput from "../InputText/CustomTextInput";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import { Deporte } from "../../shared/models/Deporte";
import CustomDateInput from "../InputDate/CustomDateInput";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ubication } from "../../shared/models/Ubication";
import { useTranslation } from "react-i18next";

const CustomInputModalMaps: React.FC<CustomInputMapsProps> = ({ visible, onConfirm, onCancel, title, animationType, lastlocation, login }) => {

  const [location, setLocation] = useState<Ubication | null>(lastlocation);

  const [modalHeight, setModalHeight] = useState(0);

  useEffect(() => {
    const windowHeight = Dimensions.get('window').height;
    const modalHeightPercentage = windowHeight * 0.6;
    setModalHeight(modalHeightPercentage);
  }, []);

  const onSubmit = () => {
    const loc = location;
    setLocation(null);
    onConfirm(loc);
  };

  const { t } = useTranslation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modal: {
      height:modalHeight,
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 5,
      width: '95%',
      maxWidth: 400,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 20,
      marginBottom: 20,
      textAlign: 'left'
    },
    buttoms: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 20
    },
    buttomReset: {
      marginHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "black",
      padding: 10,
      width: 160,
      justifyContent: "center",
      backgroundColor: 'white',
      borderRadius: 4,
    },
    buttomText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    cancel: {
      position: 'absolute',
      top: 4,
      right: 8,
    },
  });

  return (
    <>
      <Modal transparent={false} visible={visible} animationType={animationType}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <View style={{ padding: 20, height: modalHeight }}>
              <GooglePlacesAutocomplete keyboardShouldPersistTaps="always"
                fetchDetails
                placeholder={t("BUSCAR_DIRECCION")}
                textInputProps={{
                  autoFocus: true,
                }}
                onPress={(data, details = null) => {
                  const provincia = details?.address_components.find(component => component.types.includes('administrative_area_level_2'));
                  const localidad = details?.address_components.find(component => component.types.includes('locality'));
                  const domicilio = details?.address_components.find(component => component.types.includes('route'));
                  const codigoPostal = details?.address_components.find(component => component.types.includes('postal_code'));
                  setLocation({ provincia: provincia?.long_name, localidad: localidad?.long_name, domicilio: domicilio?.long_name, codigoPostal: codigoPostal?.long_name });
                }}
                query={{
                  key: 'AIzaSyDk2FMHqx4YxsS-LkVt4wtzhHM4iM1_gxU',
                  language: 'es',
                  components: 'country:es', // Limitar búsqueda a España
                }}
              />
              <View style={styles.buttoms}>
                <TouchableOpacity style={{
                  marginLeft: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: location != undefined && location.localidad != undefined && location.localidad != "" ? '#04D6C8' : '#CCCCCC',
                  borderRadius: 4,
                }} disabled={!(location != undefined && location.localidad != undefined && location.localidad != "")} onPress={() => onSubmit()}>
                  <Text style={styles.buttomText}>{t("ACTUALIZAR")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  marginLeft: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: lastlocation != undefined && lastlocation.localidad != undefined && lastlocation.localidad != "" ? '#999' : '#CCCCCC',
                  borderRadius: 4,
                }} disabled={lastlocation != undefined && lastlocation.localidad != undefined && lastlocation.localidad != "" && !login} onPress={() => { setLocation(null); onCancel(); }}>
                  <Text style={styles.buttomText}>{t("CANCELAR")}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.cancel} onPress={() => { setLocation(null); onCancel(); }}>
                <XCircleIcon size={24} color="#999" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </>
  );
};
export default CustomInputModalMaps;
