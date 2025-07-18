import { View, Text, TextInput, KeyboardTypeOptions } from "react-native";
import { Control, Controller } from "react-hook-form";

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
}

const ControlledTextInput = ({
  control,
  name,
  label,
  placeholder,
  keyboardType,
}: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-1">{label}</Text>
          <TextInput
            className={`border p-3 rounded-lg ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType={keyboardType}
          />
          {error && (
            <Text className="text-red-500 text-xs mt-1">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
};
export default ControlledTextInput;
