import { StatusBar } from "expo-status-bar";
import { TailwindProvider } from "tailwindcss-react-native";
import Nav from "./screens/Navs/Nav";
import { LoginProvider } from './shared/services/hooks/login/contexts/LoginContext'
import "./i18n.config";
import { useTranslation } from "react-i18next";
import { PaperProvider } from "react-native-paper";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.config';


const App: React.FC = () => {
  return (
    <>
      <PaperProvider>
        <TailwindProvider>
          {/* TailwindProvider */}
          <StatusBar style="light" />
          <I18nextProvider i18n={i18n}>
            <LoginProvider>
              <Nav />
            </LoginProvider>
          </I18nextProvider>
        </TailwindProvider>
      </PaperProvider>
    </>
  );
};

export default App;