import React, { useContext } from 'react';

import HomePage from '../Home/HomeScreen';
import LoginPage from '../Login/LoginScreen';
import RegisterPage from '../Register/RegisterScreen';
import LoadingPage from '../Loading/LoadingScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { LoginContext } from '../../services/hooks/login/contexts/LoginContext';

const Stack = createStackNavigator();

const Nav: React.FC = () => {
    const { login, loading } = useContext(LoginContext);

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
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomePage}
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

    return (


        <NavigationContainer>
            {loading? loadingNavigator : (login ? mainNavigator : authNavigator)}
        </NavigationContainer>
    );
};

export default Nav;