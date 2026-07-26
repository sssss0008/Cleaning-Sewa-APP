import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export interface BookingItem {
  id: number;
  name: string;
  service: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  phone: string;
  shift: string;
  location: string;
  message: string;
  budget: string;
}

const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: 1,
    name: 'Suman Shrestha',
    service: 'Deep Home Cleaning',
    date: '2026-03-25',
    status: 'Pending',
    phone: '9841234567',
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
    phone: '9801987654',
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
    phone: '9812345678',
    shift: 'Morning (8:00 AM)',
    location: 'Bhaktaur, Suryabinayak',
    message: '5000L underground water tank cleaning.',
    budget: 'Rs. 3,500',
  },
];

export default function AdminScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

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
    Alert.alert('Status Updated', `Booking #${id} is now ${newStatus}.`);
  };

  // ---------------------------------------------------------------------------
  // 1. ADMIN LOGIN VIEW WITH CLEANING SEWA LOGO
  // ---------------------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loginWrapper}>
          <View style={styles.headerBox}>
            {/* CLEANING SEWA OFFICIAL LOGO */}
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandTitle}>Cleaning Sewa</Text>
            <Text style={styles.loginTitle}>Admin Portal</Text>
            <Text style={styles.loginSub}>
              Sign in to manage CleaningSewa booking requests.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Admin Username / Email</Text>
            <TextInput
              style={styles.input}
              placeholder="admin@cleaningsewa.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => setIsLoggedIn(true)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#064E3B', '#047857']}
                style={styles.gradientBtn}
              >
                <Text style={styles.loginBtnText}>Access Admin Portal</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backHomeBtn}
              onPress={() => router.replace('/Home')}
            >
              <Text style={styles.backHomeText}>← Back to Main App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. LOGGED IN ADMIN DASHBOARD WITH LOGO IN HEADER
  // ---------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with Logo */}
      <LinearGradient colors={['#064E3B', '#122E2C']} style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.dashboardLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.adminBadge}>Admin Panel</Text>
              <Text style={styles.headerTitle}>Cleaning Sewa</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setIsLoggedIn(false)}
          >
            <Ionicons name="log-out-outline" size={18} color="#FFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, service, or phone..."
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
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                selectedFilter === tab && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(tab)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedFilter === tab && styles.filterTabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
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
            <Text style={styles.emptyText}>No bookings found</Text>
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
              <Text style={styles.budgetText}>{item.budget}</Text>
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
                <DetailRow label="Phone Number" value={selectedBooking.phone} />
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

  /* LOGIN VIEW */
  loginWrapper: { flex: 1, justifyContent: 'center', paddingHorizontal: wp('5.5%') },
  headerBox: { marginBottom: hp('2.5%'), alignItems: 'center' },
  logoImage: {
    width: wp('22%'),
    height: wp('22%'),
    marginBottom: hp('1%'),
  },
  brandTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '800',
    color: '#0D9488',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loginTitle: { fontSize: wp('7%'), fontWeight: '800', color: '#064E3B', marginTop: hp('0.2%') },
  loginSub: { fontSize: wp('3.5%'), color: '#295C59', marginTop: hp('0.5%'), textAlign: 'center' },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: wp('5%'), elevation: 3 },
  label: { fontSize: wp('3.4%'), fontWeight: '700', color: '#374151', marginBottom: hp('0.8%'), marginTop: hp('1.5%') },
  input: { backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: wp('4%'), paddingVertical: hp('1.4%'), fontSize: wp('3.8%'), color: '#1F2937', borderWidth: 1, borderColor: '#E5E7EB' },
  loginBtn: { marginTop: hp('3%'), borderRadius: 10, overflow: 'hidden' },
  gradientBtn: { paddingVertical: hp('1.8%'), alignItems: 'center' },
  loginBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: wp('4%') },
  backHomeBtn: { marginTop: hp('2%'), alignItems: 'center' },
  backHomeText: { color: '#295C59', fontWeight: '600', fontSize: wp('3.5%') },

  /* DASHBOARD HEADER WITH LOGO */
  header: { paddingTop: hp('6%'), paddingBottom: hp('2%'), paddingHorizontal: wp('5%') },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('1.5%') },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  dashboardLogo: { width: wp('10%'), height: wp('10%'), marginRight: wp('3%') },
  adminBadge: { color: '#A7F3D0', fontSize: wp('2.8%'), fontWeight: '700', textTransform: 'uppercase' },
  headerTitle: { fontSize: wp('5%'), fontWeight: '800', color: '#FFFFFF' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: wp('3%'), paddingVertical: hp('0.8%'), borderRadius: 8 },
  logoutText: { color: '#FFF', fontWeight: '700', fontSize: wp('3%'), marginLeft: wp('1%') },

  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: wp('3.5%'), paddingVertical: hp('1%') },
  searchInput: { flex: 1, marginLeft: wp('2%'), fontSize: wp('3.6%'), color: '#1F2937' },

  /* FILTER TABS */
  filterContainer: { paddingVertical: hp('1.5%'), paddingHorizontal: wp('4%'), backgroundColor: '#FFFFFF' },
  filterTab: { paddingHorizontal: wp('4%'), paddingVertical: hp('0.8%'), borderRadius: 20, backgroundColor: '#F3F4F6', marginRight: wp('2%') },
  filterTabActive: { backgroundColor: '#064E3B' },
  filterTabText: { fontSize: wp('3.2%'), fontWeight: '600', color: '#4B5563' },
  filterTabTextActive: { color: '#FFFFFF', fontWeight: '700' },

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
  budgetText: { fontSize: wp('3.5%'), fontWeight: '800', color: '#064E3B' },

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