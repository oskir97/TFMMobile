import { StatusBar } from "expo-status-bar";
import { TailwindProvider } from "tailwindcss-react-native";
import Nav from "./screens/Navs/Nav";
import { LoginProvider } from './shared/services/hooks/login/contexts/LoginContext'
import "./i18n.config";

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