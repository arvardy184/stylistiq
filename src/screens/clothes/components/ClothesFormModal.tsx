import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Clothes, ClothesFormData, CLOTHES_CATEGORIES, CLOTHES_COLORS } from '../types';
import * as ImagePicker from 'expo-image-picker';

interface ClothesFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ClothesFormData) => void;
  initialData?: Clothes | null;
  title: string;
  submitText: string;
}

const ClothesFormModal: React.FC<ClothesFormModalProps> = ({ visible, onClose, onSubmit, initialData, title, submitText }) => {
  const [formData, setFormData] = useState<ClothesFormData>({
    itemType: '',
    category: '',
    color: '',
    note: '',
    image: undefined,
  });
  const [imageUri, setImageUri] = useState<string | undefined>(initialData?.image);

  useEffect(() => {
    if (initialData) {
      setFormData({
        itemType: initialData.itemType || '',
        category: initialData.category || '',
        color: initialData.color || '',
        note: initialData.note || '',
        image: initialData.image || undefined,
      });
      setImageUri(initialData.image);
    } else {
      // Reset form when adding new
      setFormData({ itemType: '', category: '', color: '', note: '', image: undefined });
      setImageUri(undefined);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof ClothesFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      handleInputChange('image', result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.itemType || !formData.category || !formData.color) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }
    onSubmit(formData);
    onClose(); // Close modal after submit
  };
  
  const renderPicker = (label: string, selectedValue: string, onValueChange: (value: string) => void, items: readonly string[]) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 5 }}>
            {items.map(item => (
                <TouchableOpacity 
                    key={item} 
                    style={[styles.chip, selectedValue === item && styles.chipSelected]}
                    onPress={() => onValueChange(item)}
                >
                    <Text style={[styles.chipText, selectedValue === item && styles.chipTextSelected]}>{item}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-circle" size={28} color="#D1D5DB" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={32} color="#9CA3AF" />
                  <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Item Type*</Text>
                <TextInput
                    style={styles.input}
                    value={formData.itemType}
                    onChangeText={text => handleInputChange('itemType', text)}
                    placeholder="e.g., Graphic T-Shirt"
                />
            </View>
            
            {renderPicker("Category*", formData.category, (value) => handleInputChange('category', value), CLOTHES_CATEGORIES)}
            {renderPicker("Color*", formData.color, (value) => handleInputChange('color', value), CLOTHES_COLORS)}


            <View style={styles.inputContainer}>
                <Text style={styles.label}>Note</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.note}
                    onChangeText={text => handleInputChange('note', text)}
                    placeholder="e.g., From summer collection 2023"
                    multiline
                />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{submitText}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#374151',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#8B5CF6',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    imagePicker: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        width: 150,
        borderRadius: 15,
        backgroundColor: '#F3F4F6',
        alignSelf: 'center',
        marginBottom: 20,
        overflow: 'hidden',
    },
    imagePreview: {
        height: '100%',
        width: '100%',
    },
    imagePlaceholder: {
        alignItems: 'center',
    },
    imagePlaceholderText: {
        marginTop: 5,
        color: '#6B7280',
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
        marginRight: 10,
    },
    chipSelected: {
        backgroundColor: '#8B5CF6',
    },
    chipText: {
        color: '#374151',
        fontWeight: '600',
    },
    chipTextSelected: {
        color: 'white',
    }
});

export default ClothesFormModal; 