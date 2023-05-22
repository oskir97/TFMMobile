import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, Text, Pressable, StyleSheet, Image } from "react-native";
import { Appbar, Avatar, Divider, Menu } from "react-native-paper";

const CustomLanguagePicker = () => {
  const { i18n, t } = useTranslation();

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

  return (
    <View>
      <Appbar.Header style={{ backgroundColor: '#04D6C8', borderBottomColor: '#106F69', borderBottomWidth: 2 }}>
        <Appbar.Content title="" />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="translate" color="white" onPress={openMenu} />
          }
        >
          {languages.map((lang) => (
            <React.Fragment key={lang.name}>
              <Menu.Item
                style={{ width: 150}}
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