import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StatusBar,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// ── SHARED GLOBAL HEADER IMPORT ────────────────────────────────────
import Header2 from '@/components/Header2';

export interface BookingItem {
  id: number;
  name: string;
  service: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  phone: string; // Strictly 10 digits
  shift: string;
  location: string;
  message: string;
  budget: string;
}

// Helper: Restricts phone numbers strictly to 10 numeric digits
const sanitizePhone10Digit = (phoneStr: string) => {
  return phoneStr.replace(/[^0-9]/g, '').slice(0, 10);
};

const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: 1,
    name: 'Suman Shrestha',
    service: 'Deep Home Cleaning',
    date: '2026-03-25',
    status: 'Pending',
    phone: sanitizePhone10Digit('9841234567'),
    shift: 'Morning (9:00 AM)',
    location: 'Baneshwor, Kathmandu',
    message: 'Need full deep cleaning including kitchen degreasing.',
    budget: 'Rs. 5,000',
  },
  {
    id: 2,
    name: 'Aarati Sharma',
    service: 'Sofa & Carpet Cleaning',
    date: '2026-03-26',
    status: 'Confirmed',
    phone: sanitizePhone10Digit('9801987654'),
    shift: 'Afternoon (2:00 PM)',
    location: 'Lalitpur, Patan',
    message: '3-seater sofa and 1 large living room carpet.',
    budget: 'Rs. 2,500',
  },
  {
    id: 3,
    name: 'Rohan Thapa',
    service: 'Water Tank Cleaning',
    date: '2026-03-24',
    status: 'Completed',
    phone: sanitizePhone10Digit('9812345678'),
    shift: 'Morning (8:00 AM)',
    location: 'Bhaktapur, Suryabinayak',
    message: '5000L underground water tank cleaning.',
    budget: 'Rs. 3,500',
  },
];

export default function AdminScreen() {
  // Auth & 2-Step Login States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPinStep, setShowPinStep] = useState(false);

  // 4-Digit Security PIN States & Focus Refs
  const [pin, setPin] = useState(['', '', '', '']);
  const pinInputRefs = [
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null),
  ];

  // Dashboard Management States
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

  // Step 1: Check Username & Password
  const handleVerifyCredentials = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter Admin Username/Email and Password.');
      return;
    }
    setShowPinStep(true);
    setTimeout(() => {
      pinInputRefs[0].current?.focus();
    }, 150);
  };

  // Step 2: Auto-focus movement between PIN boxes
  const handlePinChange = (text: string, index: number) => {
    const cleanDigit = text.replace(/[^0-9]/g, '');
    const newPin = [...pin];
    newPin[index] = cleanDigit;
    setPin(newPin);

    if (cleanDigit && index < 3) {
      pinInputRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      pinInputRefs[index - 1].current?.focus();
    }
  };

  // Step 3: Complete Sign-In
  const handleFinalSignIn = () => {
    const fullPin = pin.join('');
    if (fullPin.length < 4) {
      Alert.alert('Incomplete PIN', 'Please enter the complete 4-digit security passcode.');
      return;
    }
    setIsLoggedIn(true);
  };

  // Logout Handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowPinStep(false);
    setEmail('');
    setPassword('');
    setPin(['', '', '', '']);
  };

  // Search & Filter Logic
  const filteredBookings = bookings.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery);

    const matchesStatus =
      selectedFilter === 'All' ? true : item.status === selectedFilter;

    return matchesSearch && matchesStatus;
  });

  const updateBookingStatus = (id: number, newStatus: BookingItem['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
    Alert.alert('Status Updated', `Booking #${id} status changed to ${newStatus}.`);
  };

  // Helper function to count bookings for each tab
  const getTabCount = (tabName: string) => {
    if (tabName === 'All') return bookings.length;
    return bookings.filter((b) => b.status === tabName).length;
  };

  // ---------------------------------------------------------------------------
  // 1. ADMIN LOGIN VIEW
  // ---------------------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

        {/* ── GLOBAL APP HEADER ─────────────────────────────── */}
        <Header2 />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.loginScrollContent}
        >
          {/* BRAND HEADER */}
          <View style={styles.headerBox}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandTitle}>Cleaning Sewa</Text>
            <Text style={styles.loginTitle}>Admin</Text>
            <Text style={styles.loginSub}>
              Enter admin credentials and 4-digit security PIN to access management controls.
            </Text>
          </View>

          {/* STEP 1: CREDENTIALS FORM */}
          <View style={styles.formCard}>
            <Text style={styles.label}>Admin Username / Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#064E3B" style={styles.fieldIcon} />
              <TextInput
                style={styles.inputField}
                placeholder="admin@cleaningsewa.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="key-outline" size={18} color="#064E3B" style={styles.fieldIcon} />
              <TextInput
                style={styles.inputField}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {!showPinStep && (
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={handleVerifyCredentials}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={['#064E3B', '#047857']}
                  style={styles.gradientBtn}
                >
                  <Text style={styles.loginBtnText}>Verify Credentials →</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* STEP 2: 4-DIGIT SECURITY PIN BOX */}
          {showPinStep && (
            <View style={styles.pinCard}>
              <Text style={styles.pinTitle}>Security Passcode</Text>
              <Text style={styles.pinSub}>Enter your 4-digit admin PIN below:</Text>

              <View style={styles.pinRow}>
                {pin.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={pinInputRefs[index]}
                    style={[
                      styles.pinInputBox,
                      digit !== '' && styles.pinInputBoxActive,
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handlePinChange(text, index)}
                    onKeyPress={(e) => handlePinKeyPress(e, index)}
                    selectTextOnFocus
                  />
                ))}
              </View>

              <TouchableOpacity
                style={styles.loginBtn}
                onPress={handleFinalSignIn}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={['#064E3B', '#047857']}
                  style={styles.gradientBtn}
                >
                  <Text style={styles.loginBtnText}>Sign In to Dashboard</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.joinNowLink}
            onPress={() => router.push('/(drawer)/Career')}
          >
            <Text style={styles.joinNowText}>
              Don't have an account? <Text style={styles.joinNowBold}>Join Now</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backHomeBtn}
            onPress={() => router.replace('/(drawer)/(tabs)/Home')}
          >
            <Text style={styles.backHomeText}>← Return to CleaningSewa Main App</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. LOGGED IN ADMIN DASHBOARD VIEW
  // ---------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      {/* ── GLOBAL APP HEADER ─────────────────────────────── */}
      <Header2 />

      {/* ── ADMIN DASHBOARD SUB-HEADER ───────────────────── */}
      <View style={styles.adminDashboardHeader}>
        <View style={styles.adminTitleRow}>
          <View style={styles.adminTitleLeft}>
            <Ionicons name="shield-checkmark" size={20} color="#064E3B" />
            <Text style={styles.adminControlTitle}>Admin Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.logoutPill} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={15} color="#DC2626" />
            <Text style={styles.logoutPillText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name, service, or 10-digit phone..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* ── NAVIGATION FILTER TABS BELOW HEADER ──────────── */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((tab) => {
            const isActive = selectedFilter === tab;
            const count = getTabCount(tab);
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setSelectedFilter(tab)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                  {tab}
                </Text>
                <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No bookings found under "{selectedFilter}"</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bookingCard}
            activeOpacity={0.85}
            onPress={() => setSelectedBooking(item)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.customerName}>{item.name}</Text>
              <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.serviceTitle}>{item.service}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>📅 {item.date}</Text>
              <Text style={styles.infoText}>🕒 {item.shift}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>📍 {item.location}</Text>
              <Text style={styles.infoText}>📞 {sanitizePhone10Digit(item.phone)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Detail Modal */}
      {selectedBooking && (
        <Modal animationType="slide" transparent visible={!!selectedBooking}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Booking Details #{selectedBooking.id}
                </Text>
                <TouchableOpacity onPress={() => setSelectedBooking(null)}>
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <DetailRow label="Customer Name" value={selectedBooking.name} />
                <DetailRow label="10-Digit Phone" value={sanitizePhone10Digit(selectedBooking.phone)} />
                <DetailRow label="Service Required" value={selectedBooking.service} />
                <DetailRow label="Date & Shift" value={`${selectedBooking.date} (${selectedBooking.shift})`} />
                <DetailRow label="Location" value={selectedBooking.location} />
                <DetailRow label="Estimated Budget" value={selectedBooking.budget} />
                <DetailRow label="Message / Instructions" value={selectedBooking.message} />

                <Text style={styles.actionHeader}>Update Booking Status:</Text>
                <View style={styles.statusActionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#FEF3C7' }]}
                    onPress={() => updateBookingStatus(selectedBooking.id, 'Pending')}
                  >
                    <Text style={[styles.actionBtnText, { color: '#D97706' }]}>Pending</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#E0F2F1' }]}
                    onPress={() => updateBookingStatus(selectedBooking.id, 'Confirmed')}
                  >
                    <Text style={[styles.actionBtnText, { color: '#059669' }]}>Confirm</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#DCFCE7' }]}
                    onPress={() => updateBookingStatus(selectedBooking.id, 'Completed')}
                  >
                    <Text style={[styles.actionBtnText, { color: '#16A34A' }]}>Complete</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function getStatusStyle(status: BookingItem['status']) {
  switch (status) {
    case 'Confirmed':
      return { backgroundColor: '#E0F2F1' };
    case 'Completed':
      return { backgroundColor: '#DCFCE7' };
    case 'Cancelled':
      return { backgroundColor: '#FEE2E2' };
    default:
      return { backgroundColor: '#FEF3C7' };
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F9F8' },

  /* LOGIN SCROLL CONTENT */
  loginScrollContent: {
    paddingHorizontal: wp('5.5%'),
    paddingBottom: hp('4%'),
    paddingTop: hp('2%'),
  },
  headerBox: { marginBottom: hp('2%'), alignItems: 'center' },
  logoImage: {
    width: wp('20%'),
    height: wp('20%'),
    marginBottom: hp('0.8%'),
  },
  brandTitle: {
    fontSize: wp('4.2%'),
    fontWeight: '800',
    color: '#0D9488',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loginTitle: { fontSize: wp('6.5%'), fontWeight: '800', color: '#064E3B', marginTop: hp('0.2%') },
  loginSub: { fontSize: wp('3.4%'), color: '#295C59', marginTop: hp('0.5%'), textAlign: 'center', paddingHorizontal: wp('3%') },

  /* CREDENTIALS FORM CARD */
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: wp('5%'), elevation: 3 },
  label: { fontSize: wp('3.4%'), fontWeight: '700', color: '#374151', marginBottom: hp('0.6%'), marginTop: hp('1%') },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: wp('3.5%'),
    height: hp('5.8%'),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fieldIcon: {
    marginRight: wp('2.5%'),
  },
  inputField: {
    flex: 1,
    fontSize: wp('3.8%'),
    color: '#1F2937',
  },
  loginBtn: { marginTop: hp('2.5%'), borderRadius: 10, overflow: 'hidden' },
  gradientBtn: { paddingVertical: hp('1.8%'), alignItems: 'center' },
  loginBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: wp('4%') },

  /* 4-DIGIT PIN CARD */
  pinCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: wp('5%'),
    marginTop: hp('2%'),
    alignItems: 'center',
    elevation: 3,
  },
  pinTitle: {
    fontSize: wp('4.4%'),
    fontWeight: '800',
    color: '#064E3B',
  },
  pinSub: {
    fontSize: wp('3.2%'),
    color: '#6B7280',
    marginTop: hp('0.4%'),
    marginBottom: hp('1.8%'),
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: hp('0.5%'),
  },
  pinInputBox: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    textAlign: 'center',
    fontSize: wp('5%'),
    fontWeight: '800',
    color: '#064E3B',
  },
  pinInputBoxActive: {
    borderColor: '#064E3B',
    backgroundColor: '#E6F4F1',
  },

  backHomeBtn: { marginTop: hp('2%'), alignItems: 'center' },
  backHomeText: { color: '#295C59', fontWeight: '600', fontSize: wp('3.5%') },

  joinNowLink: {
    marginTop: hp('3%'),
    alignItems: 'center',
  },
  joinNowText: {
    fontSize: wp('3.5%'),
    color: '#4B5563',
  },
  joinNowBold: {
    color: '#064E3B',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  /* ADMIN DASHBOARD HEADER */
  adminDashboardHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp('4.5%'),
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1.2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  adminTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.2%'),
  },
  adminTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adminControlTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '800',
    color: '#064E3B',
  },
  logoutPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: wp('2.8%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 20,
    gap: 4,
  },
  logoutPillText: {
    fontSize: wp('2.8%'),
    fontWeight: '700',
    color: '#DC2626',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: wp('3%'),
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: wp('2%'),
    fontSize: wp('3.4%'),
    color: '#1F2937',
  },

  /* FILTER TABS BELOW HEADER */
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('3.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.8%'),
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: wp('2%'),
  },
  tabChipActive: {
    backgroundColor: '#064E3B',
  },
  tabChipText: {
    fontSize: wp('3.2%'),
    fontWeight: '700',
    color: '#4B5563',
  },
  tabChipTextActive: {
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  tabBadgeActive: {
    backgroundColor: '#047857',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#374151',
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },

  /* CARDS LIST */
  listContent: { padding: wp('4.5%') },
  bookingCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: wp('4%'), marginBottom: hp('1.5%'), elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  customerName: { fontSize: wp('4.2%'), fontWeight: '800', color: '#064E3B' },
  statusBadge: { paddingHorizontal: wp('2.5%'), paddingVertical: hp('0.4%'), borderRadius: 6 },
  statusText: { fontSize: wp('2.8%'), fontWeight: '800', color: '#064E3B' },
  serviceTitle: { fontSize: wp('3.6%'), fontWeight: '700', color: '#295C59', marginTop: hp('0.5%') },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('0.8%') },
  infoText: { fontSize: wp('3.2%'), color: '#6B7280' },

  emptyBox: { alignItems: 'center', marginTop: hp('8%') },
  emptyText: { color: '#9CA3AF', marginTop: hp('1%'), fontSize: wp('3.8%') },

  /* MODAL */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: wp('5%'), maxHeight: hp('80%') },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('2%') },
  modalTitle: { fontSize: wp('4.8%'), fontWeight: '800', color: '#064E3B' },
  detailRow: { marginBottom: hp('1.2%') },
  detailLabel: { fontSize: wp('3%'), color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' },
  detailValue: { fontSize: wp('3.8%'), color: '#1F2937', fontWeight: '700', marginTop: hp('0.2%') },
  actionHeader: { fontSize: wp('3.8%'), fontWeight: '800', color: '#064E3B', marginTop: hp('2%'), marginBottom: hp('1%') },
  statusActionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('0.5%') },
  actionBtn: { flex: 1, paddingVertical: hp('1.2%'), borderRadius: 8, alignItems: 'center', marginHorizontal: wp('1%') },
  actionBtnText: { fontWeight: '800', fontSize: wp('3.2%') },
}); 
