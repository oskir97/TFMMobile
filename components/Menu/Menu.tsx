import { useLinkTo, useNavigation, useNavigationState } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, Text, Pressable, StyleSheet, Image, useWindowDimensions, TouchableOpacity, ImageBackground } from "react-native";
import { Appbar, Avatar, Divider, IconButton, Menu } from "react-native-paper";
import { MenuProps } from "../../tfmmobile";
import { LoginContext } from "../../shared/services/hooks/login/contexts/LoginContext";

const CustomLanguagePicker: React.FC<MenuProps> = ({ showReturnWizard, text, showusuario, userMenu, goBack, functionGoBack, showLang }) => {
  const { i18n, t } = useTranslation();
  const linkTo = useLinkTo();
  const { user } = useContext(LoginContext);

  const languages = [
    { name: 'es', label: 'Español', flag: require('../../assets/images/es_flag.png') },
    { name: 'en', label: 'English', flag: require('../../assets/images/en_flag.png') },
    { name: 'ca', label: 'Valencià', flag: require('../../assets/images/ca_flag.png') }
  ];

  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLanguageSelect = (selectedLanguage: string) => {
    i18n.changeLanguage(selectedLanguage);
    closeMenu();
  };

  const isLanguageDisabled = (lang: string) => i18n.language === lang;

  const handleGoBack = () => {
    linkTo(goBack ? goBack : '/Ubicación')
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength - 3) + '...';
  };

  const windowWidth = useWindowDimensions().width;
  const maxWidth = windowWidth * 0.62;

  const renderImage = () => {
    if (user.imagen) {
      return (
        <Image
          source={{ uri: user.imagen }}
          style={{ height: 35, width: 35, marginRight: 10, borderRadius: 25 }}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <ImageBackground
          source={require('../../assets/images/user.png')}
          style={{ height: 35, width: 35, marginRight: 10 }} imageStyle={{ borderRadius: 25 }}></ImageBackground>
      );
    }
  };

  return (
    <View>
      <Appbar.Header style={{ backgroundColor: '#04D6C8', borderBottomColor: '#106F69', borderBottomWidth: 2 }}>
        {showReturnWizard && (
          <IconButton
            icon="arrow-left"
            iconColor="white"
            onPress={functionGoBack? functionGoBack :handleGoBack}
          />
        )}
        {
          text && (
            <Text className="font-semibold mt-1" onPress={functionGoBack? functionGoBack :handleGoBack} style={{ color: 'white', fontSize: 20 }}>{truncateText(text, maxWidth / 11)}</Text>
          )
        }
        <Appbar.Content title="" />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            showLang && <Appbar.Action icon="translate" color="white" onPress={openMenu} />
          }
        >
          {languages.map((lang) => (
            <React.Fragment key={lang.name}>
              <Menu.Item
                style={{ width: 150 }}
                onPress={() => handleLanguageSelect(lang.name)}
                title={
                  <View style={styles.menuItemContent}>
                    <Image source={lang.flag} style={[styles.menuItemIcon, isLanguageDisabled(lang.name) && styles.disabledMenuItemIcon]} />
                    <Text style={[styles.menuItemTitle, isLanguageDisabled(lang.name) && styles.disabledMenuItemTitle]}>{lang.label}</Text>
                  </View>
                }
                disabled={isLanguageDisabled(lang.name)}
              />
            </React.Fragment>
          ))}
        </Menu>
        {showusuario && (
          <TouchableOpacity onPress={userMenu}>
            {renderImage()}
          </TouchableOpacity>
        )}
      </Appbar.Header>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 35,
    height: 24,
    marginRight: 8
  },
  menuItemTitle: {
    marginLeft: 8
  },
  disabledMenuItemIcon: {
    opacity: 0.5
  },
  disabledMenuItemTitle: {
    color: '#888888'
  }
});

export default CustomLanguagePicker;