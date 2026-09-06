import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header2 from '../../components/Header2';
import { useTheme } from '../../src/context/ThemeContext';

export default function RefundPolicyScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header2 title="Refund Policy" showBack={true} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: '#064E3B' }]}>Refund Policy</Text>
        <Text style={[styles.date, { color: colors.subText }]}>Effective: June 14, 2026</Text>

        <View style={styles.section}>
          <Text style={[styles.secTitle, { color: colors.text }]}>1. Cancellation Eligibility</Text>
          <Text style={[styles.text, { color: colors.subText }]}>
            Users can cancel a booking up to 24 hours before the scheduled service time for a full refund of any prepaid amounts.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.secTitle, { color: colors.text }]}>2. Refund Process</Text>
          <Text style={[styles.text, { color: colors.subText }]}>
            Once approved, refunds for payments made via eSewa will be processed back to the original source within 7-10 business days.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.secTitle, { color: colors.text }]}>3. Quality Disputes</Text>
          <Text style={[styles.text, { color: colors.subText }]}>
            If you are unsatisfied with a service, please contact support within 4 hours. We will offer a re-clean or partial refund based on the inspection.
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