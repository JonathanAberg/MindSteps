import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/HomeScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import InfoScreen from '@/screens/InfoScreen';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Hem') {
            iconName = 'home';
          } else if (route.name === 'Historik') {
            iconName = 'history';
          } else if (route.name === 'Info') {
            iconName = 'info-circle';
          } else if (route.name === 'Inställningar') {
            iconName = 'cog';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'grey',
        tabBarInactiveTintColor: 'black',
        tabBarLabelPosition: 'below-icon',
      })}
    >
      <Tab.Screen name="Hem" component={HomeScreen} />
      <Tab.Screen name="Historik" component={HistoryScreen} />
      <Tab.Screen name="Info" component={InfoScreen} />
      <Tab.Screen name="Inställningar" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
export default MainTabs;
