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

const CustomInputMaps: React.FC<CustomInputMapsProps> = ({ visible, onConfirm, onCancel, title, animationType, lastlocation }) => {

  const [localidad, setLocalidad] = useState<string | undefined>(lastlocation);

  const [modalHeight, setModalHeight] = useState(0);

  useEffect(() => {
    const windowHeight = Dimensions.get('window').height;
    const modalHeightPercentage = windowHeight * 0.9;
    setModalHeight(modalHeightPercentage);
  }, []);

  const onSubmit = () => {
    onConfirm(localidad);
  };

  return (
    <>
      <Modal transparent={false} visible={visible} animationType={animationType}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <View style={{ padding: 20, height:modalHeight }}>
              <GooglePlacesAutocomplete keyboardShouldPersistTaps="always"
                placeholder="Buscar dirección"
                onPress={(data, details = null) => {
                  setLocalidad(data.description);
                }}
                query={{
                  key: 'AIzaSyDB2bGI_qo-wtNjBZ690FvrcVeQK4kS7Jg',
                  language: 'es',
                  components: 'country:es', // Limitar búsqueda a España
                }}
              />
              <View style={styles.buttoms}>
                <TouchableOpacity style={{
                  marginLeft: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: localidad?'#aa18ea':'#CCCCCC',
                  borderRadius: 4,
                }} disabled={!localidad} onPress={()=> onSubmit()}>
                  <Text style={styles.buttomText}>Actualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  marginLeft: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: lastlocation?'#999':'#CCCCCC',
                  borderRadius: 4,
                }} disabled={!lastlocation} onPress={onCancel}>
                  <Text style={styles.buttomText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.cancel} onPress={onCancel}>
                <XCircleIcon size={24} color="#999" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    flex: 0.95,
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
export default CustomInputMaps;
