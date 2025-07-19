import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

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

/**
 * Compresses an image to reduce its file size.
 *
 * @param uri The local URI of the image to compress.
 * @returns The URI of the compressed image.
 */
export const compressImage = async (uri: string): Promise<string> => {
  try {
    console.log(`Original image URI: ${uri}`);

    // 1. Get original image info
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error("File does not exist at the provided URI.");
    }
    const originalSizeMB = (fileInfo.size || 0) / 1024 / 1024;
    console.log(`Original image size: ${originalSizeMB.toFixed(2)} MB`);

    // 2. Define compression parameters
    let compressQuality = 0.8; // Start with good quality
    let maxWidth = 1080; // Standard HD width

    // Aggressively compress if the image is very large
    if (originalSizeMB > 5) {
      compressQuality = 0.7;
      maxWidth = 1080;
    } else if (originalSizeMB > 2) {
      compressQuality = 0.8;
    }

    // 3. Perform manipulation
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth } }], // Resize to a max width, maintaining aspect ratio
      {
        compress: compressQuality,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    // 4. Get new image info
    const newFileInfo = await FileSystem.getInfoAsync(manipResult.uri);
    const newSizeMB = newFileInfo.exists ? (newFileInfo as any).size / 1024 / 1024 : 0;
    console.log(`Compressed image URI: ${manipResult.uri}`);
    console.log(`Compressed image size: ${newSizeMB.toFixed(2)} MB`);

    return manipResult.uri;
  } catch (error) {
    console.error("Error compressing image:", error);
    return uri; // Return original URI if compression fails
  }
}; 