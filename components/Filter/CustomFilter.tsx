import React, { useState } from "react";
import { Text, StyleSheet, View, Modal, Button, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { FilterProps } from "../../tfmmobile";
import { XCircleIcon } from "react-native-heroicons/solid";
import Ionicons from "@expo/vector-icons/Ionicons";
import SportTypes from "../SportTypes/SportTypes";
import { MaterialIcons } from "@expo/vector-icons";
import CustomTextInput from "../InputText/CustomTextInput";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import { Deporte } from "../../shared/models/Deporte";
import CustomDateInput from "../InputDate/CustomDateInput";

export enum Sort {
    Distancia,
    Valoracion,
    Precio
}

export type FilterData = {
    localidad: string;
    fecha: Date | undefined;
    deporte: Deporte | null;
    sort: Sort | null;
};

const schema = yup.object().shape({
    localidad: yup.string().required('La localidad es requerida'),
    fecha: yup.date().required('La fecha es requerida').min(
        new Date(Date.now()),
        'Debes ser mayor o igual a hoy'
      ).typeError('Formato de fecha inválido'),
});

const CustomFilter: React.FC<FilterProps> = ({ visible, onConfirm, onCancel, title, transparent, animationType, localidad }) => {

    const [selectedDeporte, setSelectedDeporte] = useState<Deporte | null>(null);
    const [selectedSort, setSort] = useState<Sort | null>(null);

    const { control, setValue, handleSubmit, formState } = useForm<FilterData>({
        resolver: yupResolver(schema),
        defaultValues: {
            localidad: localidad,
            fecha: new Date(Date.now())
        }
    });

    const onSubmit = async (data: FilterData) => {
        data.sort = selectedSort
        data.deporte = selectedDeporte
        onConfirm(data);
    };

    return (
        <>
            <Modal transparent={transparent} visible={visible} animationType={animationType}>
                <View style={styles.container}>
                    <View style={styles.modal}>
                        <ScrollView style={{ padding: 20 }}>
                            <Text style={styles.title}>{title}</Text>
                            <CustomTextInput
                                nameController="localidad"
                                control={control}
                                label="¿Dónde te gustaría jugar?"
                                placeholder="Introduce la localidad"
                                editable={true}
                                maxLength={50}
                                rules={{
                                    required: { value: true },
                                    pattern: {
                                        value: true
                                    }
                                }}
                                errors={formState.errors.localidad && (
                                    <Text className="text-error">{formState.errors.localidad.message}</Text>
                                )}
                                onSubmit={handleSubmit(onSubmit)}
                            />
                            <Text className="font-semibold">¿Qué deporte te gustaría jugar?</Text>
                            <SportTypes onDeporteSelected={setSelectedDeporte} />
                            <CustomDateInput
                                nameController="fecha"
                                control={control}
                                label="¿Qué fecha?"
                                placeholder="Introduce la fecha"
                                minDate={new Date(Date.now())}
                                mode="date"
                                rules={{
                                    required: { value: true },
                                    pattern: {
                                        value: true
                                    }
                                }}
                                errors={formState.errors.fecha && (
                                    <Text className="text-error">{formState.errors.fecha.message}</Text>
                                )}
                                onSubmit={handleSubmit(onSubmit)}
                            />
                            <Text className="font-semibold mt-2 mb-4">¿Por qué quieres ordenar?</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <TouchableOpacity
                                    style={{
                                        marginHorizontal: 10,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        borderWidth: 1,
                                        borderColor: "#D0D0D0",
                                        padding: 10,
                                        borderRadius: 20,
                                        width: 120,
                                        justifyContent: "center",
                                        backgroundColor: selectedSort == Sort.Distancia ? '#aa18ea' : 'white',
                                    }}
                                    onPress={() => setSort(Sort.Distancia)}
                                >
                                    <Text style={{ marginRight: 6, color: selectedSort == Sort.Distancia ? 'white' : 'black' }}>Distancia</Text>
                                    <Ionicons name="filter" style={{ marginRight: 6, color: selectedSort == Sort.Distancia ? 'white' : 'black' }} size={20} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        marginHorizontal: 10,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        borderWidth: 1,
                                        borderColor: "#D0D0D0",
                                        padding: 10,
                                        borderRadius: 20,
                                        width: 120,
                                        justifyContent: "center",
                                        backgroundColor: selectedSort == Sort.Valoracion ? '#aa18ea' : 'white',
                                    }}
                                    onPress={() => setSort(Sort.Valoracion)}
                                >
                                    <Text style={{ marginRight: 6, color: selectedSort == Sort.Valoracion ? 'white' : 'black' }}>Valoración</Text>
                                    <Ionicons name="filter" style={{ marginRight: 6, color: selectedSort == Sort.Valoracion ? 'white' : 'black' }} size={20} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        marginHorizontal: 10,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        borderWidth: 1,
                                        borderColor: "#D0D0D0",
                                        padding: 10,
                                        borderRadius: 20,
                                        width: 120,
                                        justifyContent: "center",
                                        backgroundColor: selectedSort == Sort.Precio ? '#aa18ea' : 'white',
                                    }}
                                    onPress={() => setSort(Sort.Precio)}
                                >
                                    <Text style={{ marginRight: 6, color: selectedSort == Sort.Precio ? 'white' : 'black' }}>Precio</Text>
                                    <Ionicons name="filter" style={{ marginRight: 6, color: selectedSort == Sort.Precio ? 'white' : 'black' }} size={20} color="black" />
                                </TouchableOpacity>

                            </ScrollView>

                            <View style={styles.buttoms}>
                                <TouchableOpacity style={styles.buttomConfirm} onPress={() => onSubmit}>
                                    <Text style={styles.buttomText}>Filtrar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttomCancel} onPress={onCancel}>
                                    <Text style={styles.buttomText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.cancel} onPress={onCancel}>
                                <XCircleIcon size={24} color="#999" />
                            </TouchableOpacity>
                        </ScrollView>

                    </View>
                </View>
            </Modal>
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 5,
        width: '95%',
        maxWidth: 400,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 4,
        textAlign: 'left'
    },
    buttoms: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20
    },
    buttomConfirm: {
        marginLeft: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#aa18ea',
        borderRadius: 4,
    },
    buttomCancel: {
        marginLeft: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#999',
        borderRadius: 4,
    },
    buttomText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancel: {
        position: 'absolute',
        top: 4,
        right: 8,
    },
});
export default CustomFilter;
