import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Tarjeta } from '../../shared/models/Tarjeta';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

export type PaymentMethodType = 'Tarjeta' | 'Paypal';

interface PaymentMethodSelectorProps {
    obtainMethodPayment: (methodType: PaymentMethodType, card: Tarjeta) => void;
}


const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ obtainMethodPayment }) => {
    const [methodType, setMethodType] = useState<PaymentMethodType | undefined>(undefined);
    const [card, setCard] = useState<Tarjeta | undefined>(undefined);
    const { t } = useTranslation();
    const onPress = () => {

    }
    return (
        <View style={{ marginVertical: 48, width: '100%' }}>
            <Text style={{
                marginBottom:20,
                fontSize: 14,
                letterSpacing: 1.5,
                fontWeight:'bold',
                color: 'black',
                textTransform: 'uppercase',
                textAlign: 'center',
            }}>
                {t("SELECCIONA_METODO_PAGO")}
            </Text>
            {!methodType &&
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems:'center',
                    marginHorizontal: 16,
                    marginTop: 8
                }}>
                    <Pressable onPress={() => setMethodType('Paypal')} style={styles.selectButton}>
                        <Icon name="paypal" size={24} color="#007DFF" />
                    </Pressable>
                    <Pressable onPress={() => setMethodType('Tarjeta')} style={[styles.selectButton,{marginLeft:20}]}>
                        <Text style={styles.boldText}>Card</Text>
                    </Pressable>
                </View>
            }
            {/* If there's a paymentMethod selected, show it */}
            {methodType &&
                <Pressable
                    onPress={onPress}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 8,
                    }}
                >
                    {methodType != 'Paypal' &&
                        <View style={[styles.selectButton, { marginRight: 16 }]}>
                            <Text style={[styles.boldText, { color: '#007DFF' }]}>
                                {card?.numero}
                            </Text>
                        </View>
                    } ||
                    {methodType == 'Paypal' &&
                    <View style={[styles.selectButton, { marginRight: 16 }]}>
                        <Text style={[styles.boldText, { color: '#007DFF' }]}>
                            {card?.numero}
                        </Text>
                    </View>
                }
                    <Text style={[styles.boldText, { color: '#007DFF', flex: 1 }]}>
                        Change payment method
                    </Text>
                </Pressable>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    screen: {
        alignSelf: 'stretch',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    productRow: {
        paddingVertical: 24,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        width: '75%',
    },
    buyButton: {
        backgroundColor: '#007DFF',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
    },
    textButton: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
        color: '#007DFF'
    },
    selectButton: {
        borderColor: '#007DFF',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 2,
    },
    boldText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#007DFF'
    }
});

export default PaymentMethodSelector;