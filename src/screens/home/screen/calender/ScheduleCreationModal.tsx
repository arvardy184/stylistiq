import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, SectionList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Clothes, CollectionItem } from '@/screens/collections/types';
import { getAllClothes } from '@/services/api/clothes';
import { getCollections, getCollectionDetail } from '@/services/api/collections';
import { useAuthStore } from '@/store/auth/authStore';
import { useNotification } from '@/hooks/useNotification';

type SelectionType = 'Clothes' | 'Collection' | null;

interface ScheduleCreationModalProps {
  visible: boolean;
  onClose: () => void;
  onSchedule: (clothesIds: string[]) => void;
  isLoading: boolean;
}

const ScheduleCreationModal: React.FC<ScheduleCreationModalProps> = ({ visible, onClose, onSchedule, isLoading }) => {
  const { token } = useAuthStore();
  const { showError } = useNotification();
  
  const [selectionType, setSelectionType] = useState<SelectionType>(null);
  const [step, setStep] = useState(1); // 1: Choose type, 2: Choose item
  
  const [clothes, setClothes] = useState<Clothes[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedClothesIds, setSelectedClothesIds] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null);

  useEffect(() => {
    if (!visible) {
      // Reset state on close
      setTimeout(() => {
        setStep(1);
        setSelectionType(null);
        setSelectedClothesIds([]);
        setSelectedCollection(null);
        setSearchQuery('');
      }, 500); // Delay to allow slide-out animation
    }
  }, [visible]);

  useEffect(() => {
    if (step === 2 && token) {
      const fetchData = async () => {
        setLoadingItems(true);
        try {
          if (selectionType === 'Clothes') {
            const clothesRes = await getAllClothes(token);
            setClothes(clothesRes.data || []);
          } else if (selectionType === 'Collection') {
            const collectionsRes = await getCollections(token);
            setCollections(collectionsRes || []);
          }
        } catch (error) {
          showError("Failed to load items", "Please try again.");
        } finally {
          setLoadingItems(false);
        }
      };
      fetchData();
    }
  }, [step, selectionType, token]);
  
  const handleTypeSelect = (type: SelectionType) => {
    setSelectionType(type);
    setStep(2);
  };
  
  const handleGoBack = () => {
    setStep(1);
    setSearchQuery('');
    setSelectedClothesIds([]);
    setSelectedCollection(null);
  };
  
  const handleSchedulePress = async () => {
    if (isLoading) return;

    if (selectionType === 'Clothes') {
      if (selectedClothesIds.length > 0) {
        onSchedule(selectedClothesIds);
      }
    } else if (selectionType === 'Collection' && selectedCollection) {
      try {
        // Fetch collection details to get clothesIds
        const collectionDetail = await getCollectionDetail(token!, selectedCollection.id);
        const clothesIds = collectionDetail.clothes.map(c => c.id);
        if (clothesIds.length > 0) {
          onSchedule(clothesIds);
        } else {
          showError("Empty Collection", "This collection has no clothes to schedule.");
        }
      } catch (error) {
        showError("Failed to get collection details.");
      }
    }
  };

  const toggleClothesSelection = (id: string) => {
    setSelectedClothesIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // --- RENDER FUNCTIONS ---

  const renderInitialStep = () => (
    <View style={styles.stepContainer}>
      <TouchableOpacity style={styles.optionButton} onPress={() => handleTypeSelect('Clothes')}>
        <Ionicons name="shirt-outline" size={32} color="#8B5CF6" />
        <Text style={styles.optionText}>From My Wardrobe</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => handleTypeSelect('Collection')}>
        <Ionicons name="albums-outline" size={32} color="#EC4899" />
        <Text style={styles.optionText}>From My Collections</Text>
      </TouchableOpacity>
    </View>
  );
  
  const filteredClothes = useMemo(() => 
    clothes.filter(c => c.itemType?.toLowerCase().includes(searchQuery.toLowerCase())), 
    [clothes, searchQuery]
  );
  
  const filteredCollections = useMemo(() => 
    collections.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [collections, searchQuery]
  );

  const renderItemSelectionStep = () => (
    <View style={{flex: 1}}>
        <TextInput
            style={styles.searchInput}
            placeholder={`Search ${selectionType}...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
        />
        {loadingItems ? (
            <ActivityIndicator size="large" color="#8B5CF6" />
        ) : selectionType === 'Clothes' ? (
            <FlatList
                data={filteredClothes}
                keyExtractor={item => item.id}
                numColumns={3}
                contentContainerStyle={{ alignItems: 'center' }}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => toggleClothesSelection(item.id)} style={[styles.itemCard, selectedClothesIds.includes(item.id) && styles.itemCardSelected]}>
                         <Image source={{uri: item.image}} style={styles.itemImage} />
                        <Text style={styles.itemText} numberOfLines={1}>{item.itemType}</Text>
                    </TouchableOpacity>
                )}
            />
        ) : (
            <FlatList
                data={filteredCollections}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setSelectedCollection(item)} style={[styles.collectionCard, selectedCollection?.id === item.id && styles.itemCardSelected]}>
                        <Text style={styles.collectionText}>{item.name}</Text>
                        <Text style={styles.collectionSubtext}>{item.clothes.length} items</Text>
                    </TouchableOpacity>
                )}
            />
        )}
    </View>
  );

  const isScheduleButtonDisabled = isLoading || 
    (selectionType === 'Clothes' && selectedClothesIds.length === 0) ||
    (selectionType === 'Collection' && !selectedCollection);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackdrop} onTouchEnd={onClose} />
      <View style={styles.modalContainer}>
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <View style={styles.header}>
            {step === 2 && (
              <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#374151" />
              </TouchableOpacity>
            )}
            <Text style={styles.title}>{step === 1 ? 'Add to Schedule' : `Select ${selectionType}`}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            {step === 1 ? renderInitialStep() : renderItemSelectionStep()}
          </View>

          {step === 2 && (
            <View style={styles.footer}>
              <TouchableOpacity style={[styles.scheduleButton, isScheduleButtonDisabled && styles.disabledButton]} onPress={handleSchedulePress} disabled={isScheduleButtonDisabled}>
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.scheduleButtonText}>Add to Schedule</Text>}
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};


// --- STYLES --- (Extensive styling for a good UX)
const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { height: '85%', backgroundColor: '#F9FAFB', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  backButton: { position: 'absolute', left: 20, zIndex: 1 },
  content: { flex: 1, padding: 20 },
  stepContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  optionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 15, width: '90%', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  optionText: { fontSize: 18, fontWeight: '600', marginLeft: 15 },
  searchInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 15 },
  itemCard: { width: 100, height: 120, margin: 5, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  itemCardSelected: { borderColor: '#8B5CF6' },
  itemImage: { width: '100%', height: 90 },
  itemText: { padding: 5, textAlign: 'center', fontWeight: '500' },
  collectionCard: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 2, borderColor: 'transparent' },
  collectionText: { fontSize: 16, fontWeight: 'bold' },
  collectionSubtext: { fontSize: 14, color: 'gray', marginTop: 4 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  scheduleButton: { backgroundColor: '#8B5CF6', padding: 15, borderRadius: 10, alignItems: 'center' },
  scheduleButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#C4B5FD' },
});

export default ScheduleCreationModal; 