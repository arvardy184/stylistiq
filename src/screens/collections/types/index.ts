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
  season?: string;
  note?: string; 
  createdAt: string;
  updatedAt: string;
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

export interface CreateCollectionData {
  name: string;
  image?: string;
}

export interface UpdateCollectionData {
  name: string;
  image?: string;
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