import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDeportes } from '../../shared/services/hooks/deportes/useDeportes';
import { MaterialIcons } from '@expo/vector-icons';
import { Deporte } from '../../shared/models/Deporte';

export interface SportProps {
    selectedDeporte:any;
    setSelectedDeporte:(deporte: Deporte |undefined) => void;
  }

  const SportTypes: React.FC<SportProps> = ({ setSelectedDeporte, selectedDeporte }) => {
    const { deportes } = useDeportes();

    const handleDeporteSelected = (deporte: Deporte | undefined) => {
        setSelectedDeporte(deporte);
    };

    return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                    style={{ margin: 10, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => handleDeporteSelected(undefined)}
                >
                    <MaterialIcons name="sports" color={selectedDeporte == null  || selectedDeporte == undefined ? '#04D6C8' : "#333"} size={60} />
                    <Text style={{ marginTop: 6, textAlign: 'center' }}>Todos</Text>
                </TouchableOpacity>
                {deportes?.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{ margin: 10, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => handleDeporteSelected(item)}
                    >
                        <Ionicons name={item.icono} color={selectedDeporte != null && selectedDeporte.nombre == item.nombre ? '#04D6C8' : "#333"} size={60} />
                        <Text style={{ marginTop: 6, textAlign: 'center' }}>{item.traduccionesDeporte[0].nombre}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
    )
}

export default SportTypes;