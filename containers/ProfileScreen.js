import { useRoute } from "@react-navigation/core";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ userToken, setUserToken, userID }) {
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState();
  const [userName, setUserName] = useState();
  const [description, setDescription] = useState();

  useEffect(() => {
    console.log("token=", userToken);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setEmail(response.data.email);
        setUserName(response.data.username);
        setDescription(response.data.description);
        setSelectedPicture(response.data.photo.url);
        setIsLoading(false);
        console.log("response.data=", response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const getPermissionAndGetPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (result.canceled === true) {
        alert("Pas de photo sélectionnée");
      } else {
        setSelectedPicture(result.assets[0].uri);
      }
    } else {
      alert("Permission refusée");
    }
  };

  const getPermissionAndTakePicture = async () => {
    //Demander le droit d'accéder à l'appareil photo
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      //Ouvrir l'appareil photo
      const result = await ImagePicker.launchCameraAsync();

      if (result.canceled === true) {
        alert("Pas de photo sélectionnée");
      } else {
        setSelectedPicture(result.assets[0].uri);
      }
    } else {
      alert("Permission refusée");
    }
  };

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View>
      <View style={styles.avatarSection}>
        <Image style={styles.avatar} source={{ uri: selectedPicture }}></Image>
        <View style={styles.icons}>
          <Ionicons
            name="images-outline"
            size={24}
            color="black"
            onPress={() => getPermissionAndGetPicture()}
          />
          <Ionicons
            name="camera-outline"
            size={24}
            color="black"
            onPress={() => getPermissionAndTakePicture()}
          />
        </View>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.textInput}
          placeholder="Your email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          style={styles.textInput}
          placeholder="Your name"
          value={userName}
          onChangeText={(text) => setUserName(text)}
        ></TextInput>
        <TextInput
          style={styles.textInput}
          placeholder="Your description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        ></TextInput>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          try {
            setIsLoading(true);

            const tab = selectedPicture.split(".");

            const formData = new FormData();
            formData.append("photo", {
              uri: selectedPicture,
              name: `my-pic.${tab[tab.length - 1]}`,
              type: `image/${tab[tab.length - 1]}`,
            });

            await axios.put(
              `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update`,
              {
                email: email,
                description: description,
                username: userName,
              },
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            );
            await axios.put(
              `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${userToken}`,
                },
              }
            );

            setIsLoading(false);

            console.log("updated!");
          } catch (error) {
            console.log("error=", error.message);
          }
        }}
      >
        <Text>UPDATE</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          await AsyncStorage.removeItem("userToken");
          setUserToken(null);
        }}
      >
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    flexDirection: "row",
    justifyContent: "center",
  },
  avatar: {
    height: 200,
    width: 200,
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 100,
  },
  icons: {
    justifyContent: "center",
  },
  form: {},
  textInput: {
    height: 50,
    borderBottomColor: "red",
    borderBottomWidth: 1,
  },
  btn: {
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 50,
  },
});
