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
import CustomInputMaps from "../Modals/CustomInputModalMaps";
import { useTranslation } from "react-i18next";

export enum Sort {
    Distancia,
    Valoracion,
    Precio
}

export type FilterData = {
    fecha: Date | undefined;
    deporte: Deporte | undefined;
    sort: Sort | undefined;
};

const CustomFilter: React.FC<FilterProps> = ({ visible, onConfirm, onCancel, title, transparent, animationType, filter }) => {

    const [selectedDeporte, setSelectedDeporte] = useState<Deporte | undefined>(filter?.deporte);
    const [selectedSort, setSort] = useState<Sort | undefined>(filter?.sort);
    const [fecha, setFecha] = useState<Date |undefined>(filter?.fecha);
    const { t } = useTranslation();

    const { control, handleSubmit, formState } = useForm<FilterData>({
        defaultValues: {
            fecha: fecha
        }
    });

    const onSubmit = async (data: FilterData) => {
        setFecha(data.fecha);
        data.sort = selectedSort
        data.deporte = selectedDeporte
        onConfirm(data);
    };

    const reset = () => {
        setFecha(new Date());
        setSelectedDeporte(undefined);
        setSort(undefined);
        onConfirm({fecha:fecha, deporte:selectedDeporte, sort:selectedSort});
    };

    return (
        <>
            <Modal transparent={transparent} visible={visible} animationType={animationType}>
                <View style={styles.container}>
                    <View style={styles.modal}>
                        <View style={{ padding: 20 }}>
                            <Text style={styles.title}>{title}</Text>
                            <Text className="font-semibold">{t('QUE_DEPORTE_JUGAR')}</Text>
                            <SportTypes setSelectedDeporte={setSelectedDeporte} selectedDeporte={selectedDeporte} />
                            <CustomDateInput
                                nameController="fecha"
                                control={control}
                                label="¿Qué fecha?"
                                placeholder="Introduce la fecha"
                                minDate={new Date()}
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
                            <Text className="font-semibold mt-2 mb-4">{t('POR_QUE_ORDENAR')}</Text>
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
                                        backgroundColor: selectedSort == Sort.Distancia ? '#04D6C8' : 'white',
                                    }}
                                    onPress={() => setSort(Sort.Distancia)}
                                >
                                    <Text style={{ marginRight: 6, color: selectedSort == Sort.Distancia ? 'white' : 'black' }}>{t('DISTANCIA')}</Text>
                                    <Ionicons name="filter" style={{ marginRight: 6, color: selectedSort == Sort.Distancia ? 'white' : 'black' }} size={20} />
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
                                        backgroundColor: selectedSort == Sort.Valoracion ? '#04D6C8' : 'white',
                                    }}
                                    onPress={() => setSort(Sort.Valoracion)}
                                >
                                    <Text style={{ marginRight: 6, color: selectedSort == Sort.Valoracion ? 'white' : 'black' }}>{t('VALORACION')}</Text>
                                    <Ionicons name="filter" style={{ marginRight: 6, color: selectedSort == Sort.Valoracion ? 'white' : 'black' }} size={20} />
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
                                        backgroundColor: selectedSort == Sort.Precio ? '#04D6C8' : 'white',
                                    }}
                                    onPress={() => setSort(Sort.Precio)}
                                >
                                    <Text style={{ marginRight: 6, color: selectedSort == Sort.Precio ? 'white' : 'black' }}>{t('PRECIO')}</Text>
                                    <Ionicons name="filter" style={{ marginRight: 6, color: selectedSort == Sort.Precio ? 'white' : 'black' }} size={20} />
                                </TouchableOpacity>

                            </ScrollView>
                            <View>
                                <Text className="font-semibold mt-2 mb-4">{t('REINICIAR_BUSQUEDA')}</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}>
                                    <TouchableOpacity style={styles.buttomReset} onPress={()=>reset()}>
                                        <Text style={{
                                            color: 'black',
                                            fontWeight: 'bold',
                                        }}>{t('RESETEAR_FILTROS')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.buttoms}>
                                <TouchableOpacity style={styles.buttomConfirm} onPress={handleSubmit(onSubmit)}>
                                    <Text style={styles.buttomText}>{t('FILTRAR')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttomCancel} onPress={onCancel}>
                                    <Text style={styles.buttomText}>{t('CANCELAR')}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.cancel} onPress={onCancel}>
                                <XCircleIcon size={24} color="#999" />
                            </TouchableOpacity>
                        </View>

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
        marginBottom: 20,
        textAlign: 'left'
    },
    buttoms: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20
    },
    buttomReset: {
        marginHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        width: 160,
        justifyContent: "center",
        backgroundColor: 'white',
        borderRadius: 4,
    },
    buttomConfirm: {
        marginLeft: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#04D6C8',
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
