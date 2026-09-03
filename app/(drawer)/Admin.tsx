import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/context/ThemeContext';
import Header2 from '../../components/Header2';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function AdminScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useTheme();
  const [auth, setAuth] = useState({ logged: false, phone: '98520 243 65', pin: ['', '', '', ''] });
  const [showPin, setShowPin] = useState(false);

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    if (cleaned.length <= 5) return cleaned;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  };

  // Dashboard Data
  const [bookings, setBookings] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeTab, setActiveTab] = useState<'bookings' | 'pros'>('bookings');

  const [editModal, setEditModal] = useState<{ visible: boolean; data: any; type: 'booking' | 'pro' | '' }>({ visible: false, data: null, type: '' });

  const pinRefs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  useEffect(() => {
    if (auth.logged) loadAllData();
  }, [auth.logged]);

  const loadAllData = async () => {
    try {
      const bData = await AsyncStorage.getItem('user_bookings');
      const pData = await AsyncStorage.getItem('pro_applications');

      if (bData) {
        const parsed = JSON.parse(bData);
        setBookings(parsed);
        const revenue = parsed.reduce((acc: number, curr: any) => acc + parseInt(curr.price || 0), 0);
        setTotalRevenue(revenue);
      }
      if (pData) setProfessionals(JSON.parse(pData));
    } catch (e) { console.error(e); }
  };

  const handleLogin = () => {
    const enteredPin = auth.pin.join('');
    const rawPhone = auth.phone.replace(/\s/g, '');
    if (rawPhone === '9852024365' && enteredPin === '1234') {
      setAuth({ ...auth, logged: true });
    } else {
      Alert.alert('Access Denied', 'Invalid Phone or PIN');
    }
  };

  const updateStatus = async (id: string, newStatus: string, type: 'booking' | 'pro') => {
    try {
      if (type === 'booking') {
        const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
        setBookings(updated);
        await AsyncStorage.setItem('user_bookings', JSON.stringify(updated));
      } else {
        const updated = professionals.map(p => p.id === id ? { ...p, verification: newStatus } : p);
        setProfessionals(updated);
        await AsyncStorage.setItem('pro_applications', JSON.stringify(updated));
      }
      setEditModal({ visible: false, data: null, type: '' });
      Alert.alert('System Updated', `${type === 'booking' ? 'Booking' : 'Professional'} status changed to ${newStatus}`);
    } catch (e) { console.error(e); }
  };

  const resetAppForTesting = async () => {
     await AsyncStorage.clear();
     Alert.alert('System Reset', 'All user and pro data wiped. App will restart.');
     router.replace('/onboarding1');
  };

  // --- LOGIN UI ---
  if (!auth.logged) {
    return (
      <View style={styles.loginContainer}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.topSection, { paddingTop: insets.top }]}>
          <View style={styles.fakeHeader}>
             <Image source={require('../../assets/images/icon.png')} style={styles.headerLogo} />
             <Text style={styles.headerTitle}>Cleaning Sewa</Text>
             <View style={styles.headerIcons}>
                <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
                <TouchableOpacity
                  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                  <Ionicons name="menu" size={28} color="#FFF" style={{ marginLeft: 15 }} />
                </TouchableOpacity>
             </View>
          </View>
          <View style={styles.heroCenter}>
             <View style={styles.lockCircle}><Ionicons name="lock-closed" size={40} color="#FBBF24" /></View>
             <Text style={styles.heroBrand}>Cleaning Sewa</Text>
             <Text style={styles.heroTag}>ADMIN LOGIN</Text>
          </View>
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.formContainer}>
          <ScrollView contentContainerStyle={styles.formScroll} bounces={false}>
            <View style={styles.whiteCard}>
              <Text style={styles.signInTitle}>Sign In</Text>
              <View style={styles.phoneInputBox}>
                <Text style={styles.flag}>🇳🇵</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="98414 281 33"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={auth.phone}
                  maxLength={12}
                  onChangeText={v => {
                    const formatted = formatPhone(v);
                    setAuth({...auth, phone: formatted});
                    if (formatted.replace(/\s/g, '').length === 10) {
                      pinRefs[0].current?.focus();
                    }
                  }}
                />
              </View>
              <View style={styles.pinLabelRow}>
                 <Text style={styles.pinLabel}>PIN</Text>
                 <TouchableOpacity onPress={() => setShowPin(!showPin)}><Ionicons name={showPin ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" /></TouchableOpacity>
              </View>
              <View style={styles.pinGrid}>
                {auth.pin.map((d, i) => (
                  <TextInput key={i} ref={pinRefs[i]} style={styles.pinInput} maxLength={1} keyboardType="number-pad" secureTextEntry={!showPin} value={d}
                    onChangeText={v => {
                      const newP = [...auth.pin]; newP[i] = v; setAuth({...auth, pin: newP});
                      if (v && i < 3) pinRefs[i+1].current?.focus();
                    }}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}><Text style={styles.loginBtnText}>Login</Text></TouchableOpacity>
              <View style={styles.divider} />
              <View style={styles.footerLinks}>
                 <Text style={styles.joinText}>Manage as Master Admin</Text>
                 <TouchableOpacity onPress={() => Alert.alert('Reset PIN', 'System reset required.')}><Text style={[styles.link, { marginTop: 15 }]}>Forgot Access Code?</Text></TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // --- ENHANCED ADMIN PORTAL ---
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header2 />
      <View style={styles.adminHeader}>
         <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Management Hub</Text>
            <Text style={styles.subGreeting}>Platform Overview & Controls</Text>
         </View>
         <TouchableOpacity onPress={() => setAuth({ ...auth, logged: false })} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={24} color="#FFF" />
         </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.dashContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.revenueCard, { backgroundColor: '#064E3B' }]}>
           <View style={styles.revRow}>
              <View>
                <Text style={styles.revLabel}>TOTAL GROSS REVENUE</Text>
                <Text style={styles.revVal}>NPR {totalRevenue.toLocaleString()}</Text>
              </View>
              <Ionicons name="stats-chart" size={40} color="rgba(255,255,255,0.2)" />
           </View>
        </View>

        {/* Master Control Panel */}
        <View style={styles.masterBox}>
           <Text style={styles.secTitle}>Master Control Panel</Text>
           <View style={styles.controlGrid}>
              <TouchableOpacity style={styles.cMiniBtn} onPress={resetAppForTesting}>
                 <Ionicons name="trash-outline" size={20} color="#EF4444" />
                 <Text style={[styles.cMiniTxt, { color: '#EF4444' }]}>Wipe Data</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cMiniBtn} onPress={() => Alert.alert('System', 'Global PINs forced to 1234')}>
                 <Ionicons name="key-outline" size={20} color="#3B82F6" />
                 <Text style={[styles.cMiniTxt, { color: '#3B82F6' }]}>Reset Access</Text>
              </TouchableOpacity>
           </View>
        </View>

        {/* Dynamic List Management */}
        <View style={styles.tabRow}>
           <TouchableOpacity style={[styles.tab, activeTab === 'bookings' && styles.activeTab]} onPress={() => setActiveTab('bookings')}>
              <Text style={[styles.tabTxt, activeTab === 'bookings' && styles.activeTabTxt]}>All Bookings ({bookings.length})</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.tab, activeTab === 'pros' && styles.activeTab]} onPress={() => setActiveTab('pros')}>
              <Text style={[styles.tabTxt, activeTab === 'pros' && styles.activeTabTxt]}>Professionals ({professionals.length})</Text>
           </TouchableOpacity>
        </View>

        {activeTab === 'bookings' ? (
          bookings.map(item => (
            <TouchableOpacity key={item.id} style={[styles.bookingCard, { backgroundColor: colors.card }]} onPress={() => setEditModal({ visible: true, data: item, type: 'booking' })}>
              <View style={styles.row}>
                <Text style={[styles.bTitle, { color: colors.text }]}>{item.service}</Text>
                <View style={[styles.badge, { backgroundColor: item.status === 'Completed' ? '#D1FAE5' : '#FEE2E2' }]}>
                  <Text style={[styles.badgeTxt, { color: item.status === 'Completed' ? '#065F46' : '#991B1B' }]}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.bSub}>Client: {item.name || 'Anonymous'}</Text>
              <Text style={styles.bSub}>Contact: {item.phone || 'N/A'}</Text>
              <Text style={styles.bSub}>Date: {item.date}</Text>
            </TouchableOpacity>
          ))
        ) : (
          professionals.map(item => (
            <TouchableOpacity key={item.id} style={[styles.bookingCard, { backgroundColor: colors.card }]} onPress={() => setEditModal({ visible: true, data: item, type: 'pro' })}>
              <View style={styles.row}>
                <Text style={[styles.bTitle, { color: colors.text }]}>{item.name}</Text>
                <View style={[styles.badge, { backgroundColor: item.verification === 'Verified' ? '#DBEAFE' : '#F3F4F6' }]}>
                  <Text style={[styles.badgeTxt, { color: '#1E40AF' }]}>{item.verification || 'Pending'}</Text>
                </View>
              </View>
              <Text style={styles.bSub}>Role: {item.expertise}</Text>
              <Text style={styles.bSub}>Experience: {item.experience} Years</Text>
              <Text style={styles.bSub}>Applied: {item.date}</Text>
            </TouchableOpacity>
          ))
        )}

        {(activeTab === 'bookings' ? bookings : professionals).length === 0 && (
          <View style={styles.emptyWrap}>
             <Ionicons name="folder-open-outline" size={60} color="#CCC" />
             <Text style={styles.empty}>No records found in system.</Text>
          </View>
        )}
      </ScrollView>

      {/* MODAL FOR STATUS UPDATES */}
      <Modal visible={editModal.visible} transparent animationType="slide">
        <View style={styles.modalOver}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Manage {editModal.type === 'booking' ? 'Booking' : 'Professional'}</Text>
            <Text style={styles.modalSub}>{editModal.data?.name || editModal.data?.service}</Text>

            {editModal.type === 'booking' ? (
              <>
                <TouchableOpacity style={styles.opt} onPress={() => updateStatus(editModal.data?.id, 'Completed', 'booking')}>
                  <Text style={styles.optTxt}>Mark as Completed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.opt} onPress={() => updateStatus(editModal.data?.id, 'Canceled', 'booking')}>
                  <Text style={[styles.optTxt, { color: 'red' }]}>Cancel Booking</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.opt} onPress={() => updateStatus(editModal.data?.id, 'Verified', 'pro')}>
                  <Text style={[styles.optTxt, { color: '#3B82F6' }]}>Approve & Verify Pro</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.opt} onPress={() => updateStatus(editModal.data?.id, 'Rejected', 'pro')}>
                  <Text style={[styles.optTxt, { color: 'red' }]}>Reject Application</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.close} onPress={() => setEditModal({ visible: false, data: null, type: '' })}>
              <Text style={{ fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: { flex: 1, backgroundColor: '#134E4A' },
  topSection: { paddingHorizontal: 20, paddingBottom: 20 },
  fakeHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  headerLogo: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#FFF' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginLeft: 10, flex: 1 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  heroCenter: { alignItems: 'center', marginTop: 30 },
  lockCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  heroBrand: { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginTop: 15 },
  heroTag: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginTop: 5 },
  formContainer: { flex: 1, marginTop: -40 },
  formScroll: { flexGrow: 1 },
  whiteCard: { backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, flex: 1, padding: 35, alignItems: 'center' },
  signInTitle: { alignSelf: 'flex-start', fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 25 },
  phoneInputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 15, height: 55, width: '100%', paddingHorizontal: 15, marginBottom: 20 },
  flag: { fontSize: 20, marginRight: 10, paddingRight: 10, borderRightWidth: 1, borderRightColor: '#E5E7EB' },
  inputField: { flex: 1, fontSize: 16, color: '#111827', paddingLeft: 10 },
  pinLabelRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  pinLabel: { fontSize: 14, fontWeight: 'bold', color: '#6B7280' },
  pinGrid: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  pinInput: { width: 55, height: 60, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 15, textAlign: 'center', fontSize: 24, fontWeight: 'bold', backgroundColor: '#F9FAFB' },
  loginBtn: { backgroundColor: '#2D5A57', width: '75%', height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  loginBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  divider: { width: '100%', height: 1, backgroundColor: '#F3F4F6', marginVertical: 30 },
  footerLinks: { alignItems: 'center' },
  joinText: { color: '#6B7280', fontSize: 14, fontWeight: 'bold' },
  link: { color: '#2D5A57', fontWeight: 'bold' },

  // PORTAL STYLES
  adminHeader: { backgroundColor: '#064E3B', padding: 25, paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  subGreeting: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  logoutBtn: { padding: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)' },
  dashContent: { padding: 20, paddingBottom: 40 },
  revenueCard: { padding: 25, borderRadius: 24, marginBottom: 20, elevation: 5 },
  revRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  revLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '800' },
  revVal: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginTop: 5 },
  masterBox: { padding: 20, backgroundColor: '#F9FAFB', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 25 },
  secTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  controlGrid: { flexDirection: 'row', gap: 10 },
  cMiniBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F3F4F6' },
  cMiniTxt: { fontSize: 13, fontWeight: 'bold' },
  tabRow: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: '#F3F4F6' },
  activeTab: { backgroundColor: '#064E3B' },
  tabTxt: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  activeTabTxt: { color: '#FFF' },
  bookingCard: { padding: 18, borderRadius: 18, marginBottom: 12, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  bTitle: { fontSize: 16, fontWeight: 'bold' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeTxt: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  bSub: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  emptyWrap: { alignItems: 'center', marginTop: 60 },
  empty: { textAlign: 'center', marginTop: 15, color: '#9CA3AF', fontWeight: 'bold' },
  modalOver: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFF', padding: 30, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  modalSub: { color: '#6B7280', marginBottom: 20, fontSize: 14 },
  opt: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  optTxt: { fontSize: 16, fontWeight: 'bold', color: '#2D5A57' },
  close: { marginTop: 25, alignItems: 'center', padding: 10 }
});
