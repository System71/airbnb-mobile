import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
      );
      setData(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

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
    <FlatList
      style={styles.flatList}
      data={data}
      keyExtractor={(item) => String(item._id)}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.room}
          onPress={() => navigation.navigate("room", { id: item._id })}
        >
          <Image
            style={styles.imgRoom}
            source={{ uri: item.photos[0].url }}
          ></Image>
          <View style={[styles.row, styles.spaceBetween]}>
            <View style={styles.informations}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={styles.row}>
                {starRate(item)}
                <Text style={styles.textGrey}>{item.reviews} reviews</Text>
              </View>
            </View>
            <Image
              style={styles.userAvatar}
              source={{ uri: item.user.account.photo.url }}
            ></Image>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    width: "100%",
  },
  room: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    // borderColor: "green",
    // borderWidth: 1,
  },
  imgRoom: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    flexShrink: 1,
    flexGrow: 0,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
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
});
