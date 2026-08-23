import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingComponent from '../components/onBoarding/onboardingComponent';

export default function OnBoarding3() {
  const handleFinish = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/(drawer)/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.skipContainer} onPress={handleFinish}>
        <Text style={styles.skipButton}>SKIP</Text>
      </Pressable>

      <Text style={styles.title}>Direct Payment</Text>
      <Text style={styles.subtitle}>
        Commission free network where you can save upto 30% forever.
      </Text>

      <OnboardingComponent
        title="Get Started"
        image={require('../assets/onBoarding/onBoarding3.jpg')}
        onPress={handleFinish}
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