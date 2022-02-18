import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import {CometChat} from '@cometchat-pro/react-native-chat';
const Stack = createNativeStackNavigator();

const StackNavigator= () => {
    let currentScreen="Login";

CometChat.getLoggedinUser().then(
	user => {
  	if(!user){
			currentScreen="Login"
    } else{
      currentScreen="MainScreen"
    }
	}, error => {
		console.log("Something went wrong", error);
	}
);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName={currentScreen}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;