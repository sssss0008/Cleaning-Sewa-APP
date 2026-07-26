import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingComponent from '@/components/onBoarding/onboardingComponent';

export default function OnBoarding2() {
  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/Home');
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <Pressable style={styles.skipContainer} onPress={handleSkip}>
        <Text style={styles.skipbutton}>SKIP</Text>
      </Pressable>

      <Text style={styles.title}>Quality Services & Care</Text>

      <Text style={styles.subtitle}>
        Professional technicians & cleaners ready to serve your household needs.
      </Text>

      <OnboardingComponent
        title="Next"
        // Uses onBoarding1.png to prevent Metro errors (Change to onBoarding2.png when added to assets)
        image={require('@/assets/onBoarding/onBoarding1.png')}
        onPress={() => router.push('/onboarding3')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  skipContainer: {
    position: 'absolute',
    right: 21,
    top: 55,
    zIndex: 10,
  },
  skipbutton: {
    fontSize: 13,
    fontWeight: '600',
    color: 'purple',
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