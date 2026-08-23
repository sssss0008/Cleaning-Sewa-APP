import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function Index() {
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    const prepare = async () => {
      try {
        const seen = await AsyncStorage.getItem('hasSeenOnboarding');
        if (seen === 'true') {
          // If onboarding seen, go to the main tabs inside drawer
          setRoute('/(drawer)/(tabs)');
        } else {
          // New user, go to onboarding sequence
          setRoute('/onboarding1');
        }
      } catch (error) {
        setRoute('/onboarding1');
      } finally {
        await SplashScreen.hideAsync().catch(() => {});
      }
    };
    prepare();
  }, []);

  if (!route) return null;
  return <Redirect href={route as any} />;
}