import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Header3 from '../../components/Header3drawer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

export default function RefundPolicyScreen() {
  return (
    <View style={styles.container}>
      <Header3 />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Refund Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: May 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Overview</Text>
          <Text style={styles.text}>
            At CleaningSewa, we strive to provide the highest quality cleaning services. If you are not satisfied with our service, we offer a refund policy under specific conditions outlined below.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Cancellation & Refunds</Text>
          <Text style={styles.bullet}>• Appointments cancelled 24 hours or more in advance will receive a full refund or can be rescheduled at no extra cost.</Text>
          <Text style={styles.bullet}>• Appointments cancelled within 12-24 hours will be subject to a 20% cancellation fee.</Text>
          <Text style={styles.bullet}>• Appointments cancelled less than 12 hours before the scheduled time are non-refundable.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Satisfaction Guarantee</Text>
          <Text style={styles.text}>
            If you are unhappy with the service provided, please contact us within 24 hours of the completion of the service. We will send a team back to re-clean the specific area at no additional cost. Refunds are only considered if re-cleaning does not resolve the issue.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Refund Processing</Text>
          <Text style={styles.text}>
            Approved refunds will be processed within 7-10 business days and will be credited back to the original payment method used during booking.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions about our Refund Policy, please contact us at support@cleaningsewa.com or call us at our customer service number.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: wp('6%'),
    paddingTop: hp('3%'),
    paddingBottom: hp('5%'),
  },
  title: {
    fontSize: wp('7%'),
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: wp('3.2%'),
    color: '#6B7280',
    marginBottom: hp('3%'),
  },
  section: {
    marginBottom: hp('3%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  text: {
    fontSize: wp('3.8%'),
    color: '#4B5563',
    lineHeight: wp('5.5%'),
    textAlign: 'justify',
  },
  bullet: {
    fontSize: wp('3.8%'),
    color: '#4B5563',
    lineHeight: wp('5.5%'),
    marginBottom: 8,
    paddingLeft: 10,
  },
});