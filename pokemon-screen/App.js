import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LockScreen from './src/screens/LockScreen';
import HomeScreen from './src/screens/HomeScreen';
import CryScreen from './src/screens/CryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            orientation: 'portrait',
            contentStyle: { backgroundColor: '#0f172a' }
          }}
        >
          <Stack.Screen name="Lock" component={LockScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Cry" component={CryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
