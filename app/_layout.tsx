import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/context/ThemeContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    const prepare = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await SplashScreen.hideAsync().catch(() => {});
    };
    prepare();
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFF' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="onboarding1" options={{ animation: 'fade' }} />
          <Stack.Screen name="onboarding2" options={{ animation: 'fade' }} />
          <Stack.Screen name="onboarding3" options={{ animation: 'fade' }} />
          <Stack.Screen name="UserDashboard" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="ProDashboard" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="ESewaPayment" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}