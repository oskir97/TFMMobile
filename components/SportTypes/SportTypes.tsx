import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList, useWindowDimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons'; 
import { useDeportes } from '../../shared/services/hooks/deportes/useDeportes';
import { Deporte } from '../../shared/models/Deporte';
import { I18nContext, useTranslation } from 'react-i18next';

export interface DeporteTraducido {
  iddeporte:number;
  nombre:string | undefined;
}

export interface SportProps {
    selectedDeporte:any;
    iddeporte?:number |undefined;
    setSelectedDeporte:(deporte: Deporte |undefined) => void;
  }

  const SportTypes: React.FC<SportProps> = ({ setSelectedDeporte, selectedDeporte, iddeporte }) => {
    const { deportes, setDeportes } = useDeportes();
    const { height } = useWindowDimensions();
  
    const handleDeporteSelected = (deporte: Deporte | undefined) => {
      setSelectedDeporte(deporte);
    };
  
    const { i18n } = useContext(I18nContext);
  
    useEffect(() => {
      const updateDeportesWithTranslation = () => {
        const updatedDeportes = deportes?.map((deporte) => {
          const nombreTraducido = deporte.traduccionesDeporte.find((t) => t.getIdiomaDeporte.cultura === i18n.language)?.nombre;
          return {
            ...deporte,
            nombre: nombreTraducido || deporte.nombre,
          };
        });
        setDeportes(updatedDeportes);
      };
  
      i18n.on('languageChanged', updateDeportesWithTranslation);

      if(iddeporte){
        setSelectedDeporte(deportes?.find(d=>d.iddeporte = iddeporte));
      }
  
      return () => {
        i18n.off('languageChanged', updateDeportesWithTranslation);
      };
    }, [deportes]);
  
    const renderDeporteItem: React.FC<{ item: Deporte }> = ({ item }) => (
      <TouchableOpacity
        style={{ flex: 1, margin: 10, alignItems: 'center', justifyContent: 'center' }}
        onPress={() => handleDeporteSelected(item)}
      >
        {
          (item.icono.endsWith("&ionic") && 
          <Ionicons
          name={item.icono.replace("&ionic", "")}
          color={selectedDeporte !== null && selectedDeporte?.nombre === item.nombre ? '#04D6C8' : '#333'}
          size={60}
        />) ||
        (item.icono.endsWith("&materialcomunnityicons") && 
          <MaterialCommunityIcons
          name={item.icono.replace("&materialcomunnityicons", "")}
          color={selectedDeporte !== null && selectedDeporte?.nombre === item.nombre ? '#04D6C8' : '#333'}
          size={60}
        />) ||
        (item.icono.endsWith("&fontawesome5") && 
          <FontAwesome5
          name={item.icono.replace("&fontawesome5", "")}
          color={selectedDeporte !== null && selectedDeporte?.nombre === item.nombre ? '#04D6C8' : '#333'}
          size={60}
        />)
        }
        <Text style={{ marginTop: 6, textAlign: 'center' }}>{item.nombre}</Text>
      </TouchableOpacity>
    );

    const compareByName = (a: Deporte, b: Deporte) => {
      if (a.nombre < b.nombre) {
        return -1;
      }
      if (a.nombre > b.nombre) {
        return 1;
      }
      return 0;
    };
  
    return (
      <View style={{ flex: 1, maxHeight: height * 0.53 }}>
        <FlatList
          nestedScrollEnabled
          data={deportes?.sort(compareByName)}
          numColumns={3}
          keyExtractor={(item) => item.iddeporte.toString()}
          renderItem={renderDeporteItem}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    );
  };
  
  export default SportTypes;