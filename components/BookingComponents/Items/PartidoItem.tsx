import { View, FlatList, ScrollView, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Reserva } from '../../../shared/models/Reserva';

export interface    PartidoItemProps {
    key:number,
    item:Reserva
}

const PartidoItem: React.FC<PartidoItemProps> = ({key, item }) => {

    const { t } = useTranslation();

    return (
        <View>

        </View>
    );
};

export default PartidoItem;