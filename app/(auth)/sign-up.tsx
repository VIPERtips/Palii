import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReactNativeModal from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useSignUp } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();


  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    role: "PATIENT",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
        firstName: form.firstname,
        lastName: form.lastname,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({ ...verification, state: "pending" });
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage || err?.message || "Sign up failed";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (attempt.status === "complete") {
      
      const res =  await fetchAPI(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              firstName: form.firstname,
              lastName: form.lastname,
              phoneNumber: form.phonenumber,
              location: form.location,
              email: form.email,
              role: form.role,
              clerkUserId: attempt.createdUserId,
            }),
          }
        );

        await AsyncStorage.setItem("userRole", res.data.role);
        await setActive({ session: attempt.createdSessionId });

        setVerification({ ...verification, state: "success" });

        setTimeout(() => {
          setVerification({ ...verification, state: "default" });
          router.push("/(root)/(tabs)/home");
        }, 1500);
      } else {
        setVerification({
          ...verification,
          state: "failed",
          error: "Verification failed, try again.",
        });
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage || err?.message || "Something went wrong";
      Alert.alert("Verification Error", message);
      setVerification({ ...verification, state: "failed", error: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="relative w-full h-[300px]">
        <Image
          source={images.bgImage}
          className="w-full h-full rounded-2xl"
          resizeMode="cover"
        />
        <Text className="absolute bottom-5 left-5 text-3xl text-black font-JakartaBold">
          Create Your Account
        </Text>
      </View>

      <View className="p-5 space-y-4">
        <InputField
          label="Firstname"
          placeholder="Enter your firstname"
          icon={icons.person}
          value={form.firstname}
          onChangeText={(val) => setForm({ ...form, firstname: val })}
          variant="filled"
          iconStyle="me-2"
        />
        <InputField
          label="Lastname"
          placeholder="Enter your lastname"
          icon={icons.person}
          value={form.lastname}
          onChangeText={(val) => setForm({ ...form, lastname: val })}
          variant="filled"
          iconStyle="me-2"
        />
        <InputField
          label="Phone Number"
          placeholder="Enter your phone number"
          icon={icons.phone}
          value={form.phonenumber}
          onChangeText={(val) => setForm({ ...form, phonenumber: val })}
          keyboardType="phone-pad"
          variant="filled"
          iconStyle="me-2"
        />
        <InputField
          label="Location"
          placeholder="Enter your location"
          icon={icons.location}
          value={form.location}
          onChangeText={(val) => setForm({ ...form, location: val })}
          variant="filled"
          iconStyle="me-2"
        />

        {/* Role selection */}
        <View className="flex-row items-center justify-between bg-pali-card border border-pali-border rounded-2xl px-4 py-3">
          <View>
            <Text className="text-pali-foreground text-[15px] font-JakartaSemiBold">
              Account Type
            </Text>
            <Text className="text-pali-muted-foreground text-[13px]">
              {form.role}
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#D1D5DB", true: "#22C55E" }}
            thumbColor="#fff"
            onValueChange={(val) =>
              setForm({ ...form, role: val ? "PATIENT" : "DOCTOR" })
            }
            value={form.role === "PATIENT"}
          />
        </View>

        <InputField
          label="Email Address"
          placeholder="Enter your email"
          icon={icons.email}
          value={form.email}
          onChangeText={(val) => setForm({ ...form, email: val })}
          variant="filled"
          iconStyle="me-2"
          keyboardType="email-address"
        />
        <View className="relative">
          <InputField
            label="Password"
            placeholder="Enter your password"
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

        <CustomButton
          title={loading ? "Processing..." : "Sign Up"}
          onPress={onSignUpPress}
          bgVariant="pali-primary"
          textVariant="pali-primary-foreground"
          disabled={loading}
        />

        <OAuth />
      </View>

      {/* Verification modals */}
      <ReactNativeModal
        isVisible={verification.state === "pending"}
        backdropOpacity={0.5}
        animationIn="fadeIn"
        animationOut="fadeOut"
      >
        <View className="bg-white rounded-2xl px-6 py-8 items-center shadow-lg min-h-[220px]">
          <Ionicons
            name="hand-left-outline"
            size={60}
            color="#FACC15"
            style={{ marginBottom: 20 }}
          />
          <Text className="text-black text-2xl font-JakartaExtraBold mb-2 text-center">
            Verification Pending
          </Text>
          <Text className="text-gray-500 text-center px-4 mb-5">
            We sent a verification code to {form.email || "your email"}. Enter
            it below.
          </Text>
          <InputField
            label="Code"
            icon={icons.lock}
            placeholder="12345"
            value={verification.code}
            onChangeText={(code) => setVerification({ ...verification, code })}
            keyboardType="numeric"
          />
          {verification.error && (
            <Text className="text-red-500 text-sm mt-1">
              {verification.error}
            </Text>
          )}
          <CustomButton
            title={loading ? "Verifying..." : "Verify Email"}
            onPress={onVerifyPress}
            className="mt-5"
            tone="success"
            disabled={loading}
          />
          {loading && (
            <ActivityIndicator size="large" color="#00AA13" className="mt-4" />
          )}
        </View>
      </ReactNativeModal>

      <ReactNativeModal
        isVisible={verification.state === "success"}
        backdropOpacity={0.5}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="bg-white rounded-2xl px-6 py-8 items-center shadow-lg min-h-[300px]">
          <Image
            source={images.check}
            className="w-[120px] h-[120px] mb-6"
            resizeMode="contain"
          />
          <Text className="text-black text-3xl font-JakartaBold mb-4 text-center">
            Verification Successful!
          </Text>
          <Text className="text-gray-500 text-center mb-6 px-4">
            Your account has been verified. Tap continue to start exploring the
            app.
          </Text>
          <CustomButton
            title="Browse Home"
            onPress={() => {
              setVerification({ ...verification, state: "default" });
              router.push("/(root)/(tabs)/home");
            }}
            bgVariant="pali-primary"
            textVariant="pali-primary-foreground"
            className="w-full mt-5"
          />
        </View>
      </ReactNativeModal>

      <View className="flex-row justify-center mt-5 mb-10">
        <Text className="text-gray-500 text-[14px]">
          Already have an account?{" "}
        </Text>
        <Link
          href="/(auth)/sign-in"
          className="text-primary-500 font-JakartaSemiBold text-[14px]"
        >
          Log In
        </Link>
      </View>
    </ScrollView>
  );
}
