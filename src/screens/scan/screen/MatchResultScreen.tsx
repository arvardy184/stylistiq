import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { matchClothes } from '@/services/api/clothes';
import { createCollection, addClothesToCollection } from '@/services/api/collections';
import { useAuthStore } from '@/store/auth/authStore';
import { Clothes } from '@/screens/collections/types';
import { useNotification } from '@/hooks/useNotification';
import { RootStackParamList } from '@/types';

const MatchResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'MatchResult'>>();
  const { analyzedItem } = route.params;
  const { token } = useAuthStore();
  const { showError, showSuccess } = useNotification();

  const [matchedClothes, setMatchedClothes] = useState<Clothes[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [creatingCollection, setCreatingCollection] = useState(false);

  useEffect(() => {
    fetchMatchedClothes();
  }, []);

  const fetchMatchedClothes = async () => {
    if (!token) return;

    try {
      setLoading(true);
      console.log('🔍 [MATCH] Fetching matched clothes for:', analyzedItem?.itemType);
      console.log('🔍 [MATCH] analyzedItem:', JSON.stringify(analyzedItem, null, 2));
      
      // Check if analyzedItem has valid id
      if (!analyzedItem?.id) {
        console.log('⚠️ [MATCH] Warning: analyzedItem has no ID, using empty clothesIds');
        const response = await matchClothes(token, []);
        setMatchedClothes(response.data || []);
        console.log('✅ [MATCH] Found', response.data?.length || 0, 'matching items without specific item ID');
        return;
      }
      
      // Pass the analyzed item's ID to match against
      const clothesIds = [analyzedItem.id];
      console.log('🔍 [MATCH] Using clothesIds for matching:', clothesIds);
      
      const response = await matchClothes(token, clothesIds);
      const matchedData = response.data || [];
      setMatchedClothes(matchedData);
      
      console.log('✅ [MATCH] Found', matchedData.length, 'matching items');
      console.log('🔍 [MATCH] Matched clothes IDs:', matchedData.map(c => ({ id: c.id, itemType: c.itemType })));
    } catch (error) {
      console.error('❌ [MATCH] Failed to fetch matched clothes:', error);
      showError("Match Failed", "Unable to find matching clothes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (itemId: string) => {
    console.log('🔍 [SELECTION] Toggling selection for ID:', itemId);
    console.log('🔍 [SELECTION] Current selected items:', selectedItems);
    
    setSelectedItems(prev => {
      const isCurrentlySelected = prev.includes(itemId);
      const newSelection = isCurrentlySelected 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      console.log('🔍 [SELECTION] Is currently selected:', isCurrentlySelected);
      console.log('🔍 [SELECTION] New selection:', newSelection);
      
      return newSelection;
    });
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedItems([]);
  };

  const handleCreateCollection = async () => {
    console.log('🔄 [COLLECTION] Starting collection creation process...');
    console.log('🔍 [DEBUG] Collection name:', collectionName);
    console.log('🔍 [DEBUG] Selected items count:', selectedItems.length);
    console.log('🔍 [DEBUG] Selected items:', selectedItems);
    console.log('🔍 [DEBUG] Matched clothes count:', matchedClothes.length);
    
    if (!token || !collectionName.trim()) {
      showError("Invalid Input", "Please enter a collection name.");
      return;
    }

    try {
      setCreatingCollection(true);
      console.log('🔄 [COLLECTION] Creating collection with name and clothes:', collectionName.trim());
      console.log('🔄 [COLLECTION] Clothes IDs to include:', selectedItems);
      
      // Validate selectedItems are valid IDs from matched clothes
      const validClothesIds = selectedItems.filter(id => {
        const isValid = matchedClothes.some(clothes => clothes.id === id);
        console.log(`🔍 [DEBUG] Checking ID ${id}: ${isValid ? 'VALID' : 'INVALID'}`);
        return isValid;
      });

      // Add analyzed item ID if it exists
      if (analyzedItem?.id) {
        validClothesIds.push(analyzedItem.id);
      }
      
      console.log('🔍 [DEBUG] Valid clothes IDs:', validClothesIds);
      console.log('🔍 [DEBUG] Valid clothes count:', validClothesIds.length);
      
      // Create the collection with clothes if any, otherwise just create empty collection
      const newCollection = await createCollection(
        token, 
        collectionName.trim(), 
        undefined, 
        validClothesIds.length > 0 ? validClothesIds : undefined
      );
      console.log('✅ [COLLECTION] Collection created:', newCollection);
      
      const itemCount = validClothesIds.length;
      const message = itemCount > 0 
        ? `"${collectionName}" has been created with ${itemCount} items!`
        : `"${collectionName}" has been created!`;
        
      showSuccess("Collection Created", message);
      setShowCreateModal(false);
      setCollectionName('');
      setSelectedItems([]);
      setSelectionMode(false);
      
      // Navigate to Collections tab in MainTabNavigator
      navigation.navigate('Main', { screen: 'Collections' } as never);
    } catch (error) {
      console.error('❌ [COLLECTION] Failed to create:', error);
      console.error('❌ [COLLECTION] Error details:', JSON.stringify(error, null, 2));
      showError("Creation Failed", "Unable to create collection. Please try again.");
    } finally {
      setCreatingCollection(false);
    }
  };

  const renderMatchedItem = ({ item }: { item: Clothes }) => {
    const isSelected = selectedItems.includes(item.id);
    
    return (
      <TouchableOpacity 
        onPress={() => selectionMode ? toggleSelection(item.id) : null}
        className={`bg-white rounded-xl shadow-md shadow-black/5 m-2 p-3 ${
          isSelected ? 'border-2 border-purple-500' : ''
        }`} 
        style={{ width: '45%' }}
      >
        <View className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
          {item.image ? (
            <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Ionicons name="shirt-outline" size={32} color="#9CA3AF" />
            </View>
          )}
          
          {selectionMode && (
            <View className="absolute top-2 right-2">
              <View className={`w-6 h-6 rounded-full border-2 ${
                isSelected 
                  ? 'bg-purple-500 border-purple-500' 
                  : 'bg-white border-gray-300'
              } items-center justify-center`}>
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
            </View>
          )}
        </View>
        
        <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
          {item.itemType}
        </Text>
        <Text className="text-xs text-gray-500 capitalize mt-1">
          {item.category} • {item.color}
        </Text>
        {item.note && (
          <Text className="text-xs text-gray-400 mt-1" numberOfLines={2}>
            {item.note}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderAnalyzedItem = () => (
    <View className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 mx-4 mb-6">
      <Text className="text-white font-semibold mb-2">Analyzed Item</Text>
      <View className="flex-row items-center">
        <View className="w-16 h-16 bg-white/20 rounded-lg justify-center items-center mr-4">
          <Ionicons name="scan" size={24} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-white font-bold text-lg">{analyzedItem.itemType}</Text>
          <Text className="text-white/80 capitalize">{analyzedItem.category} • {analyzedItem.color}</Text>
        </View>
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View className="px-6 mb-4">
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={toggleSelectionMode}
          className={`flex-1 py-3 rounded-lg mr-2 ${
            selectionMode ? 'bg-gray-500' : 'bg-purple-500'
          } items-center`}
        >
          <Text className="text-white font-semibold">
            {selectionMode ? 'Cancel Selection' : 'Select Items'}
          </Text>
        </TouchableOpacity>
        
        {selectionMode && (
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="flex-1 py-3 bg-pink-500 rounded-lg ml-2 items-center"
          >
            <Text className="text-white font-semibold">
              Create Collection {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCreateCollectionModal = () => (
    <Modal
      visible={showCreateModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-xl p-6 mx-6 w-80">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900">New Collection</Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-gray-600 mb-4">
            Create a new collection{selectedItems.length > 0 ? ` with ${selectedItems.length} selected items` : ''}
          </Text>
          
          <TextInput
            value={collectionName}
            onChangeText={setCollectionName}
            placeholder="Collection name..."
            className="border border-gray-300 rounded-lg p-3 mb-4"
            autoFocus
          />
          
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setShowCreateModal(false)}
              className="flex-1 py-3 bg-gray-200 rounded-lg mr-2 items-center"
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleCreateCollection}
              disabled={!collectionName.trim() || creatingCollection}
              className={`flex-1 py-3 rounded-lg ml-2 items-center ${
                !collectionName.trim() || creatingCollection
                  ? 'bg-gray-300'
                  : 'bg-purple-500'
              }`}
            >
              {creatingCollection ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-semibold">Create</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderHeader = () => (
    <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
      >
        <Ionicons name="arrow-back" size={20} color="#374151" />
      </TouchableOpacity>
      
      <Text className="text-xl font-bold text-gray-900 flex-1 text-center">
        Style Matches
      </Text>
      
      <View className="w-10" /> {/* Spacer for centering */}
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className="bg-gray-100 rounded-full p-6 mb-4">
        <Ionicons name="search-outline" size={48} color="#9CA3AF" />
      </View>
      <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">
        No Matches Found
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        We couldn't find any clothes that match with your analyzed item. Try adding more items to your wardrobe!
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Main', { screen: 'Wardrobe' } as never)}
        className="bg-purple-500 px-6 py-3 rounded-full"
      >
        <Text className="text-white font-semibold">Go to Wardrobe</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
      {renderHeader()}
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text className="text-gray-500 mt-4">Finding perfect matches...</Text>
        </View>
      ) : (
        <FlatList
          data={matchedClothes}
          renderItem={renderMatchedItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          ListHeaderComponent={
            <View>
              {renderAnalyzedItem()}
              {matchedClothes.length > 0 && renderActionButtons()}
              <Text className="text-lg font-semibold text-gray-800 px-6 mb-4">
                Matching Items ({matchedClothes.length})
              </Text>
            </View>
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {renderCreateCollectionModal()}
    </SafeAreaView>
  );
};

export default MatchResultScreen; 