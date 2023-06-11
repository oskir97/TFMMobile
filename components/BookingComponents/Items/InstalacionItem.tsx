import { View, FlatList, ScrollView, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Instalacion } from '../../../shared/models/Instalacion';

export interface    InstalacionItemProps {
    key:number,
    item:Instalacion
}

const InstalacionItem: React.FC<InstalacionItemProps> = ({key, item }) => {

    const { t } = useTranslation();

    return (
        <View>

        </View>
    );
};

export default InstalacionItem;