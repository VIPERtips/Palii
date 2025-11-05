import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

export default function QuickActionCard({ item, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 m-4 rounded-full"
      activeOpacity={0.7}
    >
      <View className="overflow-hidden gap-2 shadow-lg">
        <LinearGradient
          colors={[item.color + "15", item.color + "08"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-5 items-center justify-center border border-white/20"
          style={{ minHeight: 140 }}
        >
          
          <View className="relative mb-3">
            <View
              className="p-4 rounded-2xl"
              style={{
                backgroundColor: item.color + "20",
                shadowColor: item.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Ionicons name={item.icon} size={32} color={item.color} />
            </View>
            
            
            <View
              className="absolute -inset-1 rounded-2xl opacity-30"
              style={{
                borderWidth: 1.5,
                borderColor: item.color,
              }}
            />
          </View>

        
          <Text className="text-pali-secondary text-sm font-JakartaSemiBold text-center">
            {item.label}
          </Text>
          
          
          <Text className="text-pali-secondary/60 text-xs font-JakartaMedium text-center mt-1">
            {item.id === "book" ? "Schedule" : "Engage"}
          </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

