import React, { ReactNode, createContext, useState } from 'react';
import { Notificacion } from '../../../../models/Notificacion';

interface NotificacionesContextType {
    notificaciones: Notificacion[] | undefined; // Reemplaza 'any[]' con el tipo de datos de tus notificaciones
    setNotificaciones: (notificaciones: Notificacion[]) => void; // Reemplaza 'any[]' con el tipo de datos de tus notificaciones
}

export const NotificacionesContext = createContext<NotificacionesContextType>({} as NotificacionesContextType);

interface NotificacionesProviderProps {
    children: ReactNode;
}

export const NotificacionesProvider: React.FC<NotificacionesProviderProps> = ({ children }) => {
    const [notificaciones, setNotificaciones] = useState<Notificacion[] | undefined>([]); // Reemplaza 'any[]' con el tipo de datos de tus notificaciones

    return (
        <NotificacionesContext.Provider value={{ notificaciones, setNotificaciones }}>
            {children}
        </NotificacionesContext.Provider>
    );
};