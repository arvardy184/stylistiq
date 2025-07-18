import React, { useState } from "react";
import { View, KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import AuthHeader from "./header";
import AuthBody from "./body";
import AuthFooter from "./footer";
import ForgotPasswordModal from "../forgotPassword";

const AuthScreen = () => {
  const route = useRoute();
  const isLogin = route.name === "Login";
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <>
      <SafeAreaView className="flex-1 bg-primary">
        <KeyboardAvoidingView className="flex-1">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1">
              <AuthHeader isLogin={isLogin} />
              <View className="flex-1 bg-gray-50 -mt-10 rounded-t-[40px] pt-4">
                <View className="flex-1 justify-center px-5 pb-5">
                  <AuthBody
                    isLogin={isLogin}
                    onForgotPasswordPress={() => setModalVisible(true)}
                  />
                  {isLogin && <AuthFooter />}
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <ForgotPasswordModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

export default AuthScreen;
