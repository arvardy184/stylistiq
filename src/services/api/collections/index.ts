import { BASE_URL } from "@/config";
import { CollectionItem, CollectionsResponse } from "@/screens/collections/types";
import axios from "axios";

// --- GET ALL COLLECTIONS ---
export const getCollections = async (token: string): Promise<CollectionItem[]> => {
  const endpoint = `${BASE_URL}/collection`;
  console.log(`🚀 [API][GET] Kicking off: ${endpoint}`);

  try {
    const response = await axios.get<CollectionsResponse>(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ [API][GET] Success: ${endpoint}`, { status: response.status, data: response.data });
    return response.data.data;
  } catch (error) {
    console.error(`❌ [API][GET] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- GET COLLECTION BY ID ---
export const getCollectionDetail = async (token: string, collectionId: string): Promise<CollectionItem> => {
  const endpoint = `${BASE_URL}/collection/${collectionId}`;
  console.log(`🚀 [API][GET] Kicking off: ${endpoint}`);

  try {
    const response = await axios.get<{ statusCode: number; message: string; data: CollectionItem }>(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ [API][GET] Success: ${endpoint}`, { status: response.status, data: response.data });
    return response.data.data;
  } catch (error) {
    console.error(`❌ [API][GET] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- CREATE COLLECTION ---
export const createCollection = async (token: string, name: string, image?: string): Promise<CollectionItem> => {
  const endpoint = `${BASE_URL}/collection`;
  const payload = { name, image };
  console.log(`🚀 [API][POST] Kicking off: ${endpoint}`, { payload });

  try {
    const response = await axios.post<CollectionsResponse>(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`✅ [API][POST] Success: ${endpoint}`, { status: response.status, data: response.data });
    return response.data.data[0];
  } catch (error) {
    console.error(`❌ [API][POST] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- UPDATE COLLECTION ---
export const updateCollection = async (token: string, collectionId: string, name: string, image?: string): Promise<CollectionItem> => {
  const endpoint = `${BASE_URL}/collection/${collectionId}`;
  const payload = { name};
  console.log(`🚀 [API][PUT] Kicking off: ${endpoint}`, { payload });

  try {
    const response = await axios.put<{ statusCode: number; message: string; data: CollectionItem }>(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`✅ [API][PUT] Success: ${endpoint}`, { status: response.status, data: response.data });
    return response.data.data;
  } catch (error) {
    console.error(`❌ [API][PUT] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- REMOVE CLOTHES FROM COLLECTION ---
export const removeClothesFromCollection = async (token: string, collectionId: string, clothesIds: string[]): Promise<CollectionItem> => {
  const endpoint = `${BASE_URL}/collection/${collectionId}`;
  const payload = { clothesIds };
  console.log(`🚀 [API][PUT] Kicking off: ${endpoint}`, { payload });
  
  try {
    const response = await axios.put<{ statusCode: number; message: string; data: CollectionItem }>(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`✅ [API][PUT] Success: ${endpoint}`, { status: response.status, data: response.data });
    return response.data.data;
  } catch (error) {
    console.error(`❌ [API][PUT] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- DELETE COLLECTIONS (BULK) ---
export const deleteCollections = async (token: string, collectionIds: string[]): Promise<void> => {
  const endpoint = `${BASE_URL}/collection`;
  const payload = { collectionIds };
  console.log(`🚀 [API][DELETE] Kicking off: ${endpoint}`, { payload });

  try {
    const response = await axios.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: payload,
    });
    console.log(`✅ [API][DELETE] Success: ${endpoint}`, { status: response.status, data: response.data });
  } catch (error) {
    console.error(`❌ [API][DELETE] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- DELETE SINGLE COLLECTION (WRAPPER) ---
export const deleteCollection = async (token: string, collectionId: string): Promise<void> => {
  console.log(`래퍼 [API][DELETE] Kicking off for single ID: ${collectionId}`);
  return deleteCollections(token, [collectionId]);
}; 