import { FilterData } from "./components/Filter/CustomFilter";
import { Deporte } from "./shared/models/Deporte";

export interface IProps {
    children: React.ReactNode;
  }
  
  export interface InputProps {
    label: string;
    icon?: JSX.Element | null;
    IsSecureText?: boolean | undefined;
    keyboardType?: KeyboardTypeOptions | undefined;
    placeholder?: string | undefined;
    control: any;
    onSubmit?: any;
    nameController: string;
    rules?: any;
    defaultValue?:string;
    errors?:any;
    editable:boolean;
    maxLength:number
  }

  export interface InputDateProps {
    label: string;
    icon?: JSX.Element | null;
    placeholder?: string | undefined;
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
    onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
    buttonClassNames?: string;
    textClassNames?: string;
    buttonText: string;
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
    filter:FilterData |undefined
  }

  export type CustomInputMapsProps = {
    visible:boolean,
    setVisible:any,
    animationType:any,
    title:string,
    onConfirm:any,
    onCancel: any,
    lastlocation:string | undefined
  }