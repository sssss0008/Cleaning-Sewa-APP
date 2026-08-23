import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header3 from '../../components/Header3drawer';
import { useTheme } from '../../src/context/ThemeContext';

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header3 />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: '#064E3B' }]}>Privacy Policy</Text>
        <Text style={[styles.date, { color: colors.subText }]}>Last Updated: June 2026</Text>

        <View style={styles.section}>
          <Text style={[styles.secTitle, { color: colors.text }]}>1. Information Collection</Text>
          <Text style={[styles.text, { color: colors.subText }]}>
            We collect personal information such as name, phone number, and location only when you book a service or apply as a professional.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.secTitle, { color: colors.text }]}>2. How We Use Data</Text>
          <Text style={[styles.text, { color: colors.subText }]}>
            Your data is used to facilitate cleaning services, process simulated eSewa payments, and improve your user experience.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.secTitle, { color: colors.text }]}>3. Data Security</Text>
          <Text style={[styles.text, { color: colors.subText }]}>
            All sensitive information, including booking history, is stored securely on your local device and is not shared with unauthorized third parties.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25 },
  title: { fontSize: 28, fontWeight: '800' },
  date: { fontSize: 12, marginBottom: 30, marginTop: 5 },
  section: { marginBottom: 25 },
  secTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  text: { fontSize: 15, lineHeight: 22 }
});