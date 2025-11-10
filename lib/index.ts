import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await AsyncStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
