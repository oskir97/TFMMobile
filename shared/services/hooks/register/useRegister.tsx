import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Api } from '../../api';
import { yupResolver } from '@hookform/resolvers/yup';

export type RegisterData = {
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    confirmPassword: string;
    domicilio?: string;
    numero?:string;
    telefono: string;
    telefonoAlternartivo?: string | null;
    fechaNacimiento: Date | undefined;
    codigoPostal?: string | null;
    localidad?: string | null;
    provincia?: string | null;
};

const schema = yup.object().shape({
    nombre: yup.string().required('El nombre es requerido').max(50, 'El nombre no puede tener más de 50 caracteres'),
    apellidos: yup.string().required('Los apellidos son requeridos').max(100, 'Los apellidos no pueden tener más de 100 caracteres'),
    email: yup.string().required('El correo es requerido').email('El correo debe ser válido').max(75, 'El email no puede tener más de 75 caracteres'),
    password: yup.string().required('La contraseña es requerida').max(255, 'La contraseña no puede tener más de 255 carácteres'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
        .required('La confirmación de contraseña es requerida').max(255, 'La contraseña no puede tener más de 255 carácteres'),
    domicilio: yup.string().required('El domicilio es requerido').max(128, 'El domiclio no puede tener más de 128 carácteres'),
    numero: yup.string().max(50, 'El número no puede superar más de 50 carácteres'),
    telefono: yup.string().required('El telefono es requerido').matches(/^\d{9}$/, "El número de teléfono debe tener 9 dígitos").max(9, 'El teléfono no puede tener más de 9 carácteres'),
    telefonoAlternartivo: yup.string().matches(/^\d{9}$/, "El número de teléfono debe tener 9 dígitos").max(9, 'El teléfono alternativo no puede tener más de 9 carácteres'),
    fechaNacimiento: yup.date().required('La fecha es requerida').typeError('Formato de fecha inválido'),
});

export const useRegister = () => {
    const { control, setValue, handleSubmit, formState } = useForm<RegisterData>({
        resolver: yupResolver(schema),
        defaultValues: {
            fechaNacimiento: new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000),
          }
    });

    const api = new Api<any>();

    const handleRegistro = async (data: RegisterData) => {
        try {
            const response = await api.post('/Usuario/Crear', data);
            if (!response.error) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            alert('Ha ocurrido un error al registrar el usuario');
        }
    };

    return {
        control,
        handleSubmit,
        formState,
        handleRegistro,
        setValue
    };
}