import { getAuthHeaders } from "@/lib";
import { fetchAPI } from "@/lib/fetch";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DoctorAvailability() {
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [recurring, setRecurring] = useState("none");
  const [modalVisible, setModalVisible] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const router = useRouter();

  const teal = "#008080";
  const red = "#FF3B30";

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetchAPI(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/availability/doctor`, {
          headers,
        });
        setAvailabilities(res.data || []);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch availabilities.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailabilities();
  }, []);

  const handleSaveAvailability = async () => {
    if (!startTime || !endTime) {
      Alert.alert("Validation Error", "Start and end times are required.");
      return;
    }

    if (startTime >= endTime) {
      Alert.alert("Validation Error", "End time must be after start time.");
      return;
    }

    const dto = {
      startTime,
      endTime,
      recurring,
    };

    try {
      const headers = await getAuthHeaders();

      if (editingId) {
        await fetchAPI(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/availability/${editingId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(dto),
        });
      } else {
        await fetchAPI(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/availability`, {
          method: "POST",
          headers,
          body: JSON.stringify(dto),
        });
      }

      setModalVisible(false);
      setEditingId(null);
      setRecurring("none");
      const res = await fetchAPI(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/availability/doctor`, {
        headers,
      });
      setAvailabilities(res.data || []);
      Alert.alert("Success", "Availability saved successfully.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save availability. Try again.");
    }
  };

  const handleDeleteAvailability = async (id: number) => {
    try {
      const headers = await getAuthHeaders();
      await fetchAPI(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/availability/${id}`, {
        method: "DELETE",
        headers,
      });
      setAvailabilities(availabilities.filter((a) => a.id !== id));
      Alert.alert("Deleted", "Availability removed.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete availability.");
    }
  };

  const openEditModal = (avail: any) => {
    setEditingId(avail.id);
    setSelectedDate(new Date(avail.startTime));
    setStartTime(new Date(avail.startTime));
    setEndTime(new Date(avail.endTime));
    setRecurring(avail.recurring);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color={teal} />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-white p-4 mb-3 rounded-xl shadow-sm flex-row justify-between items-center">
      <View>
        <Text className="text-gray-900 font-semibold text-lg">
          {new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
          {new Date(item.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
        <Text className="text-gray-600 text-sm">Recurring: {item.recurring}</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity onPress={() => openEditModal(item)} className="mr-3">
          <Ionicons name="pencil" size={24} color={teal} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteAvailability(item.id)}>
          <Ionicons name="trash" size={24} color={red} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 bg-white shadow">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color={teal} />
        </TouchableOpacity>
        <View>
          <Text className="text-2xl font-bold text-gray-900">Availability Times</Text>
          <Text className="text-gray-600 text-sm">Manage your availability slots</Text>
        </View>
      </View>

      <FlatList
        data={availabilities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={<Text className="text-gray-500 mt-2">No availabilities set yet.</Text>}
      />

      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-teal-500 p-4 rounded-full shadow-lg"
        onPress={() => {
          setEditingId(null);
          setStartTime(new Date());
          setEndTime(new Date());
          setRecurring("none");
          setSelectedDate(new Date());
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-6 rounded-t-2xl">
            <Text className="text-xl font-bold text-gray-900 mb-1">
              {editingId ? "Edit Availability" : "Add Availability"}
            </Text>
            <Text className="text-gray-600 mb-4">Set your slot below</Text>

            {/* Date Picker */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Date</Text>
              <TouchableOpacity
                className="flex-row items-center p-3 border border-gray-300 rounded-lg"
                onPress={() => setShowStartPicker(true)}
              >
                <Ionicons name="calendar" size={20} color={teal} className="mr-2" />
                <Text>{selectedDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowStartPicker(Platform.OS === "ios");
                    if (date) setSelectedDate(date);
                  }}
                />
              )}
            </View>

            {/* Start Time */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Start Time</Text>
              <TouchableOpacity
                className="flex-row items-center p-3 border border-gray-300 rounded-lg"
                onPress={() => setShowStartPicker(true)}
              >
                <Ionicons name="time" size={20} color={teal} className="mr-2" />
                <Text>{startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  is24Hour={false}
                  display="spinner"
                  onChange={(event, date) => {
                    setShowStartPicker(Platform.OS === "ios");
                    if (date) setStartTime(date);
                  }}
                />
              )}
            </View>

            {/* End Time */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-1">End Time</Text>
              <TouchableOpacity
                className="flex-row items-center p-3 border border-gray-300 rounded-lg"
                onPress={() => setShowEndPicker(true)}
              >
                <Ionicons name="time" size={20} color={teal} className="mr-2" />
                <Text>{endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  is24Hour={false}
                  display="spinner"
                  onChange={(event, date) => {
                    setShowEndPicker(Platform.OS === "ios");
                    if (date) setEndTime(date);
                  }}
                />
              )}
            </View>

            {/* Recurring */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-1">Recurring</Text>
              <View className="flex-row">
                {["none", "daily", "weekly"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setRecurring(option)}
                    className={`px-4 py-2 mr-2 rounded-lg border ${
                      recurring === option ? `border-teal-500 bg-teal-100` : "border-gray-300 bg-gray-100"
                    }`}
                  >
                    <Text className="text-gray-700">{option.charAt(0).toUpperCase() + option.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="flex-1 mr-2 bg-gray-300 p-3 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-gray-700 text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 ml-2 bg-teal-500 p-3 rounded-lg"
                onPress={handleSaveAvailability}
              >
                <Text className="text-white text-center">{editingId ? "Update" : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
