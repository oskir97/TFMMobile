import React, { useState } from "react";
import { Text, StyleSheet, View, Modal, Button, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { FilterProps } from "../../tfmmobile";
import { CalendarDaysIcon, ClockIcon, UserGroupIcon, XCircleIcon } from "react-native-heroicons/solid";
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
import { Filter, Sort, TypeReservation } from "../../shared/models/Filter";
import { Checkbox } from 'react-native-paper';
import CustomButton from "../Buttons/CustomButton";

const CustomFilter: React.FC<FilterProps> = ({ visible, onConfirm, onCancel, title, transparent, animationType, filter }) => {

    const [selectedType, setSelectedType] = useState<TypeReservation | undefined>(filter?.type ? filter?.type : "Pista");
    const [selectedSort, setSort] = useState<Sort | undefined>(filter?.sort ? filter?.sort : "Distancia");
    const [desc, setDesc] = useState(selectedSort ? selectedSort.toLowerCase().includes("desc") : false);
    const { t } = useTranslation();

    const { handleSubmit } = useForm<Filter>({
    });

    const handleToggle = () => {
        const newChecked = !desc;
        setDesc(newChecked);
    };

    const onSubmit = () => {
        if(selectedType != "Pista" && selectedSort == "Favoritos"){
            setSort('Distancia');
            filter.sort = 'Distancia'
        }
        if (selectedSort)
            filter.sort = selectedSort != "Favoritos" ? (selectedSort?.replace(" desc", "") + (desc ? " desc" : "")) : "Favoritos";
        else
            filter.sort = false;

        filter.type = selectedType

        onConfirm(filter);
    };

    return (
        <Modal transparent={transparent} visible={visible} animationType={animationType}>
            <View style={styles.container}>
                <View style={styles.modal}>
                    <View style={{ padding: 20 }}>
                        <Text style={styles.title}>{title}</Text>
                        <Text className="font-semibold" style={{ fontSize: 18 }}>{t('QUE_RESERVAR')}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                                <TouchableOpacity
                                    style={{ marginRight: 10,marginTop: 10,marginBottom: 10, alignItems: 'center', justifyContent: 'center' }}
                                    onPress={() => setSelectedType("Pista")}
                                >
                                    <CalendarDaysIcon color={selectedType && selectedType == 'Pista' ? '#04D6C8' : "#333"} size={60} />
                                    <Text style={{ marginTop: 6, textAlign: 'center' }}>{t('PISTA')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ margin: 10, alignItems: 'center', justifyContent: 'center' }}
                                    onPress={() => setSelectedType("Partido")}
                                >
                                    <UserGroupIcon color={selectedType && selectedType == 'Partido' ? '#04D6C8' : "#333"} size={60} />
                                    <Text style={{ marginTop: 6, textAlign: 'center' }}>{t('PARTIDO')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ margin: 10, alignItems: 'center', justifyContent: 'center' }}
                                    onPress={() => setSelectedType("Evento")}
                                >
                                    <ClockIcon color={selectedType && selectedType == 'Evento' ? '#04D6C8' : "#333"} size={60} />
                                    <Text style={{ marginTop: 6, textAlign: 'center' }}>{t('EVENTO')}</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                        <Text className="font-semibold mt-2 mb-4" style={{ fontSize: 18, marginBottom: 20 }}>{t('POR_QUE_ORDENAR')}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                            <TouchableOpacity
                                style={{
                                    marginHorizontal: 5,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: "#D0D0D0",
                                    padding: 10,
                                    borderRadius: 20,
                                    width: 120,
                                    justifyContent: "center",
                                    backgroundColor: (selectedSort?.replace(" desc", "") == "Distancia") ? '#04D6C8' : 'white',
                                }}
                                onPress={() => { setSort("Distancia"); setDesc(false); }}
                            >
                                <Text style={{ marginRight: 6, color: selectedSort?.replace(" desc", "") == "Distancia" ? 'white' : 'black' }}>{t('DISTANCIA')}</Text>
                                <Ionicons name="navigate" style={{ marginRight: 6, color: selectedSort?.replace(" desc", "") == "Distancia" ? 'white' : 'black' }} size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    marginHorizontal: 5,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: "#D0D0D0",
                                    padding: 10,
                                    borderRadius: 20,
                                    width: 120,
                                    justifyContent: "center",
                                    backgroundColor: selectedSort?.replace(" desc", "") == "Valoracion" ? '#04D6C8' : 'white',
                                }}
                                onPress={() => { setSort("Valoracion"); setDesc(false); }}
                            >
                                <Text style={{ marginRight: 6, color: selectedSort?.replace(" desc", "") == "Valoracion" ? 'white' : 'black' }}>{t('VALORACION')}</Text>
                                <Ionicons name="star" style={{ marginRight: 6, color: selectedSort?.replace(" desc", "") == "Valoracion" ? 'white' : 'black' }} size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    marginHorizontal: 5,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: "#D0D0D0",
                                    padding: 10,
                                    borderRadius: 20,
                                    width: 120,
                                    justifyContent: "center",
                                    backgroundColor: selectedSort?.replace(" desc", "") == "Precio" ? '#04D6C8' : 'white',
                                }}
                                onPress={() => { setSort("Precio"); setDesc(true); }}
                            >
                                <Text style={{ marginRight: 6, color: selectedSort?.replace(" desc", "") == "Precio" ? 'white' : 'black' }}>{t('PRECIO')}</Text>
                                <Ionicons name="cash" style={{ marginRight: 6, color: selectedSort?.replace(" desc", "") == "Precio" ? 'white' : 'black' }} size={20} />
                            </TouchableOpacity>
                            {
                                selectedType == "Pista" &&
                                <TouchableOpacity
                                    style={{
                                        marginHorizontal: 5,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        borderWidth: 1,
                                        borderColor: "#D0D0D0",
                                        padding: 10,
                                        borderRadius: 20,
                                        width: 120,
                                        justifyContent: "center",
                                        backgroundColor: selectedSort == "Favoritos" ? '#04D6C8' : 'white',
                                    }}
                                    onPress={() => { setSort("Favoritos"); setDesc(true); }}
                                >
                                    <Text style={{ marginRight: 6, color: selectedSort == "Favoritos" ? 'white' : 'black' }}>{t('FAVORITOS')}</Text>
                                    <Ionicons name="ios-heart" style={{ marginRight: 6, color: selectedSort == "Favoritos" ? 'white' : 'black' }} size={20} />
                                </TouchableOpacity>
                            }

                        </ScrollView>
                        {
                            selectedSort != "Favoritos" &&
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Checkbox.Item label={t('ORDENAR_DESCENDENTE')} status={desc ? 'checked' : 'unchecked'} labelStyle={{ fontSize: 14 }} color="#04D6C8" onPress={handleToggle} />
                            </View>
                        }

                        <CustomButton
                            onPress={onSubmit}
                            buttonText={t("FILTRAR")}
                            colorButtom='#04D6C8'
                            colorText='white'
                            colorButtomHover="#04D6C8"
                            colorTextHover="white"

                        // onPress={() => console.log(password)}
                        />
                        <CustomButton
                            onPress={onCancel}
                            buttonText={t("CANCELAR")}
                            colorButtom='transparent'
                            colorText='#04D6C8'
                            colorButtomHover="#04D6C850"
                            colorTextHover="white"
                        // onPress={() => console.log(password)}
                        />
                        <TouchableOpacity style={styles.cancel} onPress={onCancel}>
                            <XCircleIcon size={24} color="#999" />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
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
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'left'
    },
    buttoms: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 40
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
