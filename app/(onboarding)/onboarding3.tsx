import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingComponent from '@/components/onBoarding/onboardingComponent';

export default function OnBoarding3() {
  const handleFinish = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hassle-Free Booking</Text>

      <Text style={styles.subtitle}>
        Book, track, and relax while we transform your living space.
      </Text>

      <OnboardingComponent
        title="Get Started"
        // Uses onBoarding1.png to prevent Metro errors (Change to onBoarding3.png when added to assets)
        image={require('@/assets/onBoarding/onBoarding1.png')}
        onPress={handleFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    paddingTop: 95,
    paddingLeft: 21,
    fontSize: 25,
    fontWeight: '800',
    paddingBottom: 12,
    color: 'green',
  },
  subtitle: {
    paddingHorizontal: 21,
    fontSize: 16,
    lineHeight: 22,
    color: 'green',
  },
});