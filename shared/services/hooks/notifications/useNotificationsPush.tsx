import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface NotificationProps {
    title: string;
    body: string;
    url: string;
    navigation: any;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

const showNotification = ({ title, body, url, navigation }: NotificationProps) => {

    const mostrarNotificacion = async () => {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
              name: 'default',
              importance: Notifications.AndroidImportance.MAX,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: '#FF231F7C',
            });
          }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                data: { url:url },
            },
            trigger: { seconds: 2 },
        });
    };

    mostrarNotificacion();

    const notificationResponseListener = Notifications.addNotificationResponseReceivedListener((response) => {
        const { url } = response.notification.request.content.data;
        if (url) {
            navigation.navigate(url as never);
        }
    });

    return () => {
        Notifications.removeNotificationSubscription(notificationResponseListener);
    };
};

export default showNotification;