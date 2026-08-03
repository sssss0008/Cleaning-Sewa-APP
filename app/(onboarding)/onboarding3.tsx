import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
      {/* Skip Button */}
      <Pressable style={styles.skipContainer} onPress={handleFinish}>
        <Text style={styles.skipbutton}>SKIP</Text>
      </Pressable>

      <Text style={styles.title}>Direct Payment</Text>

      <Text style={styles.subtitle}>
        Commission free network where you can save upto 30% forever.
      </Text>

      {/* Wide Wrapper Container */}
      <View style={styles.onboardingWrapper}>
        <OnboardingComponent
          title="Get Started"
          image={require('@/assets/onBoarding/onBoarding3.jpg')}
          onPress={handleFinish}
          buttonStyle={styles.wideButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  skipContainer: {
    position: 'absolute',
    right: 21,
    top: 55,
    zIndex: 10
  },
  skipbutton: {
    fontSize: 13,
    fontWeight: '600',
    color: 'purple'
  },
  title: {
    paddingTop: 95,
    paddingLeft: 21,
    fontSize: 25,
    fontWeight: '800',
    paddingBottom: 12,
    color: 'green'
  },
  subtitle: {
    paddingHorizontal: 21,
    fontSize: 16,
    lineHeight: 22,
    color: 'green'
  },

  /* Expanded Button Styling */
  onboardingWrapper: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  wideButton: {
    width: '92%',
    alignSelf: 'center',
  },
});