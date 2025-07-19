export interface ScheduleUser {
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

export interface ScheduleClothes {
  id: string;
  category: string;
  itemType: string;
  color: string;
  image: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  date: string; // YYYY-MM-DD format
  note?: string;
  reminder?: string; // YYYY-MM-DDTHH:MM:SS.000Z format
  createdAt: string;
  updatedAt: string;
  user: ScheduleUser;
  clothes: ScheduleClothes[];
}

export interface ScheduleFormData {
  date: string;
  note?: string;
  reminder?: string;
  clothesIds: string[];
}

export interface UpdateScheduleData {
  date?: string;
  note?: string;
  reminder?: string;
  clothesIds?: string[];
}

export interface DeleteScheduleData {
  scheduleIds: string[];
}

export interface SchedulesResponse {
  statusCode: number;
  message: string;
  data: Schedule[];
}

export interface ScheduleResponse {
  statusCode: number;
  message: string;
  data: Schedule;
}

// Props for components
export interface ScheduleScreenProps {
  navigation: any;
  route?: {
    params?: {
      selectedDate?: string;
    };
  };
}

export interface ScheduleCardProps {
  schedule: Schedule;
  onPress: (schedule: Schedule) => void;
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
}

export interface ScheduleFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => void;
  initialData?: Schedule | null;
  title: string;
  submitText: string;
  availableClothes: ScheduleClothes[];
} 