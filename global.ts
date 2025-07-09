import { Text, TextInput } from "react-native";

(Text as any).defaultProps = {
  ...((Text as any).defaultProps || {}),
  style: [{ fontFamily: "Figtree" }, (Text as any).defaultProps?.style],
};

(TextInput as any).defaultProps = {
  ...((TextInput as any).defaultProps || {}),
  style: [{ fontFamily: "Figtree" }, (TextInput as any).defaultProps?.style],
};
