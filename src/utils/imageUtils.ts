import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export interface ImagePickerResult {
  uri: string;
  base64?: string | null;
}

// Request permissions for camera and photo library
export const requestPermissions = async (): Promise<boolean> => {
  try {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return cameraPermission.status === 'granted' && libraryPermission.status === 'granted';
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};

// Pick image from library
export const pickImageFromLibrary = async (): Promise<ImagePickerResult | null> => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      throw new Error('Permission denied');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      return {
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    throw error;
  }
};

// Take photo with camera
export const takePhoto = async (): Promise<ImagePickerResult | null> => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      throw new Error('Permission denied');
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      return {
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error taking photo:', error);
    throw error;
  }
};

// Convert image to base64 - simplified version since we get base64 from picker
export const convertToBase64 = async (uri: string): Promise<string> => {
  try {
    // For development, return a mock base64 string
    // In production, you'd implement actual conversion here
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/';
  } catch (error) {
    console.error('Error converting to base64:', error);
    throw error;
  }
}; 