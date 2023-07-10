import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Api } from '../../api';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

export type ajustesData = {
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    confirmPassword: string;
    domicilio?: string;
    numero?: string;
    telefono: string;
    telefonoAlternartivo?: string | null;
    fechaNacimiento: Date | undefined;
    codigoPostal?: string | null;
    localidad?: string | null;
    provincia?: string | null;
    fieldName?:string;
};

export const useAjustes = () => {
    const { t } = useTranslation();

    const NOMBRE_REQUERIDO = t("NOMBRE_REQUERIDO");
    const NOMBRE_50_CARACTERES = t("NOMBRE_50_CARACTERES");
    const APELLIDOS_REQUERIDO = t("APELLIDOS_REQUERIDO");
    const APELLIDOS_100_CARACTERES = t("APELLIDOS_100_CARACTERES");
    const CORREO_REQUERIDO = t("CORREO_REQUERIDO");
    const CORREO_VALIDO = t("CORREO_VALIDO");
    const CORREO_75_CARACTERES = t("CORREO_75_CARACTERES");
    const PASSWORD_REQUERIDA = t("PASSWORD_REQUERIDA");
    const CORREO_255_CARACTERES = t("CORREO_255_CARACTERES");
    const PASSWORD_COINCIDIR = t("PASSWORD_COINCIDIR");
    const PASSWORD_CONFIRMACION_REQUERIDA = t("PASSWORD_CONFIRMACION_REQUERIDA");
    const PASSWORD_255_CARACTERES = t("PASSWORD_255_CARACTERES");
    const DOMICILIO_REQUERIDO = t("DOMICILIO_REQUERIDO");
    const DOMICILIO_128_CARACTERES = t("DOMICILIO_128_CARACTERES");
    const NUMERO_50_CARACTERES = t("NUMERO_50_CARACTERES");
    const TELEFONO_REQUERIDO = t("TELEFONO_REQUERIDO");
    const TELEFONO_9_DIGITOS = t("TELEFONO_9_DIGITOS");
    const TELEFONO_9_CARACTERES = t("TELEFONO_9_CARACTERES");
    const TELEFONO_ALTERNATIVO_9_DIGITOS = t("TELEFONO_ALTERNATIVO_9_DIGITOS");
    const TELEFONO_ALTERNATIVO_9_CARACTERES = t("TELEFONO_ALTERNATIVO_9_CARACTERES");
    const FECHA_NACIMIENTO_REQUERIDA = t("FECHA_NACIMIENTO_REQUERIDA");
    const FORMATO_FECHA_INVALIDO = t("FORMATO_FECHA_INVALIDO");
    const ERROR_REGISTRAR_USUARIO = t("ERROR_REGISTRAR_USUARIO");

    const schema = yup.object().shape({
        nombre: yup.string().required(NOMBRE_REQUERIDO).max(50, NOMBRE_50_CARACTERES),
        apellidos: yup.string().required(APELLIDOS_REQUERIDO).max(100, APELLIDOS_100_CARACTERES),
        email: yup.string().required(CORREO_REQUERIDO).email(CORREO_VALIDO).max(75, CORREO_75_CARACTERES),
        password: yup.string().required(PASSWORD_REQUERIDA).max(255, CORREO_255_CARACTERES),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], PASSWORD_COINCIDIR)
            .required(PASSWORD_CONFIRMACION_REQUERIDA).max(255, PASSWORD_255_CARACTERES),
        domicilio: yup.string().required(DOMICILIO_REQUERIDO).max(128, DOMICILIO_128_CARACTERES),
        numero: yup.string().max(50, NUMERO_50_CARACTERES),
        telefono: yup.string().required(TELEFONO_REQUERIDO).matches(/^\d{9}$/, TELEFONO_9_DIGITOS).max(9, TELEFONO_9_CARACTERES),
        telefonoAlternartivo: yup.string().matches(/^\d{9}$/, TELEFONO_ALTERNATIVO_9_DIGITOS).max(9, TELEFONO_ALTERNATIVO_9_CARACTERES),
        fechaNacimiento: yup.date().required(FECHA_NACIMIENTO_REQUERIDA).typeError(FORMATO_FECHA_INVALIDO),
    });
    const { control, setValue, handleSubmit, formState, register, formState: { errors }, reset } = useForm<ajustesData>({
        resolver: yupResolver(schema),
        defaultValues: {
            fechaNacimiento: new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000),
        }
    });

    const api = new Api<ajustesData,any>();

    const handleRegistro = async (data: ajustesData) => {
        try {
            const response = await api.post('/Usuario/Crear', data);
            if (!response.error) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            alert(ERROR_REGISTRAR_USUARIO);
        }
    };

    return {
        control,
        handleSubmit,
        formState,
        handleRegistro,
        setValue,
        errors,
        register,
        reset
    };
}