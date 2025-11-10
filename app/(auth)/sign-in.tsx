/* eslint-disable react/no-unescaped-entities */
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useUserContext } from "@/context/userContext";
import { fetchAPI } from "@/lib/fetch";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { getToken } = useAuth();
  const { signOut } = useAuth();
  const { setUser } = useUserContext();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });

        const token = await getToken();
        console.log("Clerk JWT:", token);
        await AsyncStorage.setItem("token", String(token));

      

        const res = await fetchAPI(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        
        if (!res?.data?.role) {
          Alert.alert(
            "Login Error",
            res.message || "Incomplete user data. Signing out..."
          );
          await signOut();
          return;
        }

        setUser(res.data);
        await AsyncStorage.setItem("userRole", res.data.role);
        router.push("/(root)/(tabs)/home");
      } else {
        Alert.alert("Error", "Sign in incomplete");
      }
    } catch (err: any) {
      Alert.alert("Sign In Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative mt-1">
          <Image
            source={images.bgImage}
            className="z-0 w-full h-[300px] rounded-2xl"
            resizeMode="cover"
          />
          <View className="absolute bottom-5 left-5 flex-col">
            <Text className="text-3xl text-black font-JakartaBold">
              Hey, you made it!
            </Text>
            <Text className="text-base text-gray-700 mt-1">
              Let’s get you rolling with Syna 👀
            </Text>
          </View>
        </View>

        <View className="p-5">
          <InputField
            label="Email Address"
            placeholder="info@blexta.co.zw"
            icon={icons.email}
            value={form.email}
            onChangeText={(val) => setForm({ ...form, email: val })}
            variant="filled"
            iconStyle="me-2"
          />

          <View className="relative">
            <InputField
              label="Password"
              placeholder="*******"
              icon={icons.lock}
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(val) => setForm({ ...form, password: val })}
              variant="filled"
              iconStyle="me-2"
            />
            <TouchableOpacity
              className="absolute right-4 top-[40px]"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <CustomButton
              title={loading ? "Signing In..." : "Sign In"}
              onPress={onSignInPress}
              bgVariant="pali-primary"
              textVariant="pali-primary-foreground"
              disabled={loading}
            />
            {loading && (
              <ActivityIndicator
                size="large"
                color="#0286ff"
                className="mt-4"
              />
            )}
          </View>

          <OAuth />
        </View>
      </View>

      <View className="flex-row justify-center mt-5">
        <Text className="text-gray-500 text-[14px]">
          Don't have an account?{" "}
        </Text>
        <Link
          href="/(auth)/sign-up"
          className="text-primary-500 font-JakartaSemiBold text-[14px]"
        >
          Sign Up
        </Link>
      </View>
    </ScrollView>
  );
}
