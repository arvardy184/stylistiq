import { BASE_URL } from "@/config";
import axios from "axios";

export const getAllClothes = async (token: string) => {
  console.log("🔵 [API] Getting all clothes...");
  
  try {
    const response = await axios.get(`${BASE_URL}/clothes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("✅ [API] Get all clothes success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [API] Get all clothes error:", error);
    throw error;
  }
};

export const getClothesById = async (token: string, clothesId: string) => {
  console.log("🔵 [API] Getting clothes by ID:", clothesId);
  
  try {
    const response = await axios.get(`${BASE_URL}/clothes/${clothesId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("✅ [API] Get clothes by ID success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [API] Get clothes by ID error:", error);
    throw error;
  }
};

export const createClothes = async (token: string, data: FormData) => {
  console.log("🔵 [API] Creating new clothes...");
  
  try {
    const response = await axios.post(`${BASE_URL}/clothes`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log("✅ [API] Create clothes success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [API] Create clothes error:", error);
    throw error;
  }
};

export const updateClothes = async (token: string, clothesId: string, data: FormData) => {
  console.log("🔵 [API] Updating clothes:", clothesId);
  
  try {
    const response = await axios.put(`${BASE_URL}/clothes/${clothesId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log("✅ [API] Update clothes success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [API] Update clothes error:", error);
    throw error;
  }
};

export const deleteClothes = async (token: string, clothesId: string) => {
  console.log("🔵 [API] Deleting clothes:", clothesId);
  
  try {
    const response = await axios.delete(`${BASE_URL}/clothes/${clothesId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("✅ [API] Delete clothes success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [API] Delete clothes error:", error);
    throw error;
  }
};

export const analyzeClothes = async (token: string, images: string[]) => {
  console.log(`🔵 [API] Analyzing ${images.length} clothes images...`);

  try {
    const formData = new FormData();
    images.forEach((uri, index) => {
      formData.append("images", {
        uri,
        name: `image_${index}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    const response = await axios.post(`${BASE_URL}/clothes/analyze`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      // Optional: Add a timeout for long-running analysis
      // timeout: 60000, 
    });

    console.log("✅ [API] Analyze clothes success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [API] Analyze clothes error:", error);
    throw error;
  }
}; 