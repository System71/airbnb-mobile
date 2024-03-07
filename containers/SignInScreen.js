import { useNavigation } from "@react-navigation/core";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";

export default function SignInScreen({ setToken, setID }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHide, setPasswordHide] = useState(true);

  const navigation = useNavigation();

  return (
    <View style={styles.main}>
      <View style={styles.logoSection}>
        <Image
          style={styles.logoImg}
          source={require("../assets/logo.png")}
        ></Image>
        <Text style={styles.title}>Sign in</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.container}>
          <View>
            <TextInput
              style={styles.input}
              placeholder="email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.input2}
              placeholder="password"
              secureTextEntry={passwordHide}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            {passwordHide ? (
              <FontAwesome
                style={styles.eyes}
                name="eye"
                size={24}
                color="black"
                onPress={() => setPasswordHide(!passwordHide)}
              />
            ) : (
              <FontAwesome
                style={styles.eyes}
                name="eye-slash"
                size={24}
                color="black"
                onPress={() => setPasswordHide(!passwordHide)}
              />
            )}
          </View>
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btn}
            onPress={async () => {
              const response = await axios.post(
                "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
                { email: email, password: password }
              );
              console.log("response", response.data);

              setToken(response.data.token);
              setID(response.data.id);
            }}
          >
            <Text style={styles.btnText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text>No account ? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
  },
  logoSection: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    gap: 30,
  },
  logoImg: {
    resizeMode: "contain",
    height: 80,
    width: 80,
  },
  title: {
    fontSize: 22,
  },
  form: {
    width: "85%",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 20,
    flex: 1,
  },
  container: {
    gap: 30,
  },
  input: {
    width: "100%",
    height: 28,
    borderBottomColor: "#EB5A62",
    borderBottomWidth: 1,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    flexShrink: 1,
  },
  input2: {
    height: 28,
    flexGrow: 1,
    borderBottomColor: "#EB5A62",
    borderBottomWidth: 1,
  },
  eyes: {
    borderBottomColor: "#EB5A62",
    borderBottomWidth: 1,
  },
  btnContainer: {
    alignItems: "center",
  },
  btn: {
    borderColor: "#EB5A62",
    borderWidth: 2,
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 60,
    marginBottom: 10,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#747474",
  },
});
