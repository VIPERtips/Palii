/* eslint-disable react/no-unescaped-entities */
import AvailableDoctor from "@/components/AvailableDoctor";
import HealthTipsCarousel from "@/components/HealthTipsCarousel";
import PatientScheduled from "@/components/PatientScheduled";
import QuickActionCard from "@/components/QuickActionCard";
import { icons } from "@/constants";
import { getAuthHeaders } from "@/lib";
import { fetchAPI } from "@/lib/fetch";
import { useAuth, useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem("userRole");
        if (role === "DOCTOR" || role === "PATIENT") {
          setUserRole(role);
        }
      } catch (err) {
        console.log("Failed to fetch user role:", err);
      }
    };

    const fetchDoctors = async () => {
      try {
        const headers = await getAuthHeaders();

        const res = await fetchAPI(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/api/doctors/verified`,
          { headers }
        );
        console.log(res.data);
        setAvailableDoctors(res.data);
      } catch (error) {
        console.log("Error fetching doctor info:", error);
      }
    };

    fetchUserRole();
    fetchDoctors();
  }, []);

  if (!userRole) {
    return (
      <SafeAreaView className="bg-teal-900 flex-1 justify-center items-center">
        <View className="bg-teal-700 p-4 rounded-lg shadow-md">
          <Text className="text-teal-200 text-lg font-semibold">
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const patientActions = [
    {
      id: "book",
      label: "Book Appointment",
      icon: "calendar-outline",
      color: "#0286FF",
      route: "/book",
    },
    {
      id: "alerts",
      label: "Emergency Alert",
      icon: "alert-circle-outline",
      color: "#FF4D4F",
      route: "/alert",
    },
    {
      id: "history",
      label: "Medical History",
      icon: "document-text-outline",
      color: "#00C49A",
      route: "/history",
    },
    {
      id: "doctors",
      label: "Find Doctors",
      icon: "people-outline",
      color: "#9C27B0",
      route: "/doctors",
    },
    {
      id: "prescriptions",
      label: "Prescriptions",
      icon: "medical-outline",
      color: "#FF9800",
      route: "/prescriptions",
    },
    {
      id: "reports",
      label: "Lab Reports",
      icon: "flask-outline",
      color: "#00BCD4",
      route: "/reports",
    },
  ];

  
  const doctorActions = [
    {
      id: "appointments",
      label: "Today's Schedule",
      icon: "calendar-outline",
      color: "#0286FF",
      route: "/doctorAvailability",
    },
    {
      id: "patients",
      label: "My Patients",
      icon: "people-outline",
      color: "#00C49A",
      route: "/patients",
    },
    {
      id: "consultations",
      label: "Video Consult",
      icon: "videocam-outline",
      color: "#9C27B0",
      route: "/consult",
    },
    {
      id: "prescribe",
      label: "Prescribe",
      icon: "medical-outline",
      color: "#FF9800",
      route: "/prescribe",
    },
    {
      id: "records",
      label: "Patient Records",
      icon: "document-text-outline",
      color: "#00BCD4",
      route: "/records",
    },
    {
      id: "earnings",
      label: "Earnings",
      icon: "wallet-outline",
      color: "#4CAF50",
      route: "/earnings",
    },
  ];

  const quickActions = userRole === "PATIENT" ? patientActions : doctorActions;

  const todaysPatients = [
    {
      id: "1",
      name: "Tadiwa Blexta",
      time: "10:00 AM",
      type: "General Consultation",
      status: "upcoming",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    {
      id: "2",
      name: "Pauline C",
      time: "11:30 AM",
      type: "Follow-up Visit",
      status: "upcoming",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    {
      id: "3",
      name: "Blessed Tadiwa",
      time: "2:00 PM",
      type: "Initial Consultation",
      status: "upcoming",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/(auth)/sign-in");
    } catch (err) {
      console.log("Sign out failed:", err);
    }
  };

  const displayName =
    user?.firstName ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "User";

  const capitalizedDisplayName =
    displayName.charAt(0).toUpperCase() + displayName.slice(1);

  // Render Available Doctors (for patients)
  const renderDoctorsSection = () => (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-xl font-JakartaBold text-pali-foreground">
            Available Doctors
          </Text>
          <Text className="text-sm text-gray-400 font-JakartaMedium mt-1">
            Online and ready to help
          </Text>
        </View>
        <TouchableOpacity>
          <Text className="text-pali-secondary font-JakartaSemiBold text-sm">
            View All →
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={availableDoctors}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.doctorId}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => <AvailableDoctor doctor={item} />}
      />
    </View>
  );

  const renderPatientsSection = () => (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-xl font-JakartaBold text-pali-foreground">
            Today's Appointments
          </Text>
          <Text className="text-sm text-gray-400 font-JakartaMedium mt-1">
            {todaysPatients.length} patients scheduled
          </Text>
        </View>
        <TouchableOpacity>
          <Text className="text-pali-secondary font-JakartaSemiBold text-sm">
            View All →
          </Text>
        </TouchableOpacity>
      </View>

      <View className="space-y-3">
        {todaysPatients.map((patient, index) => (
          <PatientScheduled
            patient={patient}
            key={index}
            todaysPatients={todaysPatients}
          />
        ))}
      </View>
    </View>
  );

  const renderDoctorStats = () => (
    <View className="flex-row mt-6 space-x-3">
      <View
        className="flex-1 bg-white/5 rounded-2xl px-4 py-3 border border-white/10 me-2"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          backgroundColor: "white",
        }}
      >
        <Text className="text-gray-400 text-xs font-JakartaSemiBold">
          Today
        </Text>
        <Text className="text-pali-popover-foreground/60  text-xl font-JakartaBold mt-1">
          {todaysPatients.length} Patients
        </Text>
      </View>

      <View
        className="flex-1 bg-white/5 rounded-2xl px-4 py-3 border border-white/10"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          backgroundColor: "white",
        }}
      >
        <Text className="text-gray-400 text-xs font-JakartaSemiBold">
          This Week
        </Text>
        <Text className="text-pali-popover-foreground/60  text-xl font-JakartaBold mt-1">
          47 Total
        </Text>
      </View>
    </View>
  );

  // Render Patient Stats (for patients)
  const renderPatientStats = () => (
    <View className="flex-row mt-6 space-x-3">
      <View
        className="flex-1 bg-white/5 rounded-2xl px-4 py-3 border border-white/10 me-2"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          backgroundColor: "white",
        }}
      >
        <Text className="text-gray-400 text-xs font-JakartaSemiBold">
          Upcoming
        </Text>
        <Text className="text-pali-popover-foreground/60  text-xl font-JakartaBold mt-1">
          2 Visits
        </Text>
      </View>

      <View
        className="flex-1 bg-white/5 rounded-2xl px-4 py-3 border border-white/10"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          backgroundColor: "white",
        }}
      >
        <Text className="text-gray-400 text-xs font-JakartaSemiBold">
          Completed
        </Text>
        <Text className="text-pali-popover-foreground/60 text-xl font-JakartaBold mt-1">
          12 Total
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="bg-pali-background flex-1">
      <View className="px-6 pt-4 pb-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-3xl font-JakartaExtraBold leading-tight">
              Welcome,{" "}
              <Text className="text-pali-secondary">
                {userRole === "DOCTOR" && !capitalizedDisplayName.startsWith("Dr.") ? "Dr. " : ""}
                {capitalizedDisplayName}
              </Text>
            </Text>
            <View className="flex-row items-center mt-2">
              <View className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2" />
              <Text className="text-sm text-gray-400 font-JakartaSemiBold">
                {userRole === "DOCTOR"
                  ? "Ready to help patients"
                  : "Linked. Synced. Sorted."}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSignOut}
            className="justify-center items-center h-12 w-12 rounded-[18px] bg-white/8 border border-white/10"
            activeOpacity={0.7}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Image source={icons.out} className="w-5 h-5" tintColor="black" />
          </TouchableOpacity>
        </View>
        {userRole === "DOCTOR" ? renderDoctorStats() : renderPatientStats()}
      </View>

      <FlatList
        data={quickActions}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          gap: 12,
          paddingHorizontal: 20,
          marginBottom: 12,
        }}
        renderItem={({ item }) => (
          <QuickActionCard item={item} onPress={() => router.push(item.route as any)} />
        )}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={() => (
          <View className="px-6 mb-5 mt-2">
            <Text className="text-xl font-JakartaBold text-pali-foreground">
              Quick Actions
            </Text>
            <Text className="text-sm text-gray-400 font-JakartaMedium mt-1">
              {userRole === "DOCTOR"
                ? "Manage your practice efficiently"
                : "Choose an action to get started"}
            </Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View className="px-6 mt-8">
            {userRole === "PATIENT"
              ? renderDoctorsSection()
              : renderPatientsSection()}
            <HealthTipsCarousel />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
