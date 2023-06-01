import { View, Text, ScrollView, Pressable, Alert, ImageBackground, } from "react-native";
import React, { useEffect, useState } from "react";
import MainContainer from "../../components/Container/MainContainer";
import KeyboardAvoidWrapper from "../../components/Container/KeyboardAvoidWrapper";
import { useTranslation } from "react-i18next";
import Menu from "../../components/Menu/Menu";

const LoadingScreen = (props: LoginProps) => {

  const { t } = useTranslation();
  const [points, setPoints] = useState<string>(".");

  useEffect(() => {
    const interval = setInterval(() => {
      var point = points == "..." ? "." : points + ".";
      setPoints(point);
    }, 500);
    return () => clearInterval(interval);
  }, [points]);

  return (
    <>
    <Menu showReturnWizard={false} showLang={false}/>
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 30 }}>
          <ImageBackground source={require('../../assets/images/logo.png')} style={{ height: 150, width: 150 }} imageStyle={{ borderRadius: 10 }}></ImageBackground>
        </View>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 25 }}>
          <Text className="text-3xl text-[#106F69] font-semibold">{t("JUEGA")}</Text>
          <Text className="text-3xl text-[#04D6C8] font-semibold">{` ${t("ENTRETENTE")}`}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', paddingTop: 70 }}>
        <ImageBackground source={require('../../assets/images/loading.gif')} style={{ height: 230, width: 230 }} imageStyle={{ borderRadius: 10 }}></ImageBackground>
        </View>
      </View>
    </View>
    </>
  );
};

export default LoadingScreen;