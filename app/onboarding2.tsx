import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingComponent from '../components/onBoarding/onboardingComponent';

export default function OnBoarding2() {
  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/(drawer)/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.skipContainer} onPress={handleSkip}>
        <Text style={styles.skipButton}>SKIP</Text>
      </Pressable>

      <Text style={styles.title}>Trained Professional</Text>
      <Text style={styles.subtitle}>
        Get your task done by skilled and trained professional.
      </Text>

      <OnboardingComponent
        title="Next"
        image={require('../assets/onBoarding/onBoarding2.jpg')}
        onPress={() => router.push('/onboarding3')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
  },
  skipContainer: {
    position: 'absolute',
    right: 21,
    top: 55,
    zIndex: 10,
    padding: 8,
  },
  skipButton: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  title: {
    paddingTop: 40,
    paddingHorizontal: 21,
    fontSize: 26,
    fontWeight: '800',
    paddingBottom: 8,
    color: '#166534',
  },
  subtitle: {
    paddingHorizontal: 21,
    fontSize: 16,
    lineHeight: 22,
    color: '#4B5563',
  },
});