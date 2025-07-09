import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import { LoginFields } from "../login";
import { RegisterFieldsProps } from "./type";

export const RegisterFields: React.FC<RegisterFieldsProps> = ({
  control,
  errors,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}) => {
  return (
    <>
      <LoginFields
        control={control}
        errors={errors}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        isLogin={false}
      />

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <View>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Confirm your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={[
                  styles.input,
                  errors.confirmPassword && styles.inputError,
                ]}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#9CA3AF"
              />
            )}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.icon}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="#B2236F"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text style={styles.errorText}>
            {errors.confirmPassword.message as string}
          </Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  icon: {
    position: "absolute",
    right: 12,
    top: 13,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
