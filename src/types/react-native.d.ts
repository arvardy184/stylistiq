import "react-native";

declare module "react-native" {
  interface Text {
    defaultProps?: Partial<TextProps>;
  }

  interface TextInput {
    defaultProps?: Partial<TextInputProps>;
  }
}
