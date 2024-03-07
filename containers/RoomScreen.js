import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

export default function RoomScreen() {
  const route = useRoute();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [markers, SetMarkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${route.params.id}`
      );
      console.log("response=", response.data);
      setData(response.data);
      SetMarkers([
        {
          id: 1,
          latitude: response.data.location[1],
          longitude: response.data.location[0],
        },
      ]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  console.log("markers=", markers);

  //Function for stars rating
  const starRate = (item) => {
    let rates = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= item.ratingValue) {
        rates.push(
          <FontAwesome name="star" size={18} color="#FFB100" key={i} />
        );
      } else {
        rates.push(<FontAwesome name="star" size={18} color="grey" key={i} />);
      }
    }
    return <Text>{rates}</Text>;
  };

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.room}>
      <Image
        style={styles.picture}
        source={{ uri: data.photos[0].url }}
      ></Image>
      <View style={[styles.row, styles.spaceBetween]}>
        <View style={styles.informations}>
          <Text style={styles.title} numberOfLines={1}>
            {data.title}
          </Text>
          <View style={styles.row}>
            {starRate(data)}
            <Text style={styles.textGrey}>{data.reviews} reviews</Text>
          </View>
        </View>
        <Image
          style={styles.userAvatar}
          source={{ uri: data.user.account.photo.url }}
        ></Image>
      </View>
      <Text style={styles.description} numberOfLines={3}>
        {data.description}
      </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  room: {
    width: "100%",
  },
  picture: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  informations: {
    height: 80,
    justifyContent: "space-around",
    flexShrink: 1,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginLeft: 10,
  },
  textGrey: {
    color: "grey",
    flexWrap: "wrap",
  },
  description: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  map: {
    width: "100%",
    height: 300,
  },
});
