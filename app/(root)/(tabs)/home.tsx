import HealthTipsCarousel from "@/components/HealthTipsCarousel";
import QuickActionCard from "@/components/QuickActionCard";
import { icons } from "@/constants"; // adjust to your icons folder
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
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
  
  <View className="px-6 pt-4 pb-6">
    <View className="flex-row items-center justify-between">
      
      <View className="flex-1">
        <Text className="text-3xl font-JakartaExtraBold leading-tight">
          Welcome,{" "}
          <Text className="text-pali-secondary">{capitalizedDisplayName}</Text>
        </Text>
        <View className="flex-row items-center mt-2">
          <View className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2" />
          <Text className="text-sm text-gray-400 font-JakartaSemiBold">
            Linked. Synced. Sorted.
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

    
    
  </View>

  {/* Scrollable Content */}
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
      <QuickActionCard
        item={item}
        onPress={() => router.push("/")}
      />
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
          Choose an action to get started
        </Text>
      </View>
    )}
    ListFooterComponent={() => (
      <View className="px-6 mt-8">
       
       <View className="mb-6">
        Show arrays of doctors available
       </View>

        <HealthTipsCarousel />
      </View>
    )}
  />
</SafeAreaView>
  );
}
