import { View, FlatList, ScrollView, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Evento } from '../../../shared/models/Evento';

export interface EventoItemProps {
    key: number,
    item: Evento
}

const EventoItem: React.FC<EventoItemProps> = ({ key, item }) => {

    const { t } = useTranslation();

    return (
        <View>

        </View>
    );
};

export default EventoItem;