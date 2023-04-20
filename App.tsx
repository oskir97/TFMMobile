import { StatusBar } from "expo-status-bar";
import Login from "./screens/Login/LoginScreen";
import React, {
  useContext,
  createContext,
} from "react";
import { TailwindProvider } from "tailwindcss-react-native";
import { LoginContextType } from "./services/hooks/login/contexts/LoginContextType";
import Nav from "./screens/Navs/Nav";
import { LoginProvider, LoginContext } from './services/hooks/login/contexts/LoginContext'

const App: React.FC = () => {
  return (
    <>
      <TailwindProvider>
        {/* TailwindProvider */}
        <StatusBar style="light" />
        <LoginProvider>
          <Nav />
        </LoginProvider>
      </TailwindProvider>
    </>
  );
};

export default App;