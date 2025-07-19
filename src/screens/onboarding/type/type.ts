import { Animated, ViewToken } from "react-native";

export interface Slide {
  id: string;
  image: string;
  title: string;
  description: string;
}

export interface SlideItemProps {
  item: Slide;
}

export interface PaginatorProps {
  data: Slide[];
  scrollX: Animated.Value;
}

export interface NextButtonProps {
  scrollTo: () => void;
  percentage: number;
}

export interface ViewableItemsChangedInfo {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}
