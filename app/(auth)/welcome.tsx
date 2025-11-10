import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

export default function Onboarding() {
  const swiperRef = useRef<Swiper | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (activeIndex === onboarding.length - 1) {
      router.replace("/(auth)/sign-up");
    } else {
      swiperRef.current?.scrollBy(1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-pali-background">
      <View className="w-full flex-row justify-end px-5 pt-5">
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/sign-up")}
          className="p-2"
        >
          <Text className="text-pali-muted-foreground text-md font-JakartaBold">
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View className="w-8 h-1 bg-pali-muted rounded-full mx-1" />}
        activeDot={
          <View className="w-8 h-1 bg-pali-primary rounded-full mx-1" />
        }
        onIndexChanged={(idx) => setActiveIndex(idx)}
        containerStyle={{ flexGrow: 1 }}
      >
        {onboarding.map((item) => (
          <View
            key={item.id}
            className="flex-1 justify-center items-center px-8"
          >
            <Image
              source={item.image}
              style={{
                width: "100%",
                height: 256,
                borderRadius: 16,
                resizeMode: "contain",
              }}
            />

            <Text className="text-pali-foreground text-4xl font-bold text-center mt-10 leading-snug">
              {item.title}
            </Text>

            <Text className="text-pali-muted-foreground text-lg text-center mt-4 leading-relaxed">
              {item.description}
            </Text>

            <View className="flex-row flex-wrap justify-center gap-3 mt-6">
              {item.features.map((feature, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center gap-2 bg-pali-secondary border border-pali-secondary px-3 py-2 rounded-full shadow-sm"
                >
                  <View className="w-6 h-6 rounded-full bg-pali-primary items-center justify-center">
                    <Ionicons name="checkmark" size={14} color="white" />
                  </View>
                  <Text className="text-pali-card text-sm font-semibold">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Swiper>

      <View className="w-full px-8 pb-10 mt-4 text-white">
        <CustomButton
          title={activeIndex === onboarding.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          bgVariant="pali-primary"
          iconRight={<Ionicons name="arrow-forward" size={20} color="white" />}
        />
      </View>
    </SafeAreaView>
  );
}
