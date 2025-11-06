import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, FlatList, Text, View } from "react-native";

const tips = [
  {
    id: "1",
    icon: "water",
    title: "Hydrate",
    description: "Drink at least 8 glasses of water daily to stay healthy.",
    color: "#00D4AA",
  },
  {
    id: "2",
    icon: "fitness",
    title: "Stay Active",
    description: "Take short walks or stretch every few hours.",
    color: "#FF6B6B",
  },
  {
    id: "3",
    icon: "moon",
    title: "Sleep Well",
    description: "Aim for 7-8 hours of quality sleep each night.",
    color: "#6C5CE7",
  },
  {
    id: "4",
    icon: "bulb",
    title: "Pro Tip",
    description: "Enable notifications to never miss an appointment or update.",
    color: "#FFA500",
  },
  {
    id: "5",
    icon: "nutrition",
    title: "Healthy Eating",
    description: "Include fruits and vegetables in your daily meals.",
    color: "#00BFFF",
  },
];

const { width } = Dimensions.get("window");

export default function HealthTipsCarousel() {
  return (
    <View 
          className="bg-gradient-to-br from-pali-secondary/20 to-pali-secondary/5 rounded-3xl p-6 border border-pali-secondary/20 mb-5"
          style={{
            shadowColor: "#00D4AA",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <View className="px-6 mb-4">
        <Text className="text-xl font-JakartaBold text-pali-card-foreground">
          Health Tips
        </Text>
        <Text className="text-sm text-gray-400 font-JakartaMedium mt-1">
          Daily wellness reminders for you
        </Text>
      </View>

    <View className="mt-6 cursor-pointer">
      <FlatList
        data={tips}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View
            className="bg-white rounded-2xl p-4 mr-4 shadow-md"
            style={{ width: width * 0.7 }}
          >
            <View className="flex-row items-start mb-2">
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                style={{ backgroundColor: item.color + "20" }}
              >
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base mb-1">
                  {item.title}
                </Text>
                <Text className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
    </View>
  );
}
