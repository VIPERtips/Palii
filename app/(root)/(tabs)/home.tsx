import QuickActionCard from "@/components/QuickActionCard";
import { icons } from "@/constants"; // adjust to your icons folder
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const quickActions = [
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
      id: "hey",
       label: "Medical History",
      icon: "document-text-outline",
      color: "#00C49A",
      route: "/history",
    }
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

  return (
    <SafeAreaView className="bg-pali-background flex-1">
      <FlatList
        data={quickActions}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between", gap: 10, marginBottom: 5, borderRadius: 50 }}
        renderItem={({ item }) => (
          <QuickActionCard
            item={item}
            onPress={() => router.push("/")}
          />
        )}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: 10,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={() => (
          <View className="flex flex-row items-center justify-between px-5 mt-5 mb-7">
            <View>
              <Text className="text-2xl font-JakartaExtraBold">
                Welcome,{" "}
                <Text className="text-pali-secondary">{capitalizedDisplayName}</Text> 👋
              </Text>
              <Text className="text-sm text-gray-400 mt-1 font-JakartaBold leading-tight">
                Linked. Synced. Sorted.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSignOut}
              className="justify-center items-center h-10 w-10 rounded-full bg-white/10 border border-white/20"
            >
              <Image source={icons.out} className="w-5 h-5" />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
