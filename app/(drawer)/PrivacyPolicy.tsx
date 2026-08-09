import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header3 from '../../components/Header3drawer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <Header3 />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: May 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.text}>
            CleaningSewa ("we", "us", or "our") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or use our mobile application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Data We Collect</Text>
          <Text style={styles.text}>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </Text>
          <Text style={styles.bullet}>• Identity Data: First name, last name, username or similar identifier.</Text>
          <Text style={styles.bullet}>• Contact Data: Billing address, delivery address, email address and telephone numbers.</Text>
          <Text style={styles.bullet}>• Technical Data: IP address, your login data, browser type and version, time zone setting and location.</Text>
          <Text style={styles.bullet}>• Usage Data: Information about how you use our website, products and services.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Data</Text>
          <Text style={styles.text}>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </Text>
          <Text style={styles.bullet}>• To register you as a new customer.</Text>
          <Text style={styles.bullet}>• To process and deliver your service booking.</Text>
          <Text style={styles.bullet}>• To manage our relationship with you.</Text>
          <Text style={styles.bullet}>• To improve our website, app, products/services, marketing, customer relationships and experiences.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.text}>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Legal Rights</Text>
          <Text style={styles.text}>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
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