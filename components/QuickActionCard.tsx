import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

export default function QuickActionCard({ item, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1 m-3"
    >
      <LinearGradient
        colors={[item.color + "15", item.color + "08"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl overflow-hidden p-5 items-center justify-center"
        style={{
          minHeight: 150,
          shadowColor: item.color,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 6,
          backgroundColor: "white",
        }}
      >
        {/* Icon container */}
        <View
          className="p-5 rounded-3xl mb-4"
          style={{
            shadowColor: item.color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name={item.icon} size={36} color={item.color} />
        </View>

        {/* Label */}
        <Text className="text-pali-secondary text-base font-JakartaSemiBold text-center">
          {item.label}
        </Text>

        {/* Subtitle */}
        <Text className="text-pali-secondary/60 text-sm font-JakartaMedium text-center mt-1">
          {item.id === "book"
            ? "Schedule"
            : item.id === "alerts"
            ? "Notify"
            : item.id === "history"
            ? "View"
            : item.id === "doctors"
            ? "Find"
            : item.id === "prescriptions"
            ? "View"
            : item.id === "reports"
            ? "Check"
            : "Go"}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
