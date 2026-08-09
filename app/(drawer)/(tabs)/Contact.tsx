import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
  ScrollView,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Email from '../../../assets/icons/contact/email_1.png';
import Location from '../../../assets/icons/contact/location-pin.png';
import Website from '../../../assets/icons/contact/globe.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header2 from '../../../components/Header2';
import { Ionicons } from '@expo/vector-icons';
import { feedbackService } from '../../../src/services/feedbackService';

const ICON_SIZE = hp('3.3%');
const MAP_URL = 'https://maps.app.goo.gl/A8qYWT5xucEgkEd69';

export default function ContactScreen() {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openWebsite = useCallback(() => {
    Linking.openURL('https://CleaningSewa.com');
  }, []);

  const handleEmailPress = useCallback(() => {
    Linking.openURL('mailto:mail@CleaningSewa.com');
  }, []);

  const handleMapPress = useCallback(() => {
    Linking.openURL(MAP_URL);
  }, []);

  const handleSendFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert('Empty Message', 'Please enter your feedback before sending.');
      return;
    }

    setIsSubmitting(true);

    const result = await feedbackService.submitFeedback(feedback);

    setIsSubmitting(false);

    if (result.success) {
      Alert.alert('Thank You!', 'Your feedback has been received. We appreciate your input.');
      setFeedback('');
    } else {
      Alert.alert('Error', result.error || 'Failed to send feedback.');
    }
  };

  return (
    <View style={styles.screen}>
      <Header2 />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>We're always here to help you out.</Text>

          {/* MAP */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleMapPress}
            style={styles.imageContainer}
          >
            <Image
              source={require('../../../assets/home/sriyogmap.png')}
              style={styles.mapImage}
              resizeMode="cover"
            />
            <View style={styles.mapBadge}>
              <Text style={styles.mapBadgeText}>Tap to Open Map</Text>
            </View>
          </TouchableOpacity>

          {/* COMPANY */}
          <Text style={styles.companyName}>CleaningSewa </Text>
          <Text style={styles.companySubtitle}>
             Professional Cleaning Services in Nepal
          </Text>

          {/* CARDS */}
          <View style={styles.gridBox}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleMapPress}
              style={styles.card}
            >
              <View style={styles.iconContainer}>
                <Image source={Location} style={styles.icon} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Visit us</Text>
                <Text style={styles.cardSubtitle} numberOfLines={2}>
                  Rem.Work, Kamalpokhari, Kathmandu, Nepal
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleEmailPress}
              style={styles.card}
            >
              <View style={styles.iconContainer}>
                <Image source={Email} style={styles.icon} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Email us</Text>
                <Text style={[styles.cardSubtitle, styles.linkText]}>
                  CleaningSewa@sriyog.com
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={openWebsite}
              style={styles.card}
            >
              <View style={styles.iconContainer}>
                <Image source={Website} style={styles.icon} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Website</Text>
                <Text style={[styles.cardSubtitle, styles.linkText]}>
                  https://CleaningSewa.com
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* FEEDBACK FORM (SUG_005) */}
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>Send Us Feedback</Text>
            <Text style={styles.feedbackSubtitle}>Tell us about your experience or report an issue.</Text>

            <TextInput
              style={styles.feedbackInput}
              multiline
              numberOfLines={4}
              placeholder="How can we improve?"
              placeholderTextColor="#9CA3AF"
              value={feedback}
              onChangeText={setFeedback}
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendFeedback}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.sendButtonText}>Send Feedback</Text>
                  <Ionicons name="send" size={16} color="#FFF" style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2.5%'),
    paddingBottom: hp('4%'),
  },
  title: {
    fontSize: wp('6.5%'),
    fontWeight: '700',
    color: '#064E3B',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: wp('3.8%'),
    color: '#64748B',
    marginTop: 4,
    marginBottom: hp('2.5%'),
  },
  imageContainer: {
    width: '100%',
    height: hp('22%'),
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(6, 78, 59, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  mapBadgeText: {
    color: '#FFF',
    fontSize: wp('3%'),
    fontWeight: '600',
  },
  companyName: {
    fontSize: wp('5%'),
    fontWeight: '700',
    marginTop: hp('3%'),
    color: '#064E3B',
  },
  companySubtitle: {
    fontSize: wp('3.6%'),
    color: '#475569',
    marginTop: 2,
    marginBottom: hp('3%'),
  },
  gridBox: {
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('1.5%'),
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    width: hp('5%'),
    height: hp('5%'),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('4%'),
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    resizeMode: 'contain',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: wp('3.2%'),
    color: '#64748B',
    lineHeight: wp('4.2%'),
  },
  linkText: {
    color: '#064E3B',
  },
  feedbackSection: {
    marginTop: hp('3%'),
    backgroundColor: '#FFF',
    padding: wp('5%'),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
  },
  feedbackTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#064E3B',
    marginBottom: 4,
  },
  feedbackSubtitle: {
    fontSize: wp('3.2%'),
    color: '#64748B',
    marginBottom: hp('2%'),
  },
  feedbackInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    height: hp('15%'),
    textAlignVertical: 'top',
    fontSize: wp('3.8%'),
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: hp('2%'),
  },
  sendButton: {
    backgroundColor: '#064E3B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.5%'),
    borderRadius: 12,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: wp('3.8%'),
    fontWeight: '600',
  },
});