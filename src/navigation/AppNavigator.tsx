import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from '@/navigation/MainTabs';
import DuringWalkScreen from "@/screens/DuringWalkScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide the header for all screens
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
         <Stack.Screen 
        name="DuringWalk" 
        component={DuringWalkScreen} 
        options={{ headerShown: true, title: "Under promenaden" }} 
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
