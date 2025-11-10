import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function AvailableDoctor({ doctor }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="bg-white/8 rounded-3xl p-4 border border-white/10 mb-5"
      style={{
        width: 160,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        backgroundColor: "white",
      }}
    >
      <View className="doctors-center">
        <View className="relative items-center">
          <Image
            source={{ uri: doctor.imageUrl }}
            style={{ width: 56, height: 56, borderRadius: 28 }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 16,
              height: 16,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "#fff",
              backgroundColor: doctor.available ? "#22c55e" : "#9ca3af", // green-500 or gray-400
            }}
          />
        </View>

        <Text className="text-text-pali-popover-foreground/60  font-JakartaBold text-sm mt-3 text-center">
          {doctor.fullName}
        </Text>
        <Text className="text-gray-400 font-JakartaMedium text-xs mt-1">
          {doctor.specialty}
        </Text>

        <View className="flex-row doctors-center mt-2">
          <Ionicons name="star" size={14} color="#FFA500" />
          <Text className="text-gray-500 font-JakartaSemiBold text-xs ml-1">
            {doctor.avgRating}
          </Text>
        </View>

        <TouchableOpacity
          className="mt-3 bg-pali-secondary/20 px-4 py-2 rounded-xl w-full"
          disabled={!doctor.available}
        >
          <Text className="text-pali-secondary font-JakartaSemiBold text-xs text-center">
            {doctor.available ? "Book Now" : "Unavailable"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
