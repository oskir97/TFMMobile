import React, { useState, useEffect }from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { AntDesign } from '@expo/vector-icons';
import { Button } from "react-native-paper";
import { useTranslation } from 'react-i18next';

interface ImageUploaderProps {
  onImageSelected: (base64Image: string) => void;
  img:string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, img }) => {
  const [image, setImage] = useState<string | null>(img);
  const { t } = useTranslation();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setImage(`data:image/png;base64,${base64}`);
      onImageSelected(`data:image/png;base64,${base64}`);
    }
  };

  const removeImage = () => {
    setImage(undefined);
    onImageSelected(null);
  };

  useEffect(() => {
    setImage(img);
}, [img]);

  return (
    <View>
      {image &&
        <>
          <Button
            mode="outlined"
            onPress={removeImage}
            icon={({ size }) => <AntDesign name="delete" size={size} color='#106F69' />}
            style={{ marginTop: 10, borderColor: '#106F69', marginLeft:10, marginRight:10 }}
          >
            <Text style={{ color: '#106F69' }}>
            {t("ELIMINAR_IMAGEN") }
            </Text>
          </Button>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} />
          </View>
        </>
      }
      {!image &&
        <Button onPress={pickImage} mode="contained" style={{ backgroundColor: '#106F69', marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 20 }} icon={{ source: "account", direction: 'rtl' }} contentStyle={{ flexDirection: 'row-reverse' }}>{t("SELECCIONAR_IMAGEN_PERFIL") }</Button>
      }
    </View>
  );
};

export default ImageUploader;