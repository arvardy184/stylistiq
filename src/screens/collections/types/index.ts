import { ClothesStatus } from '@/common/enums/clothes';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string | null;
  age: number | null;
  birthday: string | null;
  gender: string | null;
  profilePhoto: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Clothes {
  id: string;
  name?: string;
  itemType: string;
  image: string;
  category: string;
  color: string;
  note?: string; 
  status?: string;
  createdAt: string;
  updatedAt: string;
}

// Image picker asset interface for new uploads
export interface ImagePickerAsset {
  uri: string;
  type: string;
  fileName: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  clothes: Clothes[];
}

export interface CollectionScreenProps {
  navigation: any;
}

export interface CollectionDetailScreenProps {
  navigation: any;
  route: {
    params: {
      collectionId: string;
      collectionName: string;
    };
  };
}

export interface CollectionsResponse {
  statusCode: number;
  message: string;
  data: CollectionItem[]; 
}

export interface CreateCollectionResponse {
  statusCode: number;
  message: string;
  data: CollectionItem; 
}

export interface CreateCollectionData {
  name: string;
  image?: ImagePickerAsset; // For new image uploads
}

// 🔧 FIXED: UpdateCollectionData can handle both new images and existing URLs
export interface UpdateCollectionData {
  name: string;
  image?: ImagePickerAsset | string; // ImagePickerAsset for new uploads, string for existing URLs
}

export interface DeleteCollectionsData {
  collectionIds: string[];
}

export interface CollectionFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCollectionData | UpdateCollectionData) => void;
  initialData?: UpdateCollectionData;
  title: string;
  submitText: string;
}