import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useNotification } from "@/hooks/useNotification";
import { AnalysisResultCardProps } from "../types";
import { formatCategoryDisplay } from "@/utils/formatCategoryDisplay";

const PRIMARY_COLOR = "#B2236F";

const InfoRow = ({ icon, value }) => (
  <View className="flex-row items-center mt-2">
    <Ionicons name={icon} size={16} color="#64748B" />
    <Text className="text-sm text-slate-600 ml-2 capitalize" numberOfLines={1}>
      {value || "N/A"}
    </Text>
  </View>
);

const ActionButton = ({ icon, text, onPress, style = "primary" }) => {
  const isPrimary = style === "primary";
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center p-2.5 rounded-lg ${
        isPrimary ? "" : "bg-slate-200"
      }`}
      style={isPrimary ? { backgroundColor: PRIMARY_COLOR } : {}}
      activeOpacity={0.7}
    >
      <Ionicons name={icon} size={18} color={isPrimary ? "white" : "#475569"} />
      <Text
        className={`font-semibold ml-2 text-sm ${
          isPrimary ? "text-white" : "text-slate-700"
        }`}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({
  result,
  onSave,
}) => {
  const { success, message, originalImageUri, detectedItem } = result;
  const navigation = useNavigation();
  const { showError } = useNotification();
  const [isSaving, setIsSaving] = useState(false);

  const isSaved =
    detectedItem?.status !== "Belum Dimiliki" &&
    !detectedItem?.id?.startsWith("temp-");

  const handleSave = async () => {
    if (detectedItem && !isSaving) {
      setIsSaving(true);
      try {
        await onSave(detectedItem);
      } catch (error) {
        showError("Gagal Menyimpan", "Terjadi kesalahan saat menyimpan item.");
        setIsSaving(false);
      }
    }
  };

  const handleNavigate = (screen, params) => {
    if (!isSaved) {
      showError(
        "Item Belum Disimpan",
        "Anda harus menyimpan item ini ke lemari terlebih dahulu."
      );
      return;
    }
    navigation.navigate(screen, params);
  };

  return (
    <View className="bg-white rounded-2xl shadow-lg shadow-black/5 mb-4 overflow-hidden border border-slate-100">
      <View className="flex-row">
        <Image
          source={{ uri: originalImageUri }}
          className="w-1/2 aspect-square"
          resizeMode="cover"
        />
        <View className="flex-1 p-4">
          <Text className="text-lg font-bold text-slate-800" numberOfLines={1}>
            {success && detectedItem
              ? formatCategoryDisplay(detectedItem.itemType)
              : "Analisis Gagal"}
          </Text>

          {success && detectedItem ? (
            <>
              <View
                className={`py-1 px-2.5 rounded-full self-start mt-2 ${
                  isSaved ? "bg-green-100" : "bg-amber-100"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isSaved ? "text-green-800" : "text-amber-800"
                  }`}
                >
                  {isSaved ? "Tersimpan" : "Belum Disimpan"}
                </Text>
              </View>
              <View className="mt-2">
                <InfoRow
                  icon="shirt-outline"
                  value={formatCategoryDisplay(detectedItem.category)}
                />
                <InfoRow
                  icon="color-palette-outline"
                  value={detectedItem.color}
                />
              </View>
            </>
          ) : (
            <Text className="text-sm text-slate-500 mt-1" numberOfLines={3}>
              {message ||
                "Kami tidak dapat mengidentifikasi item pada gambar ini."}
            </Text>
          )}
        </View>
      </View>

      {success && detectedItem && (
        <View className="border-t border-slate-100 p-3 bg-slate-50/50">
          {isSaved ? (
            <View className="flex-row gap-2">
              <ActionButton
                icon="search"
                text="Find Match"
                onPress={() =>
                  handleNavigate("MatchResult", { analyzedItem: detectedItem })
                }
                style="primary"
              />
              <ActionButton
                icon="pencil"
                text="Edit"
                onPress={() =>
                  handleNavigate("EditClothes", { analyzedItem: detectedItem })
                }
                style="secondary"
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              className="flex-row items-center justify-center rounded-lg py-3 px-4 shadow-sm"
              style={{ backgroundColor: isSaving ? "#CCCCCC" : PRIMARY_COLOR }}
              activeOpacity={0.7}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="add-circle-outline" size={20} color="white" />
              )}
              <Text className="text-white font-bold text-sm ml-2">
                {isSaving ? "Menyimpan..." : "Simpan ke Lemari"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {!success && (
        <View className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color={PRIMARY_COLOR}
          />
          <Text
            className="text-lg font-bold text-center mt-2"
            style={{ color: PRIMARY_COLOR }}
          >
            Gagal Diidentifikasi
          </Text>
        </View>
      )}
    </View>
  );
};

export default AnalysisResultCard;
