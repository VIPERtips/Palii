import { getAuthHeaders } from "@/lib";
import { fetchAPI } from "@/lib/fetch";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const FALLBACK_DOCTOR = {
  fullName: "Dr. Tadiwa Blessed",
  specialty: "Software Systems Specialist - University of Zimbabwe",
  imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
  avgRating: 5.0,
  reviewCount: 999,
  experience: 2,
  available: true,
  bio: "Passionate about software development, system design, and building tech solutions. Loves coding, movies, and detective series.",
  education: "BSc Business Management Systems - University of Zimbabwe",
  address: "Harare, Zimbabwe",
  consultationFee: 0,
  availableSlots: [
    { day: "Sun", date: 23, slots: ["10:00 AM", "11:00 AM", "12:00 PM"] },
    { day: "Mon", date: 24, slots: ["10:00 AM", "11:00 AM", "12:00 PM"] },
    { day: "Wed", date: 25, slots: ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM"] },
    { day: "Thu", date: 26, slots: ["10:00 AM", "11:00 AM", "12:00 PM"] },
    { day: "Fri", date: 27, slots: ["10:00 AM", "11:00 AM", "12:00 PM"] },
  ],
};


export default function DoctorDetails() {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(2);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();
  const router = useRouter();
  const [showRating, setShowRating] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    if (!doctorId) {

      setDoctor(FALLBACK_DOCTOR);
      setLoading(false);
      return;
    }

    const fetchDoctor = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetchAPI(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/api/doctors/${doctorId}`,
          { headers }
        );


        setDoctor({
          ...FALLBACK_DOCTOR,
          ...res.data,
          availableSlots: res.data.availableSlots || FALLBACK_DOCTOR.availableSlots,
        });

        console.log(res.data);
      } catch (error) {
        console.error("Error fetching doctor:", error);

        setDoctor(FALLBACK_DOCTOR);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600 font-Jakarta">Loading doctor details...</Text>
      </SafeAreaView>
    );
  }

  if (!doctor) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
        <Text className="mt-4 text-gray-600 font-JakartaBold text-lg">Doctor not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-teal-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-JakartaSemiBold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentSlots = doctor.availableSlots?.[selectedDate]?.slots || [];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="relative mb-5">
          <Image
            source={{ uri: doctor.imageUrl }}
            style={{
              width: "100%",
              height: 500,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 8,

            }}
            resizeMode="cover"
          />

          <LinearGradient
            colors={["transparent", "rgba(2,4,0,0.2)"]} 
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 100, 
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
            }}
          />

          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md"
            style={{ elevation: 5 }}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>



        <View className="bg-white px-5 pt-5 pb-4 -mt-20 rounded-t-3xl">
          <Text className="text-2xl font-JakartaBold text-gray-900">{doctor.fullName}</Text>
          <Text className="text-gray-600 mt-1 font-Jakarta">{doctor.specialty}</Text>


          <View className="flex-row items-center mt-3">
            <View className="flex-row items-center bg-yellow-50 px-3 py-1 rounded-lg">
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text className="ml-1 text-gray-900 font-JakartaBold">
                {doctor.avgRating || "0.0"}
              </Text>
              <Text className="ml-1 text-gray-500 text-xs font-Jakarta">
                ({doctor.reviewCount || "256"} Reviews)
              </Text>
            </View>

            <View className="ml-3 flex-row items-center bg-teal-50 px-3 py-1 rounded-lg">
              <Ionicons name="briefcase-outline" size={16} color="#3B82F6" />
              <Text className="ml-1 text-gray-900 font-JakartaSemiBold">
                {doctor.experience || "7"} Years
              </Text>
            </View>
          </View>


          <Text className="mt-4 text-gray-700 leading-6 font-Jakarta">
            {doctor.bio || "No bio available"}
            {doctor.bio && doctor.bio.length > 100 && (
              <Text className="text-teal-500 font-JakartaSemiBold"> Read More</Text>
            )}
          </Text>
        </View>

        <View className="bg-white px-5 py-4 mt-3 rounded-2xl shadow-sm">
          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => setShowRating(!showRating)}
          >
            <Text className="text-lg font-JakartaBold text-gray-900">Rate & Review</Text>
            <Ionicons
              name={showRating ? "chevron-up-outline" : "chevron-down-outline"}
              size={24}
              color="#6B7280"
            />
          </TouchableOpacity>

          {showRating && (
            <View className="mt-4">

              <View className="flex-row items-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                    <Ionicons
                      name={star <= userRating ? "star" : "star-outline"}
                      size={28}
                      color="#F59E0B"
                      style={{ marginRight: 6 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>


              <TextInput
                value={reviewComment}
                onChangeText={setReviewComment}
                placeholder="Share your experience..."
                className="border border-gray-300 rounded-xl p-3 text-gray-700 mb-3"
                multiline
                numberOfLines={3}
              />

              {/* Submit Button */}
              <TouchableOpacity
                className={`py-3 rounded-xl items-center ${userRating ? "bg-teal-500" : "bg-gray-300"}`}
                disabled={!userRating}
                onPress={() => {
                  console.log("Rating:", userRating, "Comment:", reviewComment);
                  alert("Thanks for your review!");
                  setUserRating(0);
                  setReviewComment("");
                  setShowRating(false);
                }}
              >
                <Text className="text-white font-JakartaBold">Submit Review</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>



        <View className="bg-white mt-3 px-5 py-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-JakartaBold text-gray-900">Create Schedule</Text>

            <TouchableOpacity className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg">
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-700 text-sm font-JakartaSemiBold">
                {doctor.availableSlots?.[selectedDate]?.day} {doctor.availableSlots?.[selectedDate]?.date}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" className="ml-1" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-600 text-sm mb-4 font-Jakarta">
            Easily plan your appointment at a time
          </Text>


          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
            {(doctor.availableSlots || FALLBACK_DOCTOR.availableSlots).map((slot: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedDate(index);
                  setSelectedTime(null);
                }}
                className={`mr-3 items-center justify-center w-16 h-20 rounded-2xl ${selectedDate === index
                  ? "bg-teal-500"
                  : "bg-gray-100 border border-gray-200"
                  }`}
              >
                <Text
                  className={`text-xs font-JakartaSemiBold ${selectedDate === index ? "text-white" : "text-gray-600"
                    }`}
                >
                  {slot.day}
                </Text>
                <Text
                  className={`text-xl font-JakartaBold mt-1 ${selectedDate === index ? "text-white" : "text-gray-900"
                    }`}
                >
                  {slot.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>


          <View className="flex-row flex-wrap">
            {currentSlots.map((time: string, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedTime(time)}
                className={`px-6 py-3 rounded-xl mb-3 mr-3 border ${selectedTime === time
                  ? "bg-teal-500 border-teal-500"
                  : "bg-white border-gray-300"
                  }`}
              >
                <Text
                  className={`font-JakartaSemiBold ${selectedTime === time ? "text-white" : "text-gray-700"
                    }`}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>


        <View className="h-24" />
      </ScrollView>


      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 py-4 border-t border-gray-200">
        <TouchableOpacity
          className={`flex-row items-center justify-center py-4 rounded-xl ${doctor.available && selectedTime ? "bg-teal-500" : "bg-gray-300"
            }`}
          disabled={!doctor.available || !selectedTime}
        >
          <Ionicons
            name="calendar"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text className="text-white text-center font-JakartaBold text-base">
            {selectedTime ? "Book Appointment" : "Select a time slot"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}