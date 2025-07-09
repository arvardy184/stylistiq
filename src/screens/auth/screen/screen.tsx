import React from "react";
import { View, KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import AuthHeader from "./header";
import AuthBody from "./body";
import AuthFooter from "./footer";

const AuthScreen = () => {
  const route = useRoute();
  const isLogin = route.name === "Login";

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1">
            {/* Header dengan latar belakang utama */}
            <AuthHeader isLogin={isLogin} />

            {/* Kontainer untuk Body dan Footer */}
            <View className="flex-1 bg-gray-50 -mt-10 rounded-t-[40px] pt-4">
              <View className="flex-1 justify-center px-5 pb-5">
                <AuthBody isLogin={isLogin} />
                {isLogin && <AuthFooter />}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;
