import { Deporte } from "./shared/models/Deporte";
import { Ubication } from "../../shared/models/Ubication";

export interface IProps {
    children: React.ReactNode;
  }
  
  export interface InputProps {
    label: string;
    icon?: string;
    IsSecureText?: boolean | undefined;
    keyboardType?: KeyboardTypeOptions | undefined;
    placeholder?: any;
    control: any;
    onSubmit?: any;
    nameController: string;
    rules?: any;
    defaultValue?:string;
    errors?:any;
    editable:boolean;
    maxLength:number
    valueAssign?:any;
    onFocus?:any;
    onPressIn?:any;
    onSelectIcon?:any;
    ref?:any;
    autoCapitalize?:any;
  }

  export interface InputDateProps {
    label: string;
    icon?: JSX.Element | null;
    placeholder?: any;
    control: any;
    onSubmit?: any;
    nameController: string;
    rules?: any;
    defaultValue?:string;
    errors?:any;
    mode:AndroidMode;
    maxDate?:Date|undefined;
    minDate?:Date|undefined;
  }

  export interface InputPickerProps {
    label: string;
    icon?: JSX.Element | null;
    placeholder?: string | undefined;
    control: any;
    onSubmit?: any;
    nameController: string;
    rules?: any;
    defaultValue?:string;
    errors?:any;
    itemsMapping:any;
  }

  export interface InputPostalCodeProps {
    iconCodigoPostal?: JSX.Element | null;
    iconProvincia?: JSX.Element | null;
    iconLocalidad?: JSX.Element | null;
    control: any;
    nameControllerCodigoPostal: string;
    nameControllerProvincia: string;
    nameControllerLocalidad: string;
    rules?: any;
    defaultValueCodigoPostal?:string;
    defaultValueProvincia?:string;
    defaultValueLocalidad?:string;
    errorsCodigoPostal?:any;
    errorsProvincia?:any;
    errorsLocalidad:any;
    editable:boolean;
    maxLength:number;
    onSubmit?: any;
    keyboardType?: KeyboardTypeOptions | undefined;
  }
  
  export interface CustomButtonProps {
    onPress: ((event: GestureResponderEvent) => void);
    buttonText: string;
    colorButtom:string;
    colorText:string;
    colorButtomHover:string;
    colorTextHover:string;
    iconLeft?:string;
    iconRight?:string;
  }

  export type NavStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
  }

  export type FilterProps = {
    visible:boolean,
    setVisible:any,
    transparent:boolean,
    animationType:any,
    title:string,
    onConfirm:any,
    onCancel: any,
    filter:Filter | undefined
  }

  export type CustomInputMapsProps = {
    visible:boolean,
    setVisible:any,
    animationType:any,
    title:string,
    onConfirm:any,
    onCancel: any,
    lastlocation:Ubication | undefined,
    login:boolean
  }

  export type CustomInputTextMapsProps = {
    setLocation?:any;
  }

  export type MenuProps = {
    showReturnWizard:boolean;
    showLang:boolean;
    text?:string;
    showusuario?:any;
    userMenu?:any;
  }