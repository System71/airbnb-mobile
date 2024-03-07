import { Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import axios from "axios";
import * as Location from "expo-location";

const AroundMe = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [error, setError] = useState();
  const [coords, setCoords] = useState();

  useEffect(() => {
    const askPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
    };
    askPermission();

    //     let permissionResponse = await Location.requestForegroundPermissionsAsync();
    // console.log("permissionResponse =>", permissionResponse); // console.log permettant de visualiser l'objet obtenu

    const fetchData = async () => {
      const response = await axios.get(
        `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=48.856614&longitude=2.3522219`
      );
      console.log("response=", response.data);
      const markersTab = [];
      response.data.map((room) =>
        markersTab.push({
          id: room._id,
          latitude: room.location[1],
          longitude: room.location[0],
        })
      );
      console.log("markers=", markers);
      setMarkers(markersTab);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 48.856614,
        longitude: 2.3522219,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }}
    >
      {markers.map((marker) => {
        return (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          />
        );
      })}
    </MapView>
  );
};

export default AroundMe;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 300,
    flex: 1,
  },
});
