import { BASE_URL } from "@/config";
import axios from "axios";

// --- GET ALL CLOTHES ---
export const getAllClothes = async (token: string) => {
  const endpoint = `${BASE_URL}/clothes`;
  console.log(`🚀 [API][GET] Kicking off: ${endpoint}`);
  
  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ [API][GET] Success: ${endpoint}`, { status: response.status, data: JSON.stringify(response.data, null, 2) });
    return response.data;
  } catch (error) {
    console.error(`❌ [API][GET] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- GET CLOTHES BY ID ---
export const getClothesById = async (token: string, clothesId: string) => {
  const endpoint = `${BASE_URL}/clothes/${clothesId}`;
  console.log(`🚀 [API][GET] Kicking off: ${endpoint}`);

  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ [API][GET] Success: ${endpoint}`, { status: response.status, data: JSON.stringify(response.data, null, 2) });
    return response.data;
  } catch (error) {
    console.error(`❌ [API][GET] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- CREATE CLOTHES ---
export const createClothes = async (token: string, data: FormData) => {
  const endpoint = `${BASE_URL}/clothes`;
  console.log(`🚀 [API][POST] Kicking off: ${endpoint}`, { data });

  try {
    const response = await axios.post(endpoint, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(`✅ [API][POST] Success: ${endpoint}`, { status: response.status, data: JSON.stringify(response.data, null, 2) });
    return response.data;
  } catch (error) {
    console.error(`❌ [API][POST] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- UPDATE CLOTHES ---
export const updateClothes = async (token: string, clothesId: string, data: FormData) => {
  const endpoint = `${BASE_URL}/clothes/${clothesId}`;
  console.log(`🚀 [API][PUT] Kicking off: ${endpoint}`, { data });

  try {
    const response = await axios.put(endpoint, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(`✅ [API][PUT] Success: ${endpoint}`, { status: response.status, data: JSON.stringify(response.data, null, 2) });
    return response.data;
  } catch (error) {
    console.error(`❌ [API][PUT] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- DELETE CLOTHES ---
export const deleteClothes = async (token: string, clothesIds: string[]) => {
  const endpoint = `${BASE_URL}/clothes`;
  console.log(`🚀 [API][DELETE] Kicking off: ${endpoint}`, { body: { clothesIds } });
  
  try {
    const response = await axios.delete(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      data: { clothesIds },
    });
    console.log(`✅ [API][DELETE] Success: ${endpoint}`, { status: response.status, data: JSON.stringify(response.data, null, 2) });
    return response.data;
  } catch (error) {
    console.error(`❌ [API][DELETE] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- ANALYZE CLOTHES ---
export const analyzeClothes = async (token: string, images: string[]) => {
  const endpoint = `${BASE_URL}/clothes/analyze`;
  console.log(`🚀 [API][POST] Kicking off: ${endpoint}`, { imageCount: images.length });

  try {
    const formData = new FormData();
    images.forEach((uri, index) => {
      formData.append("images", {
        uri,
        name: `image_${index}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    const response = await axios.post(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(`✅ [API][POST] Success: ${endpoint}`, { status: response.status, data: JSON.stringify(response.data, null, 2) });
    return response.data;
  } catch (error) {
    console.error(`❌ [API][POST] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- UPDATE CLOTHES NAME ---
export const updateClothesName = async (token: string, clothesId: string, newName: string) => {
  const endpoint = `${BASE_URL}/clothes/${clothesId}/name`;
  console.log(`🚀 [API][PATCH] Kicking off: ${endpoint}`, { newName });

  try {
    const response = await axios.patch(endpoint, { name: newName }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ [API][PATCH] Success: ${endpoint}`, { status: response.status, data: JSON.stringify(response.data, null, 2) });
    return response.data;
  } catch (error) {
    console.error(`❌ [API][PATCH] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
};

// --- MATCH CLOTHES ---
export const matchClothes = async (token: string, clothesIds: string[]) => {
  const endpoint = `${BASE_URL}/clothes/match`;
  console.log(`🚀 [API][POST] Kicking off: ${endpoint}`, { clothesIds });

  try {
    const response = await axios.post(endpoint, { clothesIds }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`✅ [API][POST] Success: ${endpoint}`, { status: response.status, data: response.data });
    return response.data;
  } catch (error) {
    console.error(`❌ [API][POST] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
}; 

//SEARCH CLOTHES
  export const searchClothes = async (token: string, q: string) => {
  const endpoint = `${BASE_URL}/clothes/search/all?q=${encodeURIComponent(q)}`;
  console.log(`🚀 [API][GET] Kicking off: ${endpoint}`);

  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ [API][GET] Search Clothes:", JSON.stringify(response.data, null, 2));
    return response.data; 
  }
  catch (error) {
    console.error(`❌ [API][GET] Error: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
}