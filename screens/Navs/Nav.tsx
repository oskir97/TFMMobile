import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import HomePage from '../Home/HomeScreen';
import LoginPage from '../Login/LoginScreen';
import RegisterPage from '../Register/RegisterScreen';
import LoadingPage from '../Loading/LoadingScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { LoginContext } from '../../shared/services/hooks/login/contexts/LoginContext';
import { HomeIcon, CalendarDaysIcon, AdjustmentsHorizontalIcon, ChatBubbleLeftEllipsisIcon, UserGroupIcon, ClockIcon} from "react-native-heroicons/solid";
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../../components/Drawer/CustomDrawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Nav: React.FC = () => {
    const { login, loading, user, location } = useContext(LoginContext);

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

    const mainNavigator = (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: '#aa18ea',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#333',
                drawerLabelStyle: {marginLeft: -25, fontSize: 15}
            }}>
            <Drawer.Screen name="Inicio" component={HomePage} options={{
                drawerIcon:({color})=>(
                    <HomeIcon size={22} color={color} />
                )
            }}/>
            <Drawer.Screen name="Reservas" component={HomePage}options={{
                drawerIcon:({color})=>(
                    <CalendarDaysIcon size={22} color={color} />
                )
            }}/>
            <Drawer.Screen name="Partidos" component={HomePage}options={{
                drawerIcon:({color})=>(
                    <UserGroupIcon size={22} color={color} />
                )
            }}/>
            <Drawer.Screen name="Eventos" component={HomePage}options={{
                drawerIcon:({color})=>(
                    <ClockIcon size={22} color={color} />
                )
            }}/>
            <Drawer.Screen name="Notificaciones" component={HomePage}options={{
                drawerIcon:({color})=>(
                    <ChatBubbleLeftEllipsisIcon size={22} color={color} />
                )
            }}/>
            <Drawer.Screen name="Ajustes" component={HomePage}options={{
                drawerIcon:({color})=>(
                    <AdjustmentsHorizontalIcon size={22} color={color} />
                )
            }}/>
        </Drawer.Navigator>
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

    return (


        <NavigationContainer>
            {loading ? loadingNavigator : (login ? (mainNavigator) : authNavigator)}
        </NavigationContainer>
    );
};

export default Nav;