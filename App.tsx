import { StatusBar } from "expo-status-bar";
import { TailwindProvider } from "tailwindcss-react-native";
import Nav from "./screens/Navs/Nav";
import { LoginProvider } from './shared/services/hooks/login/contexts/LoginContext'
import "./i18n.config";
import { useTranslation } from "react-i18next";
import LanguagePicker from "./components/LanguagePicker/CustomLanguagePicker";
import { PaperProvider } from "react-native-paper";


const App: React.FC = () => {
  return (
    <>
      <PaperProvider>
        <TailwindProvider>
          {/* TailwindProvider */}
          <StatusBar style="light" />
          <LanguagePicker />
          <LoginProvider>
            <Nav />
          </LoginProvider>
        </TailwindProvider>
      </PaperProvider>
    </>
  );
};

export default App;