/* eslint-disable react-hooks/exhaustive-deps */
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";

interface MapProps {
  onLocationSelect: (data: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

const Map: React.FC<MapProps> = ({ onLocationSelect }) => {
  const [region, setRegion] = useState({
    latitude: -17.824858,
    longitude: 31.053028,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      console.log("Requesting location permissions...");
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission denied.");
        Alert.alert("Permission Denied", "Location permission is required to select your clinic.");
        setLoading(false);
        return;
      }

      console.log("Permission granted. Fetching current location...");
      const location = await Location.getCurrentPositionAsync({});
      console.log("Current location:", location);

      const { latitude, longitude } = location.coords;

      setRegion((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));

      setMarker({ latitude, longitude });

      console.log("Fetching address for coordinates:", latitude, longitude);
      const addressData = await Location.reverseGeocodeAsync({ latitude, longitude });

      console.log("Address data:", addressData);

      const address = addressData[0]
        ? `${addressData[0].name || ""}, ${addressData[0].city || ""}, ${addressData[0].region || ""}`
        : "Unknown location";

      console.log("Resolved address:", address);

      onLocationSelect({ latitude, longitude, address });
      setLoading(false);
    })();
  }, []);

  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    console.log("Map pressed at:", latitude, longitude);

    setMarker({ latitude, longitude });

    const addressData = await Location.reverseGeocodeAsync({ latitude, longitude });
    console.log("Address data for tapped location:", addressData);

    const address = addressData[0]
  ? [
      addressData[0].name,
      addressData[0].street,
      addressData[0].district,
      addressData[0].subregion,
      addressData[0].city,
      addressData[0].region,
    ]
      .filter(Boolean)
      .join(", ")
  : "Unknown location";

    console.log("Resolved address from map press:", address);

    onLocationSelect({ latitude, longitude, address });
  };

  if (loading) {
    console.log("Loading map...");
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  console.log("Rendering MapView with region:", region);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType="standard"
        showsUserLocation
        initialRegion={region}
        onPress={handleMapPress}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Map;
