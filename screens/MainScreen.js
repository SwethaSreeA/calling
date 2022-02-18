import React from "react";
import { Text, View ,StatusBar} from "react-native";

import {NavigationContainer} from "@react-navigation/native";
import { createStackNavigator} from "@react-navigation/stack";
import { createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";

import { Feather as Icon } from "react-native-vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

import Chats from "./ChatScreen";
import OnetoOneConversation from "./OnetoOneConversationScreen";
import GroupConversation from "./GroupConversationScreen";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UsersScreen from "./UsersScreen";
import GroupsScreen from "./GroupsScreen";
import Call from "./CallScreen";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

export default function ChatNavigation(){
 
return(
  <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName={"Chat"}>
        <Stack.Screen
          name="Chat"
          component={MainScreen}
        />
        <Stack.Screen
          name="OnetoOneConversationScreen"
          component={OnetoOneConversation}
        />
         <Stack.Screen
          name="GroupConversationScreen"
          component={GroupConversation}
        />
        <Stack.Screen
          name="CallScreen"
          component={Call}
        />
      </Stack.Navigator>
  )
}

 function MainScreen (){
  return (
    <Tab.Navigator
    initialRouteName="chats" 
    backgroundColor={"#034840"}
    screenOptions={{
      tabBarActiveTintColor: '#e91e63',
      tabBarLabelStyle: { fontSize: 12,fontWeight:'bold',color:'white' ,marginTop:30},
      tabBarStyle: { backgroundColor: '#034840' },
    }}>
      <Tab.Screen name="chats" component={Chats} />
      <Tab.Screen name="Users" component={UsersScreen} />
      <Tab.Screen name="Groups" component={GroupsScreen} />
  </Tab.Navigator>
 
  );
};
