import { useEffect, useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import {getAuthHeaders } from "@/lib";
import AvailableDoctor from "@/components/AvailableDoctor";
import { fetchAPI } from "@/lib/fetch";

export default function DiscoverDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      const headers = await getAuthHeaders();
      const res = await fetchAPI(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/doctors/verified`, { headers });
      setDoctors(res.data);
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(d =>
    d.fullName.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white">
      <TextInput
        placeholder="Search doctors by name or specialty"
        className="bg-gray-100 p-3 mx-4 mt-4 rounded-xl"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.doctorId}
        renderItem={({ item }) => <AvailableDoctor doctor={item} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}
