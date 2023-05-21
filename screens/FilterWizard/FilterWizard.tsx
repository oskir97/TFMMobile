import * as React from "react";
import { StyleSheet } from "react-native";
import Constants from "expo-constants";

// You can import from local files

// or any pure javascript modules available in npm
import { ProgressBar,MD3Colors, Provider as PaperProvider } from 'react-native-paper';


import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Ubicacion from "./steps/UbicacionScreen";
import Deporte from "./steps/DeporteScreen";
import Fecha from "./steps/FechaScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Ubicacion">
          <Stack.Screen name="Ubicación" component={Ubicacion} />
          <Stack.Screen name="Deporte" component={Deporte} />
          <Stack.Screen name="Fecha" component={Fecha} />
        </Stack.Navigator>
      </NavigationContainer>
      </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});