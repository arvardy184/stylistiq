import { BASE_URL } from "@/config";
import {
  CollectionItem,
  CollectionsResponse,
  CreateCollectionResponse,
  ImagePickerAsset,
} from "@/screens/collections/types";
import axios from "axios";

export const getCollections = async (
  token: string
): Promise<CollectionItem[]> => {
  try {
    console.log("🚀 getCollections API called");
    console.log("📡 BASE_URL:", BASE_URL);

    const response = await axios.get<CollectionsResponse>(
      `${BASE_URL}/collection`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ getCollections successful");
    console.log("📊 Response:", JSON.stringify(response.data, null, 2));

    return response.data.data;
  } catch (error) {
    console.error("❌ getCollections error:", error);
    console.error("🔍 Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getCollectionDetail = async (
  token: string,
  collectionId: string
): Promise<CollectionItem> => {
  try {
    console.log("🚀 getCollectionDetail API called");
    console.log("📡 BASE_URL:", BASE_URL);
    console.log("🆔 Collection ID:", collectionId);

    const response = await axios.get<{
      statusCode: number;
      message: string;
      data: CollectionItem;
    }>(`${BASE_URL}/collection/${collectionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ getCollectionDetail successful");
    console.log("📊 Response:", JSON.stringify(response.data, null, 2));

    return response.data.data;
  } catch (error) {
    console.error("❌ getCollectionDetail error:", error);
    console.error("🔍 Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const createCollection = async (
  token: string,
  name: string,
  image?: ImagePickerAsset,
  clothesIds?: string[]
): Promise<CollectionItem> => {
  try {
    // 1. Buat instance FormData
    const formData = new FormData();

    // 2. Tambahkan data teks (nama, dll)
    formData.append("name", name);

    // 3. Tambahkan file gambar jika ada
    if (image) {
      console.log("🔍 Memeriksa objek gambar sebelum dikirim:", image);
      formData.append("image", {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      } as any);
    }

    // (Opsional) Tambahkan clothesIds jika ada
    if (clothesIds && clothesIds.length > 0) {
      clothesIds.forEach((id) => {
        formData.append("clothesIds[]", id);
      });
    }

    console.log("🚀 Calling createCollection with FormData...");

    const response = await axios.post<CreateCollectionResponse>(
      `${BASE_URL}/collection`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // ❗️ JANGAN set 'Content-Type'. Axios akan otomatis mengaturnya
          // ke 'multipart/form-data' dengan boundary yang benar.

          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ createCollection with image upload successful!");
    return response.data.data;
  } catch (error) {
    console.error("❌ createCollection error:", error);
    if (axios.isAxiosError(error)) {
      console.error("🔍 Axios error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
};

// 🔧 FIXED: Update collection now uses FormData for image uploads
export const updateCollection = async (
  token: string,
  collectionId: string,
  name: string,
  image?: ImagePickerAsset | string // Accept both new image (ImagePickerAsset) or existing URL (string)
): Promise<CollectionItem> => {
  try {
    console.log("🚀 updateCollection API called");
    console.log("📡 BASE_URL:", BASE_URL);
    console.log("🆔 Collection ID:", collectionId);
    console.log("📝 Update data:", { name, image });

    // Check if we need to upload a new image or just update text
    const hasNewImage = image && typeof image === "object" && "uri" in image;

    if (hasNewImage) {
      // Use FormData for new image upload
      const formData = new FormData();
      formData.append("name", name);

      formData.append("image", {
        uri: (image as ImagePickerAsset).uri,
        type: (image as ImagePickerAsset).type,
        name: (image as ImagePickerAsset).fileName,
      } as any);

      console.log("🔍 Updating with new image using FormData");

      const response = await axios.put<CreateCollectionResponse>(
        `${BASE_URL}/collection/${collectionId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type, let axios handle it for FormData
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data;
    } else {
      // Use JSON for text-only updates or when keeping existing image
      console.log("🔍 Updating text only with JSON");

      const response = await axios.put<CreateCollectionResponse>(
        `${BASE_URL}/collection/${collectionId}`,
        {
          name,
          ...(typeof image === "string" && { image }), // Only include image if it's a string URL
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data;
    }
  } catch (error) {
    console.error("❌ updateCollection error:", error);
    console.error("🔍 Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const addClothesToCollection = async (
  token: string,
  collectionId: string,
  clothesIds: string[]
): Promise<CollectionItem> => {
  try {
    console.log("🚀 addClothesToCollection API called");
    console.log("📡 BASE_URL:", BASE_URL);
    console.log("🆔 Collection ID:", collectionId);
    console.log("👔 Clothes IDs to add:", clothesIds);

    const response = await axios.post<CollectionsResponse>(
      `${BASE_URL}/collection/${collectionId}/add`,
      {
        clothesIds,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ addClothesToCollection successful");
    console.log("📊 Response:", JSON.stringify(response.data, null, 2));

    return response.data.data[0];
  } catch (error) {
    console.error("❌ addClothesToCollection error:", error);
    console.error("🔍 Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const removeClothesFromCollection = async (
  token: string,
  collectionId: string,
  clothesIds: string[]
): Promise<CollectionItem> => {
  try {
    console.log("🚀 removeClothesFromCollection API called");
    console.log("📡 BASE_URL:", BASE_URL);
    console.log("🆔 Collection ID:", collectionId);
    console.log("📝 Clothes IDs to remove:", clothesIds);

    const response = await axios.put<CollectionsResponse>(
      `${BASE_URL}/collection/${collectionId}`,
      {
        clothesIds,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ removeClothesFromCollection successful");
    console.log("📊 Response:", JSON.stringify(response.data, null, 2));

    return response.data.data[0];
  } catch (error) {
    console.error("❌ removeClothesFromCollection error:", error);
    console.error("🔍 Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const deleteCollections = async (
  token: string,
  collectionIds: string[]
): Promise<void> => {
  try {
    const response = await axios.delete(`${BASE_URL}/collection`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { collectionIds },
    });
    return response.data;
  } catch (error) {
    console.error("❌ deleteCollections error:", error);
    console.error("🔍 Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const deleteCollection = async (
  token: string,
  collectionId: string
): Promise<void> => {
  return deleteCollections(token, [collectionId]);
};

export const GetAllCollectionByToken = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/collection`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
