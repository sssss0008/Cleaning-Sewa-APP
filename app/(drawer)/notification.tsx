import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from '@expo/vector-icons/Ionicons';

interface NotificationProps {
  visible: boolean;
  onClose: () => void;
  onViewMore: () => void;
}

// Relative asset path from app/(drawer)/notification.tsx to root assets folder
const POPUP_IMAGE = require('../../assets/CleaningSewa-Photos/bathroom-cleaning.jpg');

export default function Notification({
  visible,
  onClose,
  onViewMore,
}: NotificationProps) {
  const [countdown, setCountdown] = useState<number>(10);
  const [showCloseBtn, setShowCloseBtn] = useState<boolean>(false);

  useEffect(() => {
    if (!visible) return;

    // Reset states when popup opens
    setCountdown(10);
    setShowCloseBtn(false);

    // 10-second countdown timer
    const timerInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setShowCloseBtn(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [visible]);

  // When countdown reaches 0 (cross icon appears), auto-close after 2 seconds
  useEffect(() => {
    if (showCloseBtn) {
      const autoCloseTimer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(autoCloseTimer);
    }
  }, [showCloseBtn, onClose]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.cardContainer}>
          {/* IMAGE SECTION */}
          <View style={styles.imageWrapper}>
            <Image
              source={POPUP_IMAGE}
              style={styles.cardImage}
              resizeMode="cover"
            />

            {/* COUNTDOWN BADGE / CROSS ICON */}
            <View style={styles.badgeContainer}>
              {!showCloseBtn ? (
                <Text style={styles.countdownText}>{countdown}</Text>
              ) : (
                <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* CONTENT SECTION */}
          <View style={styles.contentWrapper}>
            <Text style={styles.titleText}>FLAT 20% OFF DEEP CLEANING</Text>

            <Text style={styles.descriptionText}>
              Book a professional deep cleaning for monsoon home restoration before this flash price disappears — same-day slots across Kathmandu, Lalitpur & Bhaktapur.
            </Text>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.88}
              onPress={onViewMore}
            >
              <Text style={styles.actionButtonText}>VIEW MORE  →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  imageWrapper: {
    width: '100%',
    height: hp('28%'),
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: hp('1.8%'),
    right: wp('4%'),
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30, 50, 48, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  countdownText: {
    color: '#FFFFFF',
    fontSize: wp('4.5%'),
    fontWeight: '800',
  },
  contentWrapper: {
    paddingHorizontal: wp('5.5%'),
    paddingTop: hp('2.5%'),
    paddingBottom: hp('3%'),
  },
  titleText: {
    fontSize: wp('5.2%'),
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.2,
    lineHeight: wp('6.5%'),
    marginBottom: hp('1%'),
  },
  descriptionText: {
    fontSize: wp('3.6%'),
    color: '#4B5563',
    lineHeight: wp('5.2%'),
    fontWeight: '400',
    marginBottom: hp('2.5%'),
  },
  actionButton: {
    backgroundColor: '#114B43',
    borderRadius: 12,
    paddingVertical: hp('1.8%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});