import { View, Text, TextInput, Button, StyleSheet, Modal, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Rating } from 'react-native-ratings';
import { useTranslation } from 'react-i18next';
import { XCircleIcon } from 'react-native-heroicons/solid';
import CustomButton from '../Buttons/CustomButton';
import CustomTextInput from '../InputText/CustomTextInput';

interface ReviewData {
  comentario: string;
  estrellas: number;
}

const CreateReviewModal = ({ visible, onConfirm, onCancel, title, animationType, }) => {
  const { control, register, reset, handleSubmit, formState: { errors } } = useForm<ReviewData>({
    mode: "onChange",
    defaultValues: {
      comentario: '',
      estrellas: 3,
    },
  });

  const [modalHeight, setModalHeight] = useState(0);

  const { t } = useTranslation();

  useEffect(() => {
    const windowHeight = Dimensions.get('window').height;
    const modalHeightPercentage = windowHeight * 0.65;
    setModalHeight(modalHeightPercentage);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modal: {
      height: modalHeight,
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 5,
      width: '95%',
      maxWidth: 400,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18,
      marginTop:20,
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
    errorMessage: {
      color: 'red',
      marginBottom: 10,
    },
    input: {
      borderColor: '#CCC',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    rating: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'center',
    }
  });

  return (
    <Modal transparent={false} visible={visible} animationType={animationType}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={{ padding: 20, height: modalHeight }}>
            <Text style={styles.title}>{title}</Text>
            <CustomTextInput
            nameController="comentario"
            control={control}
            label={t("COMENTARIO")}
            placeholder={t("INTRODUCE_COMENTARIO")}
            editable={true}
            maxLength={4000}
            numberLines={4}
            autoCapitalize={'sentences'}
            rules={{
              required: { value: true },
              pattern: {
                value: true
              }
            }}
            errors={errors.comentario && (
              <Text className="text-error">{errors.comentario.message}</Text>
            )}
            onSubmit={handleSubmit(onConfirm)}
          />
            <View style={styles.rating}>
              <Controller
                control={control}
                name="estrellas"
                defaultValue={0}
                rules={{ required: t("SELECCIONA_ESTRELLAS") }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Rating
                    type='custom'
                    startingValue={value}
                    imageSize={30}
                    style={{ alignSelf: 'flex-start', marginBottom: 10 }}
                    ratingColor='orange'
                    ratingBackgroundColor='#c8c7c8'
                    tintColor='white'
                    ratingCount={5}
                    fractions={0}
                    onFinishRating={(rating) => onChange(rating)}
                  />
                )}
              />
              {errors.estrellas && <Text style={styles.errorMessage}>{errors.estrellas.message}</Text>}
            </View>
            <CustomButton
            animated={true}
              visible={!errors.comentario}
              onPress={handleSubmit(onConfirm)}
              buttonText={t("ACEPTAR")}
              colorButtom='#04D6C8'
              colorText='white'
              colorButtomHover="#04D6C8"
              colorTextHover="white"

            />
            <CustomButton
              onPress={onCancel}
              buttonText={t("CANCELAR")}
              colorButtom='transparent'
              colorText='#04D6C8'
              colorButtomHover="#04D6C850"
              colorTextHover="white"
            />
            <TouchableOpacity style={styles.cancel} onPress={() => { onCancel() }}>
              <XCircleIcon size={24} color="#999" />
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default CreateReviewModal;