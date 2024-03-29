import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import {
    Image,
    ImageBackground
  } from "react-native";
import { I18nContext, useTranslation } from 'react-i18next';
import { Valoracion } from '../../shared/models/Valoracion';
import { Card } from 'react-native-paper';
import { Rating } from 'react-native-ratings';

export interface ReviewsListProps {
    items: Valoracion[] | undefined
}

const ReviewsList: React.FC<ReviewsListProps> = ({ items }) => {
    const { t } = useTranslation();
    const { i18n } = useContext(I18nContext);
    const renderValoracion = ({ item }: { item: Valoracion }) => {
        const fecha = new Date(item.fecha ? item.fecha?.toString() : new Date().toString());
        const renderImageUser = () => {
            if (item.obtenerUsuarioCreadorValoracion.imagen) {
              return (
                <Image
                  source={{ uri: item.obtenerUsuarioCreadorValoracion.imagen }}
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
            <View style={{ marginVertical: 10 }}>
                <Card style={{ borderColor: "#106F69", borderWidth: 1, backgroundColor: "#F5F5F5" }}>
                    <Card.Title titleStyle={{ fontWeight: 'bold', marginTop:6 }} title={`${t("RESENA_DE")} ${item.obtenerUsuarioCreadorValoracion.nombre} ${item.obtenerUsuarioCreadorValoracion.apellidos}`}
                    left={() => (
                        renderImageUser()
                      )}
                    />
                    <Card.Content style={{marginTop:-8}}>
                        <Text>{fecha.toLocaleDateString(i18n.language == "en" ? 'en-US' : 'es')}</Text>
                        <Rating
                            type='custom'
                            readonly
                            startingValue={item.estrellas}
                            imageSize={20}
                            style={{ alignSelf: 'flex-start', marginBottom: 10 }}
                            ratingColor='orange'
                            ratingBackgroundColor='#c8c7c8'
                            tintColor='#F5F5F5'
                            ratingCount={5}
                            fractions={2}
                        />
                        <Text>{item.comentario}</Text>
                    </Card.Content>
                </Card>
            </View>
        );
    };

    return (
        <>
            {items?.sort((a, b) => new Date(b.fecha ? b.fecha : new Date()).getTime() - new Date(a.fecha ? a.fecha : new Date()).getTime()).map((item: Valoracion, index) => (
                <React.Fragment key={index}>
                    {renderValoracion({ item: item })}
                </React.Fragment>
            ))}
        </>
    );
};

export default ReviewsList;