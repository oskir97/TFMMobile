import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import cardValidator from 'card-validator';

const VISA = require('../../assets/images/visa.png');
const MASTERCARD = require('../../assets/images/mastercard.png');
const AMEX = require('../../assets/images/amex.png');
const DISCOVER = require('../../assets/images/discover.png');

type Props = {
    cardNumber: string;
};

const CardIcon: React.FC<Props> = (props) => {
    const { card } = cardValidator.number(props.cardNumber);
    const [source,setsource] = useState<any>(null);

    function setCard() {
        let source;
        switch (card?.type) {
            case 'visa':
                source = VISA;
                setsource(VISA);
                break;
            case 'mastercard':
                source = MASTERCARD;
                setsource(MASTERCARD);
                break;
            case 'discover':
                source = DISCOVER;
                setsource(DISCOVER);
                break;
            case 'american-express':
                source=AMEX;
                setsource(AMEX);
                break;
            default:
                break;
        }

        if (!source) setsource(null);
    }

    useEffect(() => {
        setCard();
    }, [card]);

    return <Image style={styles.image} source={source} />;
};

const styles = StyleSheet.create({
    image: {
        width: 48,
        height: 48,
        marginTop:8,
        position:'absolute',
        right: 10
    },
});

export default CardIcon;