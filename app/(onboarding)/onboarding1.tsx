import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingComponent from '@/components/onBoarding/onboardingComponent';

export default function OnBoarding1() {
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

      <Text style={styles.title}>Professional Cleaning</Text>

      <Text style={styles.subtitle}>
        Get professional cleaning services nearby you.
      </Text>

      <OnboardingComponent
        title="Next"
        image={require('@/assets/onBoarding/onBoarding1.jpg')}
        onPress={() => router.push('/onboarding2')} // FIXED ROUTING HERE
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  skipContainer: { position: 'absolute', right: 21, top: 55, zIndex: 10 },
  skipbutton: { fontSize: 13, fontWeight: '600', color: 'purple' },
  title: { paddingTop: 95, paddingLeft: 21, fontSize: 25, fontWeight: '800', paddingBottom: 12, color: 'green' },
  subtitle: { paddingHorizontal: 21, fontSize: 16, lineHeight: 22, color: 'green' },
});