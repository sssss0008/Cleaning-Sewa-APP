import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header2 from '../components/Header2';
import { useTheme } from '../src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { bookingService } from '../src/services/bookingService';

const SIMILAR_PROS = [
  { id: '1', name: 'Nabin Sharma', rating: '4.9', jobs: '124', area: 'Kathmandu' },
  { id: '2', name: 'Suman Thapa', rating: '4.8', jobs: '86', area: 'Lalitpur' },
  { id: '3', name: 'Arjun Giri', rating: '4.7', jobs: '92', area: 'Bhaktapur' },
  { id: '4', name: 'Bishal Rai', rating: '4.9', jobs: '156', area: 'Kathmandu' },
  { id: '5', name: 'Pradip Kc', rating: '4.8', jobs: '112', area: 'Lalitpur' },
];

export default function UserDashboard() {
  const { colors } = useTheme();
  const [bookings, setBookings] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [profile, setProfile] = useState({ name: 'Guest User', phone: '98XXXXXXXX', email: 'cleaningsewa@sriyog.com', photo: null as string | null });
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const fetchedBookings = await bookingService.getUserBookings();
      setBookings(fetchedBookings || []);
      const spent = (fetchedBookings || []).reduce((acc: number, curr: any) => acc + (parseInt(curr.price) || 0), 0);
      setTotalSpent(spent);

      const pData = await AsyncStorage.getItem('user_profile');
      if (pData) setProfile(JSON.parse(pData));
    } catch (e) { console.error('Dashboard Load Error:', e); }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const updated = { ...profile, photo: result.assets[0].uri };
      setProfile(updated);
      await AsyncStorage.setItem('user_profile', JSON.stringify(updated));
    }
  };

  const handleUpdateProfile = async () => {
    await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
    setEditModal(false);
    Alert.alert('Success', 'Profile updated locally.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header2 title="User Dashboard" showBack={true} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
           <View style={styles.profHead}>
             <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
                {profile.photo ? (
                  <Image source={{ uri: profile.photo }} style={styles.avatar} />
                ) : (
                  <Ionicons name="person-circle" size={64} color="#064E3B" />
                )}
                <View style={styles.camIcon}><Ionicons name="camera" size={14} color="#FFF" /></View>
             </TouchableOpacity>

             <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={[styles.pName, { color: colors.text }]}>{profile.name}</Text>
                <Text style={styles.pSub}>{profile.phone}</Text>
                <Text style={styles.pEmail}>{profile.email || 'cleaningsewa@sriyog.com'}</Text>
             </View>
             <TouchableOpacity onPress={() => setEditModal(true)} style={styles.editIcon}>
                <Ionicons name="create-outline" size={24} color="#064E3B" />
             </TouchableOpacity>
           </View>

           {/* Income/Expense Tracking for User */}
           <View style={styles.trackerBox}>
              <View style={styles.trackItem}>
                 <Text style={styles.trackLabel}>TOTAL SPENT</Text>
                 <Text style={[styles.trackVal, { color: '#EF4444' }]}>NPR {totalSpent.toLocaleString()}</Text>
              </View>
              <View style={styles.trackItem}>
                 <Text style={styles.trackLabel}>ACTIVE BOOKINGS</Text>
                 <Text style={[styles.trackVal, { color: '#10B981' }]}>{bookings.length}</Text>
              </View>
           </View>
        </View>

        <Text style={[styles.title, { color: colors.text, marginTop: 30 }]}>Top Rated Professionals Near You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.proList}>
           {SIMILAR_PROS.map(pro => (
             <TouchableOpacity key={pro.id} style={[styles.proCard, { backgroundColor: colors.card }]}>
                <View style={styles.proIcon}><Ionicons name="person" size={24} color="#064E3B" /></View>
                <Text style={[styles.proName, { color: colors.text }]} numberOfLines={1}>{pro.name}</Text>
                <View style={styles.ratingRow}>
                   <Ionicons name="star" size={12} color="#F59E0B" />
                   <Text style={styles.ratingTxt}>{pro.rating} ({pro.jobs})</Text>
                </View>
                <Text style={styles.proArea}>{pro.area}</Text>
             </TouchableOpacity>
           ))}
        </ScrollView>

        <Text style={[styles.title, { color: colors.text, marginTop: 25 }]}>Booking History</Text>
        {bookings.length > 0 ? (
          bookings.map(item => (
            <View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.service, { color: colors.text }]}>{item.service}</Text>
                <View style={styles.badge}><Text style={styles.badgeTxt}>{item.status || 'Pending'}</Text></View>
              </View>
              <Text style={styles.detail}>Date: {item.date} | NPR {item.price || item.budget}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No bookings recorded yet.</Text>
        )}
      </ScrollView>

      <Modal visible={editModal} transparent animationType="slide">
         <View style={styles.modalOver}>
            <View style={[styles.modalCard, { backgroundColor: '#FFF' }]}>
               <Text style={styles.mTitle}>Update Profile</Text>
               <TextInput style={styles.input} placeholder="Full Name" value={profile.name} onChangeText={v => setProfile({...profile, name: v})} />
               <TextInput style={styles.input} placeholder="Phone Number" value={profile.phone} onChangeText={v => setProfile({...profile, phone: v})} keyboardType="phone-pad" />
               <TextInput style={styles.input} placeholder="Email Address" value={profile.email} onChangeText={v => setProfile({...profile, email: v})} keyboardType="email-address" />
               <View style={styles.mBtnRow}>
                  <TouchableOpacity style={styles.cancel} onPress={() => setEditModal(false)}><Text style={{ fontWeight: '700' }}>CANCEL</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.save} onPress={handleUpdateProfile}><Text style={{ color: '#FFF', fontWeight: 'bold' }}>SAVE</Text></TouchableOpacity>
               </View>
            </View>
         </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 60 },
  profileCard: { padding: 24, borderRadius: 28, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  profHead: { flexDirection: 'row', alignItems: 'center' },
  photoContainer: { width: 72, height: 72, position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#064E3B' },
  camIcon: { position: 'absolute', bottom: 2, right: 2, backgroundColor: '#064E3B', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  pName: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  pSub: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  pEmail: { fontSize: 12, color: '#064E3B', fontWeight: '600', marginTop: 2 },
  editIcon: { padding: 8, backgroundColor: '#F0FDF4', borderRadius: 12 },
  trackerBox: { flexDirection: 'row', marginTop: 24, borderTopWidth: 1, borderTopColor: '#F3F3F3', paddingTop: 20, justifyContent: 'space-around' },
  trackItem: { alignItems: 'center' },
  trackLabel: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', marginBottom: 6, letterSpacing: 1 },
  trackVal: { fontSize: 18, fontWeight: '900' },
  title: { fontSize: 20, fontWeight: '900', marginBottom: 18, color: '#064E3B', letterSpacing: -0.3 },
  proList: { gap: 14, paddingBottom: 10, paddingLeft: 4 },
  proCard: { width: 140, padding: 18, borderRadius: 22, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  proIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  proName: { fontSize: 14, fontWeight: '800' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  ratingTxt: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  proArea: { fontSize: 11, color: '#9CA3AF', marginTop: 4, fontWeight: '500' },
  card: { padding: 18, borderRadius: 20, marginBottom: 14, borderLeftWidth: 6, borderLeftColor: '#10B981', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  service: { fontSize: 16, fontWeight: '800' },
  badge: { backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeTxt: { fontSize: 10, fontWeight: '900', color: '#065F46', textTransform: 'uppercase' },
  detail: { fontSize: 13, color: '#4B5563', fontWeight: '500' },
  empty: { color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
  modalOver: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalCard: { padding: 32, borderRadius: 32, elevation: 10 },
  mTitle: { fontSize: 22, fontWeight: '900', color: '#111827', marginBottom: 28, textAlign: 'center' },
  input: { backgroundColor: '#F3F4F6', padding: 18, borderRadius: 16, marginBottom: 20, fontSize: 16 },
  mBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15, marginTop: 15, alignItems: 'center' },
  save: { backgroundColor: '#064E3B', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 14, elevation: 4 },
  cancel: { padding: 12 }
});
