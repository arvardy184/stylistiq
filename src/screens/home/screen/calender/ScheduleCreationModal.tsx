import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, SectionList, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Clothes, CollectionItem } from '@/screens/collections/types';
import { getAllClothes } from '@/services/api/clothes';
import { getCollections, getCollectionDetail } from '@/services/api/collections';
import { useAuthStore } from '@/store/auth/authStore';
import { useNotification } from '@/hooks/useNotification';
import dayjs from 'dayjs';

type SelectionType = 'Clothes' | 'Collection' | null;

interface ScheduleCreationModalProps {
  visible: boolean;
  onClose: () => void;
  onSchedule: (clothesIds: string[], reminderTime?: string, note?: string) => void;
  isLoading: boolean;
  selectedDate: dayjs.Dayjs;
}

const ScheduleCreationModal: React.FC<ScheduleCreationModalProps> = ({ visible, onClose, onSchedule, isLoading, selectedDate }) => {
  const { token } = useAuthStore();
  const { showError } = useNotification();
  
  const [selectionType, setSelectionType] = useState<SelectionType>(null);
  const [step, setStep] = useState(1); // 1: Choose type, 2: Choose item, 3: Set reminder
  
  const [clothes, setClothes] = useState<Clothes[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedClothesIds, setSelectedClothesIds] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null);
  
  // Reminder states
  const [enableReminder, setEnableReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!visible) {
      // Reset state on close
      setTimeout(() => {
        setStep(1);
        setSelectionType(null);
        setSelectedClothesIds([]);
        setSelectedCollection(null);
        setSearchQuery('');
        setEnableReminder(false);
        setReminderTime(new Date());
        setNote('');
        setShowTimePicker(false);
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
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
      setSearchQuery('');
      setSelectedClothesIds([]);
      setSelectedCollection(null);
    }
  };

  const handleContinueToReminder = () => {
    setStep(3);
  };
  
  const handleSchedulePress = async () => {
    if (isLoading) return;

    let clothesIds: string[] = [];

    if (selectionType === 'Clothes') {
      clothesIds = selectedClothesIds;
    } else if (selectionType === 'Collection' && selectedCollection) {
      try {
        // Fetch collection details to get clothesIds
        const collectionDetail = await getCollectionDetail(token!, selectedCollection.id);
        clothesIds = collectionDetail.clothes.map(c => c.id);
        if (clothesIds.length === 0) {
          showError("Empty Collection", "This collection has no clothes to schedule.");
          return;
        }
      } catch (error) {
        showError("Failed to get collection details.");
        return;
      }
    }

    // Prepare reminder time
    let reminderTimeISO: string | undefined;
    if (enableReminder) {
      // Combine selected date with reminder time
      const scheduleDate = selectedDate.format('YYYY-MM-DD');
      const reminderDateTime = dayjs(`${scheduleDate} ${dayjs(reminderTime).format('HH:mm')}`);
      reminderTimeISO = reminderDateTime.toISOString();
    }

    onSchedule(clothesIds, reminderTimeISO, note.trim() || undefined);
  };

  const toggleClothesSelection = (id: string) => {
    setSelectedClothesIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // --- RENDER FUNCTIONS ---

  const renderReminderStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Set Reminder (Optional)</Text>
      
      <View style={styles.reminderCard}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Enable Reminder</Text>
          <Switch
            value={enableReminder}
            onValueChange={setEnableReminder}
            trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
            thumbColor={enableReminder ? '#FFFFFF' : '#9CA3AF'}
          />
        </View>
        
        {enableReminder && (
          <>
            <TouchableOpacity 
              style={styles.timeButton} 
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#8B5CF6" />
              <Text style={styles.timeButtonText}>
                {dayjs(reminderTime).format('HH:mm')}
              </Text>
            </TouchableOpacity>
            
            {showTimePicker && (
              <DateTimePicker
                value={reminderTime}
                mode="time"
                is24Hour={true}
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    setReminderTime(selectedTime);
                  }
                }}
              />
            )}
          </>
        )}
      </View>
      
      <View style={styles.noteCard}>
        <Text style={styles.noteLabel}>Note (Optional)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Add a note for this outfit..."
          value={note}
          onChangeText={setNote}
          multiline
          maxLength={100}
        />
      </View>
    </View>
  );

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
            {step === 1 ? renderInitialStep() : step === 2 ? renderItemSelectionStep() : renderReminderStep()}
          </View>

          {step === 2 && (
            <View style={styles.footer}>
              <TouchableOpacity 
                style={[styles.scheduleButton, isScheduleButtonDisabled && styles.disabledButton]} 
                onPress={handleContinueToReminder} 
                disabled={isScheduleButtonDisabled}
              >
                <Text style={styles.scheduleButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View style={styles.footer}>
              <TouchableOpacity 
                style={[styles.scheduleButton]} 
                onPress={handleSchedulePress} 
                disabled={isLoading}
              >
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
  stepTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#374151' },
  reminderCard: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  switchLabel: { fontSize: 16, fontWeight: '600', color: '#374151' },
  timeButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 12, borderRadius: 10, justifyContent: 'center', marginTop: 10 },
  timeButtonText: { fontSize: 16, fontWeight: '600', color: '#8B5CF6', marginLeft: 8 },
  noteCard: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  noteLabel: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 10 },
  noteInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, fontSize: 16, minHeight: 80, textAlignVertical: 'top' },
});

export default ScheduleCreationModal; 