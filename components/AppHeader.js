import * as React from "react";
import { Header, Icon } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function AppHeader () {
  return (
    <Header
      backgroundColor="#034840"
      backgroundImageStyle={{}}
      barStyle="default"
      centerComponent={{}}
      centerContainerStyle={{}}
      containerStyle={{ width: 350 }}
      leftComponent={{
        text: "WhatsApp",
        style: {
          color: "#ffff",
          fontWeight: "bold",
          fontSize: 20,
          alignSelf: "flex-start"
        }
      }}
      leftContainerStyle={{}}
      linearGradientProps={{}}
      placement="center"
      rightComponent={{}}
      rightContainerStyle={{}}
      statusBarProps={{}}
    />
  );
}