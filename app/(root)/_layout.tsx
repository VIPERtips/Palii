import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="doctor-details/[doctorId]"
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="doctorAvailability"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
