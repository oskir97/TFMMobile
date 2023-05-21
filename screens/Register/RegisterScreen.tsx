import { View, Text, Alert, ImageBackground, Keyboard } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import KeyboardAvoidWrapper from "../../components/Container/KeyboardAvoidWrapper";
import CustomTextInput from "../../components/InputText/CustomTextInput";
import CustomButton from "../../components/Buttons/CustomButton";
import { RegisterData, useRegister } from '../../shared/services/hooks/register/useRegister';
import CustomDateInput from "../../components/InputDate/CustomDateInput";
import CustomPasswordTextInput from "../../components/InputPasswordText/CustomPasswordTextInput";
import { Ubication } from "../../shared/models/Ubication";
import CustomInputModalMaps from "../../components/Modals/CustomInputModalMaps";

const RegisterScreen = (props: RegisterProps) => {

  const {control, handleSubmit, formState, handleRegistro, setValue } = useRegister();
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState<Ubication>({ codigoPostal: "", localidad: "", provincia: "", domicilio: "" });

  const handleLocation = (location: Ubication) => {
    Keyboard.dismiss();
    setLocation(location);
    setValue('domicilio', `${location.domicilio}`);
    setLocationOpen(false);
  }

  const login = () => props.navigation.navigate("Login");

  const onSubmit = async (data: RegisterData) => {
    try {
      data.codigoPostal = location.codigoPostal;
      data.provincia = location.provincia;
      data.localidad = location.localidad;
      const result = await handleRegistro(data);
      if (result) {
        Alert.alert('Registro exitoso', '¡Bienvenido! Por favor inicia sesión');
        login();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // const nombreInputRef = useRef<TextInput>();

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     nombreInputRef.current?.focus();
  //   });
  // }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidWrapper>
        <View style={{ paddingHorizontal: 16, marginBottom: 30 }}>
          <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 70 }}>
            <ImageBackground source={require('../../assets/images/logo.png')} style={{ height: 150, width: 150 }} imageStyle={{ borderRadius: 10 }}></ImageBackground>
          </View>
          <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 10 }}>
            <Text className="text-md">
              Introduce tus datos para crear un usuario
            </Text>
          </View>

          <CustomTextInput
            nameController="nombre"
            // ref={nombreInputRef}
            control={control}
            label="Nombre"
            placeholder="Introduce tu nombre"
            editable={true}
            autoCapitalize={'words'}
            maxLength={50}
            rules={{
              required: { value: true },
              pattern: {
                value: true
              }
            }}
            errors={formState.errors.nombre && (
              <Text className="text-error">{formState.errors.nombre.message}</Text>
            )}
            onSubmit={handleSubmit(onSubmit)}
          />
          <CustomTextInput
            nameController="apellidos"
            control={control}
            label="Apellidos"
            placeholder="Introduce tus apellidos"
            editable={true}
            autoCapitalize={'words'}
            maxLength={100}
            rules={{
              required: { value: true },
              pattern: {
                value: true
              }
            }}
            errors={formState.errors.apellidos && (
              <Text className="text-error">{formState.errors.apellidos.message}</Text>
            )}
            onSubmit={handleSubmit(onSubmit)}
          />
          <CustomTextInput
            nameController="email"
            control={control}
            label="Email"
            keyboardType={"email-address"}
            placeholder="Introduce tu email"
            editable={true}
            maxLength={75}
            rules={{
              required: { value: true },
              pattern: {
                value: true
              },
            }}
            errors={formState.errors.email && (
              <Text className="text-error">{formState.errors.email.message}</Text>
            )}
            onSubmit={handleSubmit(onSubmit)}
          />
          <CustomPasswordTextInput
            nameController="password"
            control={control}
            label="Contraseña"
            IsSecureText={true}
            keyboardType="default"
            placeholder="* * * * * * * *"
            editable={true}
            maxLength={255}
            rules={{
              required: { value: true },
              pattern: {
                value: true
              }
            }}
            errors={formState.errors.password && (
              <Text className="text-error">{formState.errors.password.message}</Text>
            )}
            onSubmit={handleSubmit(onSubmit)}
          />

          <CustomPasswordTextInput
            nameController="confirmPassword"
            control={control}
            label="Confirmar contraseña"
            IsSecureText={true}
            keyboardType="default"
            placeholder="* * * * * * * *"
            editable={true}
            rules={{ required: { value: true } }}
            maxLength={255}
            errors={formState.errors.confirmPassword && (
              <Text className="text-error">{formState.errors.confirmPassword.message}</Text>
            )}
            onSubmit={handleSubmit(onSubmit)}
          />
          <CustomDateInput
            nameController="fechaNacimiento"
            control={control}
            label="Fecha de nacimiento"
            placeholder="Introduce tu fecha de nacimiento"
            mode="date"
            maxDate={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)}
            rules={{
              required: { value: true },
              pattern: {
                value: true
              }
            }}
            errors={formState.errors.fechaNacimiento && (
              <Text className="text-error">{formState.errors.fechaNacimiento.message}</Text>
            )}
            onSubmit={handleSubmit(onSubmit)}
          />
          <CustomTextInput
            nameController="telefono"
            control={control}
            label="Teléfono"
            placeholder="Introduce tu teléfono"
            editable={true}
            maxLength={9}
            rules={{
              required: { value: true },
              pattern: {
                value: true
              }
            }}
            errors={formState.errors.telefono && (
              <Text className="text-error">{formState.errors.telefono.message}</Text>
            )}
            onSubmit={handleSubmit(onSubmit)}
          />
          <CustomTextInput
            nameController="telefonoAlternartivo"
            control={control}
            label="Teléfono alternativo"
            placeholder="Introduce tu teléfono alternativo"
            editable={true}
            maxLength={9}
            rules={{
              required: { value: true },
              pattern: {
                value: true
              }
            }}
            errors={formState.errors.telefonoAlternartivo && (
              <Text className="text-error">{formState.errors.telefonoAlternartivo.message}</Text>
            )}
            onSubmit={handleSubmit(onSubmit)}
          />
          <CustomTextInput
            nameController="domicilio"
            // icon="map-marker-plus"
            control={control}
            label="Domicilio"
            editable={true}
            valueAssign={location.domicilio}
            onPressIn={() => { setLocationOpen(true); }}
            placeholder="Introduce tu domicilio"
            // onSelectIcon={() => setLocationOpen(true)}
            maxLength={128}
            rules={{
              required: { value: true },
              pattern: {
                value: true
              }
            }}
            errors={formState.errors.domicilio && (
              <Text className="text-error">{formState.errors.domicilio.message}</Text>
            )}
            onSubmit={handleSubmit(onSubmit)}
          />
          <CustomTextInput
            nameController="numero"
            control={control}
            label="Número del domicilio"
            placeholder="Introduce tu número"
            editable={true}
            maxLength={50}
            rules={{
              required: { value: true },
              pattern: {
                value: true
              }
            }}
            errors={formState.errors.numero && (
              <Text className="text-error">{formState.errors.numero.message}</Text>
            )}
            onSubmit={handleSubmit(onSubmit)}
          />

          <CustomButton
            onPress={handleSubmit(onSubmit)}
            buttonText="Registrarse"
            colorButtom='#04D6C8'
          colorText='white'
          colorButtomHover="#04D6C8"
          colorTextHover="white"

          // onPress={() => console.log(password)}
          />
          <CustomButton
            onPress={login}
            buttonText="Ya tengo usuario/a"
            colorButtom='transparent'
          colorText='#04D6C8'
          colorButtomHover="#04D6C850"
          colorTextHover="white"
          // onPress={() => console.log(password)}
          />
        </View>
      </KeyboardAvoidWrapper>
      <CustomInputModalMaps login={true} visible={locationOpen} setVisible={setLocationOpen} animationType={"none"} title="Modificar ubicación de las pistas" lastlocation={location.domicilio} onConfirm={handleLocation} onCancel={() => setLocationOpen(false)} />
    </View>
  );
};

export default RegisterScreen;