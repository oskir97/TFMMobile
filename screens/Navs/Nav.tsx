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
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../../components/Drawer/CustomDrawer';
import Ubicacion from "../FilterWizard/steps/UbicacionScreen";
import Deporte from "../FilterWizard/steps/DeporteScreen";
import Fecha from "../FilterWizard/steps/FechaScreen";
import Horario from "../PayWizard/steps/HorarioScreen";
import Resumen from "../PayWizard/steps/ResumScreen";
import CreatePartido from "../PayWizard/steps/CreatePartidoScreen";
import PagandoPage from "../PayWizard/steps/ProcessingPagoScreen";
import CompletedPago from "../PayWizard/steps/CompletedPagoScreen";
import InstalacionPage from "../Home/InstalacionScreen";
import EventoPage from "../Home/EventoScreen";
import PartidoPage from "../Home/PartidoScreen";
import ReviewsPage from "../Home/ReviewsScreen";
import ReservasPage from "../Reservas/ReservasScreen";
import EventosPage from "../Eventos/EventosScreen";
import NotificacionesPage from "../Notificaciones/NotificacionesScreen";
import NotificacionPage from "../Notificaciones/NotificacionScreen";
import PartidosPage from "../Partidos/PartidosScreen";
import AjustesPage from "../Ajustes/AjustesScreen";
import { useTranslation } from 'react-i18next';
import { NotificacionesContext } from '../../shared/services/hooks/notifications/contexts/NotificationContext';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Nav: React.FC = () => {
    const { login, loading, pagando } = useContext(LoginContext);
    const { notificaciones } = useContext(NotificacionesContext);
    const { t } = useTranslation();

    const inicioLabel = t('RESERVAR');
    const reservasLabel = t('MIS_RESERVAS');
    const partidosLabel = t('MIS_PARTIDOS');
    const eventosLabel = t('MIS_EVENTOS');
    const notificacionesLabel = t('NOTIFICACIONES') + (notificaciones.filter(n=>!n.leida).length > 0 ? " " + `(${notificaciones.filter(n=>!n.leida).length})` : "");
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

    const pagandoNavigator = (
        <Stack.Navigator
            initialRouteName="Pagando"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name="Pagando"
                component={PagandoPage}
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
            <Drawer.Screen name="CreatePartido" component={CreatePartido} options={{
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
            <Drawer.Screen name="EventoScreen" component={EventoPage} options={{
                drawerLabel: () => null, drawerItemStyle: {
                    display: 'none',
                },
            }} />
            <Drawer.Screen name="PartidoScreen" component={PartidoPage} options={{
                drawerLabel: () => null, drawerItemStyle: {
                    display: 'none',
                },
            }} />
            <Drawer.Screen name="ReviewsScreen" component={ReviewsPage} options={{
                drawerLabel: () => null, drawerItemStyle: {
                    display: 'none',
                },
            }} />
            <Drawer.Screen name="Reservas" component={ReservasPage} options={{
                drawerIcon: ({ color }) => (
                    <CalendarDaysIcon size={22} color={color} />
                ),
                drawerLabel: reservasLabel
            }} />
            <Drawer.Screen name="Partidos" component={PartidosPage} options={{
                drawerIcon: ({ color }) => (
                    <UserGroupIcon size={22} color={color} />
                ),
                drawerLabel: partidosLabel
            }} />
            <Drawer.Screen name="Eventos" component={EventosPage} options={{
                drawerIcon: ({ color }) => (
                    <ClockIcon size={22} color={color} />
                ),
                drawerLabel: eventosLabel
            }} />
            <Drawer.Screen name="Notificaciones" component={NotificacionesPage} options={{
                drawerIcon: ({ color }) => (
                    notificaciones.filter(n => !n.leida).length > 0 ?<MaterialIcon name="notifications-active" size={22} color="red" /> : <IonicIcon name="notifications" size={22} color={color} />

                ),
                drawerLabel: notificacionesLabel
            }} />
            <Drawer.Screen name="Notificacion" component={NotificacionPage} options={{
                drawerLabel: () => null, drawerItemStyle: {
                    display: 'none',
                },
            }} />
            <Drawer.Screen name="Ajustes" component={AjustesPage} options={{
                drawerIcon: ({ color }) => (
                    <AdjustmentsHorizontalIcon size={22} color={color} />
                ),
                drawerLabel: ajustesLabel
            }} />
        </Drawer.Navigator>
    );

    return (

        <NavigationContainer>
            {pagando ? pagandoNavigator : (loading ? loadingNavigator : (login ? filterStepsNavigator : authNavigator))}
        </NavigationContainer>
    );
};

export default Nav;