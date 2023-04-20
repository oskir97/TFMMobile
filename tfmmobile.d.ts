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
    onSubmit: any;
    nameController: string;
    rules?: any;
    defaultValue?:string;
    errors?:any;
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