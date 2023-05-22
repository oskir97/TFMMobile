import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { XCircleIcon } from 'react-native-heroicons/solid';

interface CustomConfirmationModalProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CustomConfirmationModal: React.FC<CustomConfirmationModalProps> = ({ visible, onConfirm, onCancel, message }) => {

  const { t } = useTranslation();

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttoms}>
            <TouchableOpacity style={styles.buttomConfirm} onPress={onConfirm}>
              <Text style={styles.buttomText}>{t("ACEPTAR")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttomCancel} onPress={onCancel}>
              <Text style={styles.buttomText}>{t("CANCELAR")}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.cancel} onPress={onCancel}>
            <XCircleIcon size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  message: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 15,
    marginBottom: 16,
    textAlign: 'center'
  },
  buttoms: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    top: 8,
    right: 8,
  },
});

export default CustomConfirmationModal;