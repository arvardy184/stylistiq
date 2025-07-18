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
import { LoginFieldsProps } from "./type";

export const LoginFields: React.FC<LoginFieldsProps> = ({
  control,
  errors,
  showPassword,
  setShowPassword,
}) => {
  return (
    <>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email Address</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="you@example.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={[styles.input, errors.email && styles.inputError]}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message as string}</Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password</Text>
        <View>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={[styles.input, errors.password && styles.inputError]}
                secureTextEntry={!showPassword}
                placeholderTextColor="#9CA3AF"
              />
            )}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.icon}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="#B2236F"
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>
            {errors.password.message as string}
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
