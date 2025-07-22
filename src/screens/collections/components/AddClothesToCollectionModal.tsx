import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Clothes } from '@/screens/collections/types';
import { getAllClothes } from '@/services/api/clothes';
import { useAuthStore } from '@/store/auth/authStore';
import ClothesCard from '@/screens/collections/components/ClothesCard'; 

interface AddClothesToCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (selectedIds: string[]) => void;
  existingClothesIds: string[];
  isLoading: boolean;
}

const AddClothesToCollectionModal: React.FC<AddClothesToCollectionModalProps> = ({ visible, onClose, onAdd, existingClothesIds, isLoading: isAdding }) => {
  const { token } = useAuthStore();
  const [allClothes, setAllClothes] = useState<Clothes[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (visible && token) {
      const fetchClothes = async () => {
        setLoading(true);
        try {
          const response = await getAllClothes(token);
          setAllClothes(response.data || []);
        } catch (error) {
          console.error("Failed to fetch clothes for modal", error);
        } finally {
          setLoading(false);
        }
      };
      fetchClothes();
    }
  }, [visible, token]);
  
  const availableClothes = useMemo(() => {
    return allClothes
      .filter(item => !existingClothesIds.includes(item.id))
      .filter(item => item.itemType?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allClothes, existingClothesIds, searchQuery]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  
  const handleAddPress = () => {
    if (selectedIds.length > 0) {
      onAdd(selectedIds);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Add Clothes to Collection</Text>
      <TouchableOpacity onPress={onClose} disabled={isAdding}>
        <Ionicons name="close-circle" size={28} color="#D1D5DB" />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search clothes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {renderHeader()}
        {renderSearchBar()}
        
        {loading ? (
          <ActivityIndicator size="large" color="#8B5CF6" style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={availableClothes}
            keyExtractor={item => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <ClothesCard
                item={item}
                onPress={() => {}} // Not used here
                onSelect={() => toggleSelection(item.id)}
                isSelected={selectedIds.includes(item.id)}
                selectionMode={true}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No other clothes available.</Text>
              </View>
            }
          />
        )}

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.addButton, (selectedIds.length === 0 || isAdding) && styles.addButtonDisabled]} 
            onPress={handleAddPress}
            disabled={selectedIds.length === 0 || isAdding}
          >
            {isAdding ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.addButtonText}>Add {selectedIds.length > 0 ? `(${selectedIds.length})` : ''} Items</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addButton: { backgroundColor: '#8B5CF6', padding: 15, borderRadius: 10, alignItems: 'center' },
  addButtonDisabled: { backgroundColor: '#C4B5FD' },
  addButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#6B7280' },
  searchContainer: {
    margin: 20,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingLeft: 40,
    paddingRight: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  }
});

export default AddClothesToCollectionModal; 