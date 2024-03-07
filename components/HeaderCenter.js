import { Image, StyleSheet, View } from "react-native";

const HeaderCenter = () => {
  return (
    <Image
      style={styles.headerLogo}
      source={require("../assets/logo.png")}
    ></Image>
  );
};

export default HeaderCenter;

const styles = StyleSheet.create({
  headerLogo: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
});
