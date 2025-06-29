export interface PhotoPickerProps {
  onImageSelected: (uri: string) => void;
  onError: (error: string) => void;
}
