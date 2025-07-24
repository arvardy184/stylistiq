import { Text, TextInput } from "react-native";

(Text as any).defaultProps = {
  ...((Text as any).defaultProps || {}),
  style: [{ fontFamily: "Poppins" }, (Text as any).defaultProps?.style],
};

(TextInput as any).defaultProps = {
  ...((TextInput as any).defaultProps || {}),
  style: [{ fontFamily: "Poppins" }, (TextInput as any).defaultProps?.style],
};
