import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useTheme } from '../src/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomDrawer(_props: DrawerContentComponentProps) {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const [hasBooking, setHasBooking] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const bookings = await AsyncStorage.getItem('user_bookings');
      const proApps = await AsyncStorage.getItem('pro_applications');
      setHasBooking(!!bookings && JSON.parse(bookings).length > 0);
      setIsPro(!!proApps && JSON.parse(proApps).length > 0);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const navigateTo = (route: string) => {
    _props.navigation.closeDrawer();
    setTimeout(() => {
      router.navigate(route as any);
    }, 100);
  };

  return (
    <SafeAreaView style={styles.wrapper} edges={['top', 'bottom']}>
      <View
        style={[
          styles.card,
          { backgroundColor: isDarkMode ? (colors.card || '#1F2937') : '#FFFFFF' },
        ]}
      >
        {/* COMPACT HEADER */}
        <View style={styles.profileBox}>
          <View style={styles.logoCircle}>
            <Image source={require('../assets/images/icon.png')} style={styles.avatar} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Cleaning Sewa</Text>
            <Text style={styles.guest}>{isPro ? 'Pro Partner' : (hasBooking ? 'Customer' : 'Guest')}</Text>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeBtn}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* SCROLLABLE MENU FOR MOBILE DEVICES */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollMenu}>
          <MenuItem
            label="Home"
            icon="home-outline"
            active={pathname === '/' || pathname === '/(drawer)/(tabs)' || pathname.includes('/(tabs)/index') || pathname === '/(drawer)/(tabs)/index'}
            onPress={() => navigateTo('/(drawer)/(tabs)')}
          />
          <MenuItem
            label="Services"
            icon="construct-outline"
            active={pathname.includes('/Service')}
            onPress={() => navigateTo('/(drawer)/(tabs)/Service')}
          />

          {/* CONTACT PLACED BELOW SERVICE AS REQUESTED */}
          <MenuItem
            label="Contact & Support"
            icon="call-outline"
            active={pathname.includes('/Contact')}
            onPress={() => navigateTo('/(drawer)/(tabs)/Contact')}
          />

          <MenuItem
            label="About Us"
            icon="information-circle-outline"
            active={pathname.includes('/About')}
            onPress={() => navigateTo('/(drawer)/(tabs)/About')}
          />

          {hasBooking && (
            <MenuItem
              label="My Bookings"
              icon="calendar-outline"
              active={pathname.includes('/UserDashboard')}
              onPress={() => navigateTo('/UserDashboard')}
            />
          )}

          {isPro && (
            <MenuItem
              label="Pro Dashboard"
              icon="briefcase-outline"
              active={pathname.includes('/ProDashboard')}
              onPress={() => navigateTo('/ProDashboard')}
            />
          )}

          <MenuItem
            label="Become a Partner"
            icon="people-outline"
            active={pathname.includes('/Partnership')}
            onPress={() => navigateTo('/Partnership')}
          />
          <MenuItem
            label="Join as Professional"
            icon="ribbon-outline"
            active={pathname.includes('/Career')}
            onPress={() => navigateTo('/Career')}
          />

          <MenuItem
            label="FAQs"
            icon="help-circle-outline"
            active={pathname.includes('/FAQs')}
            onPress={() => navigateTo('/FAQs')}
          />

          <MenuItem
            label="Refund Policy"
            icon="refresh-outline"
            active={pathname.includes('/RefundPolicy')}
            onPress={() => navigateTo('/RefundPolicy')}
          />

          <MenuItem
            label="Privacy Policy"
            icon="shield-checkmark-outline"
            active={pathname.includes('/PrivacyPolicy')}
            onPress={() => navigateTo('/PrivacyPolicy')}
          />

          <MenuItem
            label="Glossary"
            icon="book-outline"
            active={pathname.includes('/Glossary')}
            onPress={() => navigateTo('/Glossary')}
          />

          {/* COMPACT ADMIN BUTTON */}
          <TouchableOpacity
            style={styles.adminBtn}
            onPress={() => navigateTo('/Admin')}
          >
            <Ionicons name="lock-closed-outline" size={16} color="#FFF" />
            <Text style={styles.adminTxt}>Admin Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const MenuItem = ({ label, icon, active, onPress }: any) => {
  const { isDarkMode } = useTheme();
  const activeBg = isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#F0FDF4';
  const activeColor = isDarkMode ? '#34D399' : '#065F46';

  return (
    <TouchableOpacity
      style={[styles.item, active && { backgroundColor: activeBg }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={icon} size={18} color={active ? activeColor : (isDarkMode ? '#9CA3AF' : '#6B7280')} />
      <Text style={[styles.label, { color: active ? activeColor : (isDarkMode ? '#F9FAFB' : '#374151'), fontWeight: active ? '700' : '500' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  card: { flex: 1, margin: 8, borderRadius: 20, elevation: 5, overflow: 'hidden' },
  profileBox: { backgroundColor: '#064E3B', paddingHorizontal: 15, paddingVertical: 18, flexDirection: 'row', alignItems: 'center' },
  logoCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatar: { width: 22, height: 22, resizeMode: 'contain' },
  profileInfo: { flex: 1 },
  name: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  guest: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 },
  themeBtn: { padding: 6, borderRadius: 15, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  scrollMenu: { padding: 10, paddingBottom: 25 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginBottom: 4 },
  label: { marginLeft: 12, fontSize: 13 },
  adminBtn: { backgroundColor: '#064E3B', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, marginTop: 12 },
  adminTxt: { color: '#FFF', fontWeight: '700', marginLeft: 6, fontSize: 13 },
});