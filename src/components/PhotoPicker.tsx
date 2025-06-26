import React, { useState } from 'react';
import { View, Text, Alert, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './ui/Button';
import { pickImageFromLibrary, takePhoto } from '../utils/imageUtils';

interface PhotoPickerProps {
  onImageSelected: (uri: string) => void;
  onError: (error: string) => void;
}

const PhotoPicker = ({ onImageSelected, onError }: PhotoPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePickFromLibrary = async () => {
    try {
      setLoading(true);
      setModalVisible(false);
      
      const result = await pickImageFromLibrary();
      if (result) {
        onImageSelected(result.uri);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to pick image';
      onError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      setLoading(true);
      setModalVisible(false);
      
      const result = await takePhoto();
      if (result) {
        onImageSelected(result.uri);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to take photo';
      onError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        title="Add Outfit Photo"
        onPress={() => setModalVisible(true)}
        loading={loading}
        style={{ marginBottom: 16 }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Choose Photo Source
            </Text>
            
            <TouchableOpacity
              onPress={handleTakePhoto}
              style={styles.optionButton}
            >
              <Ionicons name="camera" size={24} color="#0ea5e9" />
              <Text style={styles.optionText}>
                Take Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePickFromLibrary}
              style={[styles.optionButton, { marginBottom: 24 }]}
            >
              <Ionicons name="images" size={24} color="#0ea5e9" />
              <Text style={styles.optionText}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>

            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              variant="outline"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1f2937',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  optionText: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '500',
    color: '#1f2937',
  },
});

export { PhotoPicker }; 