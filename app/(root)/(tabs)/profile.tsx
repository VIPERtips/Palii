/* eslint-disable react/no-unescaped-entities */
import Map from "@/components/Map";
import { getAuthHeaders } from "@/lib";
import { fetchAPI } from "@/lib/fetch";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [userType, setUserType] = useState("patient");
  const [fetchedUser, setFetchedUser] = useState<any>("");
  const [Loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    specialty: "",
    bio: "",
    education: "",
    address: "",
    latitude: "",
    longitude: "",
    rating: 0,
    imageUrl: "",
  });
  const [isPendingModalVisible, setPendingModalVisible] = useState(false);
  const [accountStatus, setAccountStatus] = useState<
    "APPROVED" | "PENDING" | "REJECTED" | null
  >(null);

  const openPendingModal = () => setPendingModalVisible(true);
  const closePendingModal = () => setPendingModalVisible(false);
  

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const headers = await getAuthHeaders();

        const userResponse = await fetchAPI(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/current?clerkUserId=${user.id}`,
          { headers }
        );
        const userData = await userResponse.json();
        const currentUser = userData?.data;

        const doctorData = await fetchAPI(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/api/doctors/current`,
          { headers }
        );

        const mergedUser = {
          ...currentUser,
          doctorInfo: doctorData?.data || null,
        };

        setFetchedUser(mergedUser);
      

        if (doctorData?.data) {
          setUserType("doctor");
          setAccountStatus(doctorData.data.accountStatus);
        } else {
          setUserType("patient");
          setAccountStatus(null);
        }

        if (doctorData?.data?.accountStatus === "PENDING") {
          setPendingModalVisible(true);
        }
      } catch (err) {
        console.log("Error fetching user info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [user]);

  const fullName = user?.firstName + " " + user?.lastName;

  const toggleModal = () => setModalVisible(!isModalVisible);

  const submitDoctorRequest = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const formData = new FormData();

      const dto = JSON.stringify({
        fullName: form.fullName,
        specialty: form.specialty,
        bio: form.bio,
        education: form.education,
        address: form.address,
        latitude: form.latitude,
        longitude: form.longitude,
      });
      formData.append("dto", dto);

      if (form.imageUrl) {
        const filename = form.imageUrl.split("/").pop()!;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("image", {
          uri: form.imageUrl,
          name: filename,
          type,
        } as any);
      }

      const response = await fetchAPI(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/doctors?clerkUserId=${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Doctor request submitted:", data);

      if (data?.accountStatus === "PENDING") {
        openPendingModal();
      }
      setModalVisible(false);
      setForm({
        fullName: "",
        specialty: "",
        bio: "",
        education: "",
        address: "",
        latitude: "",
        longitude: "",
        rating: 0,
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error submitting doctor request:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPatientProfile = () => (
    <>
      <LinearGradient
        colors={["#14b8a6", "#0f766e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",
          borderRadius: 24,
          padding: 32,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <View className="flex-row items-center">
          <Image
            source={{ uri: user?.imageUrl }}
            style={{ width: 56, height: 56, borderRadius: 28, marginEnd: 5 }}
          />
          <View className="ml-5 flex-1">
            <Text className="text-white text-2xl font-bold">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-teal-100 text-sm mt-1">Patient Account</Text>
          </View>
        </View>
      </LinearGradient>
      <View className="bg-white w-full rounded-3xl p-6 mb-4 shadow-lg">
        <Text className="text-gray-900 text-lg font-bold mb-4">
          Your Health Journey
        </Text>
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-3xl font-bold text-teal-600">12</Text>
            <Text className="text-gray-600 text-xs mt-1">Appointments</Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View className="items-center flex-1">
            <Text className="text-3xl font-bold text-teal-600">5</Text>
            <Text className="text-gray-600 text-xs mt-1">Doctors</Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View className="items-center flex-1">
            <Text className="text-3xl font-bold text-teal-600">34</Text>
            <Text className="text-gray-600 text-xs mt-1">Reviews</Text>
          </View>
        </View>
      </View>
      {/* Personal Information */}
      <View className="bg-white w-full rounded-3xl p-6 mb-4 shadow-lg">
        <Text className="text-gray-900 text-lg font-bold mb-4">
          Personal Information
        </Text>

        <View className="mb-4">
          <Text className="text-gray-500 text-xs mb-1">Email Address</Text>
          <Text className="text-gray-900 text-base">
            {user?.emailAddresses[0].emailAddress}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 text-xs mb-1">Phone Number</Text>
          <Text className="text-gray-900 text-base">
            {fetchedUser?.phoneNumber}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 text-xs mb-1">Location</Text>
          <Text className="text-gray-900 text-base">
            {fetchedUser?.location}
          </Text>
        </View>
      </View>
      {/* Medical History */}
      <View className="bg-white w-full rounded-3xl p-6 mb-4 shadow-lg">
        <Text className="text-gray-900 text-lg font-bold mb-4">
          Medical History
        </Text>

        <View className="bg-gray-50 rounded-2xl p-4 mb-3">
          <Text className="text-gray-900 font-semibold mb-1">Allergies</Text>
          <Text className="text-gray-600 text-sm">Penicillin, Pollen</Text>
        </View>

        <View className="bg-gray-50 rounded-2xl p-4 mb-3">
          <Text className="text-gray-900 font-semibold mb-1">
            Current Medications
          </Text>
          <Text className="text-gray-600 text-sm">Lisinopril 10mg (Daily)</Text>
        </View>

        <View className="bg-gray-50 rounded-2xl p-4">
          <Text className="text-gray-900 font-semibold mb-1">
            Chronic Conditions
          </Text>
          <Text className="text-gray-600 text-sm">Hypertension</Text>
        </View>
      </View>
      {/* Recent Appointments */}
      <View className="bg-white w-full rounded-3xl p-6 mb-4 shadow-lg">
        <Text className="text-gray-900 text-lg font-bold mb-4">
          Recent Appointments
        </Text>

        <View className="border-l-4 border-teal-500 pl-4 mb-4">
          <Text className="text-gray-900 font-semibold">Dr. Sarah Johnson</Text>
          <Text className="text-gray-600 text-sm">General Checkup</Text>
          <Text className="text-gray-500 text-xs mt-1">
            Oct 28, 2025 • 10:00 AM
          </Text>
        </View>

        <View className="border-l-4 border-gray-300 pl-4 mb-4">
          <Text className="text-gray-900 font-semibold">Dr. Michael Chen</Text>
          <Text className="text-gray-600 text-sm">
            Blood Pressure Monitoring
          </Text>
          <Text className="text-gray-500 text-xs mt-1">
            Oct 15, 2025 • 2:30 PM
          </Text>
        </View>

        <TouchableOpacity className="mt-2">
          <Text className="text-teal-600 font-semibold text-center">
            View All Appointments →
          </Text>
        </TouchableOpacity>
      </View>
      <LinearGradient
        colors={["#14B8A6", "#0F766E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 24,
        }}
        className="w-full rounded-3xl mb-4 shadow-lg"
      >
        <TouchableOpacity
          onPress={toggleModal}
          activeOpacity={0.9}
          className="p-6"
        >
          <Text className="text-white text-lg font-bold">
            Are you a Doctor?
          </Text>
          <Text className="text-teal-100 text-sm mt-1">
            Request a doctor account to start accepting patients
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <View className="bg-white w-full rounded-3xl p-6 mb-6 shadow-lg">
        <TouchableOpacity onPress={handleSignOut} className="py-4">
          <Text className="text-red-600 font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderDoctorProfile = () => (
    <>
      <LinearGradient
        colors={["#14b8a6", "#0f766e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",
          borderRadius: 24,
          padding: 32,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <View className="flex-row items-center">
          <Image
            source={{ uri: fetchedUser?.doctorInfo.imageUrl || user?.imageUrl }}
            className="w-24 h-24 rounded-full border-4 border-white"
          />
          <View className="ml-5 flex-1">
            <Text className="text-white text-2xl font-bold">
              Dr. {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-blue-100 text-sm mt-1">
              {fetchedUser?.doctorInfo.specialty || "N/A"}
            </Text>
            <View className="flex-row items-center mt-2">
              <View className="bg-white/20 px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-medium">
                  ⭐ {fetchedUser?.doctorInfo.avgRating || "0.0"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View className="bg-white w-full rounded-3xl p-6 mb-4 shadow-lg">
        <Text className="text-gray-900 text-lg font-bold mb-4">
          Practice Overview
        </Text>
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-3xl font-bold text-green-600">247</Text>
            <Text className="text-gray-600 text-xs mt-1">Patients</Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View className="items-center flex-1">
            <Text className="text-3xl font-bold text-green-600">89</Text>
            <Text className="text-gray-600 text-xs mt-1">This Month</Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View className="items-center flex-1">
            <Text className="text-3xl font-bold text-green-600">156</Text>
            <Text className="text-gray-600 text-xs mt-1">Reviews</Text>
          </View>
        </View>
      </View>

      <View className="bg-white w-full rounded-3xl p-6 mb-4 shadow-lg">
        <Text className="text-gray-900 text-lg font-bold mb-4">
          Professional Information
        </Text>

        <View className="mb-4">
          <Text className="text-gray-500 text-xs mb-1">Specialty</Text>
          <Text className="text-gray-900 text-base">
            {fetchedUser?.doctorInfo.specialty || "hey"}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 text-xs mb-1">Primary Clinic</Text>
          <Text className="text-gray-900 text-base">{fetchedUser?.doctorInfo.address}</Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 text-xs mb-1">
            EDUCATION
          </Text>
          <Text className="text-gray-900 text-base">
            {fetchedUser?.doctorInfo.education}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 text-xs mb-1">Phone</Text>
          <Text className="text-gray-900 text-base">
            {fetchedUser?.phoneNumber}
          </Text>
        </View>

        <View>
          <Text className="text-gray-500 text-xs mb-1">Email</Text>
          <Text className="text-gray-900 text-base">{fetchedUser?.email}</Text>
        </View>
      </View>

      {/* Availability */}
      <View className="bg-white w-full rounded-3xl p-6 mb-4 shadow-lg">
        <Text className="text-gray-900 text-lg font-bold mb-4">
          Availability This Week
        </Text>

        <View className="flex-row justify-between mb-3">
          <View className="flex-1 bg-green-50 rounded-xl p-3 mr-2">
            <Text className="text-gray-900 font-semibold text-xs">Mon</Text>
            <Text className="text-green-600 text-xs mt-1">9AM-5PM</Text>
          </View>
          <View className="flex-1 bg-green-50 rounded-xl p-3 mr-2">
            <Text className="text-gray-900 font-semibold text-xs">Tue</Text>
            <Text className="text-green-600 text-xs mt-1">9AM-5PM</Text>
          </View>
          <View className="flex-1 bg-green-50 rounded-xl p-3 mr-2">
            <Text className="text-gray-900 font-semibold text-xs">Wed</Text>
            <Text className="text-green-600 text-xs mt-1">9AM-5PM</Text>
          </View>
          <View className="flex-1 bg-gray-100 rounded-xl p-3">
            <Text className="text-gray-900 font-semibold text-xs">Thu</Text>
            <Text className="text-gray-500 text-xs mt-1">Off</Text>
          </View>
        </View>

        <TouchableOpacity className="bg-blue-50 rounded-xl p-3 items-center">
          <Text className="text-green-600 font-semibold">Manage Schedule</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Appointments */}
      <View className="bg-white w-full rounded-3xl p-6 mb-4 shadow-lg">
        <Text className="text-gray-900 text-lg font-bold mb-4">
          Today's Appointments
        </Text>

        <View className="bg-blue-50 rounded-2xl p-4 mb-3">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold">Tendai Moyo</Text>
              <Text className="text-gray-600 text-sm">
                General Consultation
              </Text>
              <Text className="text-green-600 text-xs mt-1">
                10:00 AM - 10:30 AM
              </Text>
            </View>
            <TouchableOpacity className="bg-green-600 px-4 py-2 rounded-xl">
              <Text className="text-white text-xs font-semibold">Start</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-gray-50 rounded-2xl p-4 mb-3">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold">Chipo Ndlovu</Text>
              <Text className="text-gray-600 text-sm">Follow-up Visit</Text>
              <Text className="text-gray-600 text-xs mt-1">
                11:00 AM - 11:30 AM
              </Text>
            </View>
            <View className="bg-gray-200 px-4 py-2 rounded-xl">
              <Text className="text-gray-600 text-xs font-semibold">
                Upcoming
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity className="mt-2">
          <Text className="text-green-600 font-semibold text-center">
            View Full Schedule →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Settings Options */}
      <View className="bg-white w-full rounded-3xl p-6 mb-6 shadow-lg">
        <TouchableOpacity className="py-4 border-b border-gray-100">
          <Text className="text-gray-900 font-semibold">Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-4 border-b border-gray-100">
          <Text className="text-gray-900 font-semibold">Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut} className="py-4">
          <Text className="text-red-600 font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isPendingModalVisible}
        onBackdropPress={closePendingModal}
        style={{ justifyContent: "center", margin: 20 }}
        animationIn="fadeIn"
        animationOut="fadeOut"
      >
        <View className="bg-white rounded-3xl p-6 shadow-2xl items-center">
          <Ionicons name="information-circle" size={48} color="#facc15" />
          <Text className="text-gray-900 text-xl font-bold mt-4 mb-2">
            Account Pending
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Your doctor account request is under review. You’ll be notified once
            it’s approved.
          </Text>

          <TouchableOpacity
            onPress={() => fetchCurrentUser()}
            className="bg-teal-600 rounded-2xl py-3 px-6"
          >
            <Text className="text-white font-bold text-base">Check Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={closePendingModal}
            className="mt-4 py-2 px-6"
          >
            <Text className="text-gray-500 font-medium">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/(auth)/sign-in");
    } catch (err) {
      console.log("Sign out failed:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {Loading && (
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color="#14B8A6" />
        </View>
      )}

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {userType === "patient" || accountStatus !== "APPROVED"
          ? renderPatientProfile()
          : renderDoctorProfile()}
      </ScrollView>

      <Modal
        isVisible={isModalVisible} // fixed your !isModalVisible issue
        onBackdropPress={toggleModal}
        style={{ justifyContent: "flex-end", margin: 0 }}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View
          className="bg-white rounded-t-3xl p-6 shadow-2xl"
          style={{ maxHeight: "90%" }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />

            <Text className="text-gray-900 text-2xl font-bold mb-2">
              Become a Doctor
            </Text>
            <Text className="text-gray-600 text-sm mb-6">
              Fill in your details to request a doctor account
            </Text>

            <Text className="text-gray-700 font-semibold mb-2">Full Name</Text>
            <TextInput
              placeholder="Tadiwa Blessed"
              className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 mb-4 text-base"
              value={fullName}
              onChangeText={(val) => setForm({ ...form, fullName: val })}
            />

            <Text className="text-gray-700 font-semibold mb-2">Specialty</Text>
            <TextInput
              placeholder="General Practitioner"
              className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 mb-4 text-base"
              value={form.specialty}
              onChangeText={(val) => setForm({ ...form, specialty: val })}
            />

            <Text className="text-gray-700 font-semibold mb-2">Short Bio</Text>
            <TextInput
              placeholder="A short description about yourself"
              className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 mb-4 text-base"
              value={form.bio}
              onChangeText={(val) => setForm({ ...form, bio: val })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text className="text-gray-700 font-semibold mb-2">Education</Text>
            <TextInput
              placeholder="Medical School / University"
              className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 mb-4 text-base"
              value={form.education}
              onChangeText={(val) => setForm({ ...form, education: val })}
            />

            <Text className="text-gray-700 font-semibold mb-2">
              Profile Picture
            </Text>
            <TouchableOpacity
              onPress={async () => {
                const { status } =
                  await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                  alert("Permission denied!");
                  return;
                }

                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  quality: 0.7,
                });

                if (!result.canceled) {
                  setForm({ ...form, imageUrl: result.assets[0].uri });
                }
              }}
              className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 mb-4 items-center flex-row"
            >
              <Text className="text-gray-500">
                {form.imageUrl ? "Change Image" : "Select Image"}
              </Text>
              {form.imageUrl && (
                <Image
                  source={{ uri: form.imageUrl }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 50,
                    marginLeft: 30,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                />
              )}
            </TouchableOpacity>

            <Text className="text-gray-700 font-semibold mb-2">
              Clinic Location
            </Text>
            <View className="bg-gray-100 rounded-2xl overflow-hidden mb-3 self-center">
              <View style={{ width: 350, height: 250, borderRadius: 16 }}>
                <Map
                  onLocationSelect={({ latitude, longitude, address }) =>
                    setForm({
                      ...form,
                      latitude: latitude.toString(),
                      longitude: longitude.toString(),
                      address,
                    })
                  }
                />
              </View>
            </View>
            <Text className="text-gray-500 text-sm mb-6">
              Tap on the map to select your clinic location
            </Text>
            <Text className="text-gray-700 font-semibold mb-1">
              Selected Clinic Address
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 mb-4 text-base"
              value={form.address}
              editable={false}
            />

            <TouchableOpacity
              onPress={submitDoctorRequest}
              className="bg-teal-600 rounded-2xl py-4 items-center mb-3 shadow-lg flex-row justify-center"
              activeOpacity={0.8}
              disabled={Loading}
            >
              {Loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Submit Request
                </Text>
              )}
            </TouchableOpacity>
            {fetchedUser?.doctorInfo ? (
              <View className="mb-4 items-center">
                <Text className="text-gray-700 font-semibold mb-2">
                  Doctor Request Status:
                </Text>
                <View className="bg-yellow-100 px-4 py-2 rounded-2xl">
                  <Text className="text-yellow-800 font-bold">
                    {fetchedUser.doctorInfo.accountStatus}
                  </Text>
                </View>

                {fetchedUser.doctorInfo.accountStatus === "PENDING" && (
                  <TouchableOpacity
                    onPress={() =>
                      alert("Your doctor request is still pending")
                    }
                    className="bg-teal-600 rounded-2xl py-4 px-6 mt-4"
                  >
                    <Text className="text-white font-bold text-base">
                      Check Status
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <TouchableOpacity
                onPress={submitDoctorRequest}
                className="bg-teal-600 rounded-2xl py-4 px-6 mb-3 flex-row justify-center items-center"
                disabled={Loading}
              >
                {Loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Submit Request
                  </Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={toggleModal}
              className="py-3 items-center"
            >
              <Text className="text-gray-500 font-medium">Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
