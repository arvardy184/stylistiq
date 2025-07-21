import { BASE_URL } from "@/config";
import { CollectionItem, CollectionsResponse } from "@/screens/collections/types";
import axios from "axios";

export const getCollections = async (token: string): Promise<CollectionItem[]> => {
  try {
    console.log('🚀 getCollections API called');
    console.log('📡 BASE_URL:', BASE_URL);
    
    const response = await axios.get<CollectionsResponse>(`${BASE_URL}/collection`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('✅ getCollections successful');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    
    return response.data.data;
  } catch (error) {
    console.error('❌ getCollections error:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const getCollectionDetail = async (token: string, collectionId: string): Promise<CollectionItem> => {
  try {
    console.log('🚀 getCollectionDetail API called');
    console.log('📡 BASE_URL:', BASE_URL);
    console.log('🆔 Collection ID:', collectionId);
    
    const response = await axios.get<CollectionsResponse>(`${BASE_URL}/collection/${collectionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('✅ getCollectionDetail successful');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    
    return response.data.data[0]; // Assuming it returns array with single item
  } catch (error) {
    console.error('❌ getCollectionDetail error:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const createCollection = async (token: string, name: string, image?: string): Promise<CollectionItem> => {
  try {
    console.log('🚀 createCollection API called');
    console.log('📡 BASE_URL:', BASE_URL);
    console.log('📝 Collection data:', { name, image });
    
    const response = await axios.post<CollectionsResponse>(`${BASE_URL}/collection`, {
      name,
      image,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ createCollection successful');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    
    return response.data.data[0];
  } catch (error) {
    console.error('❌ createCollection error:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const updateCollection = async (token: string, collectionId: string, name: string, image?: string): Promise<CollectionItem> => {
  try {
    console.log('🚀 updateCollection API called');
    console.log('📡 BASE_URL:', BASE_URL);
    console.log('🆔 Collection ID:', collectionId);
    console.log('📝 Update data:', { name, image });
    
    const response = await axios.put<CollectionsResponse>(`${BASE_URL}/collection/${collectionId}`, {
      name,
      image,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ updateCollection successful');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    
    return response.data.data[0];
  } catch (error) {
    console.error('❌ updateCollection error:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const deleteCollections = async (token: string, collectionIds: string[]): Promise<void> => {
  try {
    console.log('🚀 deleteCollections API called');
    console.log('📡 BASE_URL:', BASE_URL);
    console.log('🆔 Collection IDs:', collectionIds);
    
    const response = await axios.delete(`${BASE_URL}/collection`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        collectionIds,
      },
    });
    
    console.log('✅ deleteCollections successful');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ deleteCollections error:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

// Keep this for backward compatibility - single collection delete
export const deleteCollection = async (token: string, collectionId: string): Promise<void> => {
  return deleteCollections(token, [collectionId]);
}; 