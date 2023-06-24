import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import HomePage from '../Home/HomeScreen';
import LoginPage from '../Login/LoginScreen';
import RegisterPage from '../Register/RegisterScreen';
import LoadingPage from '../Loading/LoadingScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { LoginContext, LoginProvider } from '../../shared/services/hooks/login/contexts/LoginContext';
import { MagnifyingGlassIcon, CalendarDaysIcon, AdjustmentsHorizontalIcon, ChatBubbleLeftEllipsisIcon, UserGroupIcon, ClockIcon } from "react-native-heroicons/solid";
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../../components/Drawer/CustomDrawer';
import Ubicacion from "../FilterWizard/steps/UbicacionScreen";
import Deporte from "../FilterWizard/steps/DeporteScreen";
import Fecha from "../FilterWizard/steps/FechaScreen";
import Horario from "../PayWizard/steps/HorarioScreen";
import Resumen from "../PayWizard/steps/ResumScreen";
import ProcessingPago from "../PayWizard/steps/ProcessingPagoScreen";
import CompletedPago from "../PayWizard/steps/CompletedPagoScreen";
import InstalacionPage from "../Home/InstalacionScreen";
import ReviewsPage from "../Home/ReviewsScreen";
import { useTranslation } from 'react-i18next';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Nav: React.FC = () => {
    const { login, loading } = useContext(LoginContext);
    const { t } = useTranslation();

    const inicioLabel = t('RESERVAR');
    const reservasLabel = t('MIS_RESERVAS');
    const partidosLabel = t('MIS_PARTIDOS');
    const eventosLabel = t('MIS_EVENTOS');
    const notificacionesLabel = t('NOTIFICACIONES');
    const ajustesLabel = t('AJUSTES');

    const authNavigator = (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginPage}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterPage}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );

    const loadingNavigator = (
        <Stack.Navigator
            initialRouteName="Loading"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name="Loading"
                component={LoadingPage}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );

    const filterStepsNavigator = (

        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}
            initialRouteName="Inicio"
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: '#04D6C8',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#333',
                drawerLabelStyle: { marginLeft: -25, fontSize: 15 }
            }}>
            <Drawer.Screen name="Ubicación" component={Ubicacion} options={{
                drawerLabel: () => null, drawerItemStyle: {
                    display: 'none',
                },
            }} />
            <Drawer.Screen name="Deporte" component={Deporte} options={{
                drawerLabel: () => null, drawerItemStyle: {
                    display: 'none',
                },
            }} />
            <Drawer.Screen name="Horario" component={Horario} options={{
                drawerLabel: () => null, drawerItemStyle: {
                    display: 'none',
                },
            }} />
            <Drawer.Screen name="Resumen" component={Resumen} options={{
                drawerLabel: () => null, drawerItemStyle: {
                    display: 'none',
                },
            }} />
            <Drawer.Screen name="ProcessingPago" component={ProcessingPago} options={{
                drawerLabel: () => null, drawerItemStyle: {
                    display: 'none',
                },
            }} />
            <Drawer.Screen name="CompletedPago" component={CompletedPago} options={{
                drawerLabel: () => null, drawerItemStyle: {
                    display: 'none',
                },
            }} />
            <Drawer.Screen name="Fecha" component={Fecha} options={{
                drawerLabel: () => null, drawerItemStyle: {
                    display: 'none',
                },
            }} />
            <Drawer.Screen name="Inicio" component={HomePage} options={{
                drawerIcon: ({ color }) => (
                    <MagnifyingGlassIcon size={22} color={color} />
                ),
                drawerLabel: inicioLabel
            }} />
            <Drawer.Screen name="InstalacionScreen" component={InstalacionPage} options={{
                drawerLabel: () => null, drawerItemStyle: {
                    display: 'none',
                },
            }} />
            <Drawer.Screen name="ReviewsScreen" component={ReviewsPage} options={{
                drawerLabel: () => null, drawerItemStyle: {
                    display: 'none',
                },
            }} />
            <Drawer.Screen name="Reservas" component={HomePage} options={{
                drawerIcon: ({ color }) => (
                    <CalendarDaysIcon size={22} color={color} />
                ),
                drawerLabel: reservasLabel
            }} />
            <Drawer.Screen name="Partidos" component={HomePage} options={{
                drawerIcon: ({ color }) => (
                    <UserGroupIcon size={22} color={color} />
                ),
                drawerLabel: partidosLabel
            }} />
            <Drawer.Screen name="Eventos" component={HomePage} options={{
                drawerIcon: ({ color }) => (
                    <ClockIcon size={22} color={color} />
                ),
                drawerLabel: eventosLabel
            }} />
            <Drawer.Screen name="Notificaciones" component={HomePage} options={{
                drawerIcon: ({ color }) => (
                    <ChatBubbleLeftEllipsisIcon size={22} color={color} />
                ),
                drawerLabel: notificacionesLabel
            }} />
            <Drawer.Screen name="Ajustes" component={HomePage} options={{
                drawerIcon: ({ color }) => (
                    <AdjustmentsHorizontalIcon size={22} color={color} />
                ),
                drawerLabel: ajustesLabel
            }} />
        </Drawer.Navigator>
    );

    return (

        <NavigationContainer>
            {loading ? loadingNavigator : (login ? filterStepsNavigator : authNavigator)}
        </NavigationContainer>
    );
};

export default Nav;