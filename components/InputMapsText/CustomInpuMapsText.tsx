import React from "react";
import { StyleSheet, View} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { CustomInputTextMapsProps } from "../../tfmmobile";

const CustomInpuMapsText: React.FC<CustomInputTextMapsProps> = ({ setLocation }) => {

  const getLocationData = (data:any) => {
    console.log(data);
  };

  return (
    <View style={styles.formEntry}>
      <GooglePlacesAutocomplete keyboardShouldPersistTaps="always"
        placeholder="Buscar dirección"
        onPress={(data, details = null) => {
          getLocationData(data.description);
        }}
        query={{
          key: 'AIzaSyDk2FMHqx4YxsS-LkVt4wtzhHM4iM1_gxU',
          language: 'es',
          components: 'country:es', // Limitar búsqueda a España
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  formEntry: {
    margin: 8
  }
});
export default CustomInpuMapsText;
