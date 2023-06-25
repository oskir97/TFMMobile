import React, { useContext, useState } from "react";
import { View, Text, ImageBackground, Image } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ArrowRightOnRectangleIcon } from "react-native-heroicons/solid";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";
import CustomConfirmationModal from "../Modals/CustomConfirmationModal";
import { useTranslation } from "react-i18next";

const CustomDrawer = (props: any) => {
  const hideDrawerContent = props.state.routeNames[props.state.index] === 'ProcessingPago';

  if (hideDrawerContent) {
    return null;
  }

  const { logout, user } = useContext(LoginContext);
  const [showModal, setShowModal] = useState(false);

  const { t } = useTranslation();

  const handleConfirm = () => {
    setShowModal(false);
    logout();
  }
  
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#026B64' }}>
        <ImageBackground source={require('../../assets/images/menu-bg2.jpeg')} style={{ padding: 20 }}>
          <Image source={require('../../assets/images/user.png')} style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }} />
          <Text className="font-semibold" style={{ color: '#fff', fontSize: 18 }}>{`${user?.nombre} ${user?.apellidos}`}</Text>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 10, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity onPress={() => setShowModal(true)} style={{ paddingVertical: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ArrowRightOnRectangleIcon color={'black'} size={22} />
            <Text style={{fontSize:15, marginLeft:5}}>{t('CERRAR_SESION')}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <CustomConfirmationModal
        visible={showModal}
        message="¿Está seguro que desea cerrar la sesión?"
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </View>
  )
}

export default CustomDrawer;