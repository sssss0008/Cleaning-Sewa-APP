import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header2 from '../components/Header2';
import { useTheme } from '../src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { careerService } from '../src/services/careerService';

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Kabita Thapa', service: 'Deep Cleaning', date: '2026-08-12', revenue: '5500' },
  { id: '2', name: 'Sanjiv Giri', service: 'Sofa Cleaning', date: '2026-08-11', revenue: '2500' },
  { id: '3', name: 'Rupak Shrestha', service: 'AC Maintenance', date: '2026-08-10', revenue: '3200' },
];

export default function ProDashboard() {
  const { colors } = useTheme();
  const [apps, setApps] = useState<any[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [profile, setProfile] = useState({ name: 'Pro Member', expertise: 'General Cleaning', experience: '5', photo: null as string | null });
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const aData = await careerService.getProApplications();
      if (aData) setApps(aData);
      const pData = await AsyncStorage.getItem('pro_profile');
      if (pData) setProfile(JSON.parse(pData));

      const income = MOCK_CUSTOMERS.reduce((acc, curr) => acc + parseInt(curr.revenue), 0);
      setTotalIncome(income);
    } catch (e) { console.error('Pro Dashboard Error:', e); }
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
      await AsyncStorage.setItem('pro_profile', JSON.stringify(updated));
    }
  };

  const handleUpdateProfile = async () => {
    await AsyncStorage.setItem('pro_profile', JSON.stringify(profile));
    setEditModal(false);
    Alert.alert('Success', 'Professional profile updated locally.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header2 title="Pro Dashboard" showBack={true} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Pro Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
           <View style={styles.profHead}>
             <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
                {profile.photo ? (
                  <Image source={{ uri: profile.photo }} style={styles.avatar} />
                ) : (
                  <View style={styles.proIconCircle}><Ionicons name="ribbon" size={34} color="#FFF" /></View>
                )}
                <View style={styles.camIcon}><Ionicons name="camera" size={12} color="#FFF" /></View>
             </TouchableOpacity>

             <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={[styles.pName, { color: colors.text }]}>{profile.name}</Text>
                <Text style={styles.pSub}>{profile.expertise} • {profile.experience} Yrs</Text>
             </View>
             <TouchableOpacity onPress={() => setEditModal(true)} style={styles.editIcon}>
                <Ionicons name="settings-outline" size={24} color="#064E3B" />
             </TouchableOpacity>
           </View>

           {/* Financial Tracker for Pro */}
           <View style={styles.trackerBox}>
              <View style={styles.trackItem}>
                 <Text style={styles.trackLabel}>TOTAL INCOME</Text>
                 <Text style={[styles.trackVal, { color: '#10B981' }]}>NPR {totalIncome.toLocaleString()}</Text>
              </View>
              <View style={styles.trackItem}>
                 <Text style={styles.trackLabel}>NEXT PAYOUT</Text>
                 <Text style={[styles.trackVal, { color: '#3B82F6' }]}>Aug 15</Text>
              </View>
           </View>
        </View>

        <Text style={[styles.title, { color: colors.text, marginTop: 30 }]}>Your Customers</Text>
        {MOCK_CUSTOMERS.map(cust => (
          <View key={cust.id} style={[styles.custCard, { backgroundColor: colors.card }]}>
             <View style={styles.custHeader}>
                <Text style={[styles.custName, { color: colors.text }]}>{cust.name}</Text>
                <Text style={styles.custPrice}>+ NPR {cust.revenue}</Text>
             </View>
             <Text style={styles.custService}>{cust.service}</Text>
             <Text style={styles.custDate}>{cust.date}</Text>
          </View>
        ))}

        <Text style={[styles.title, { color: colors.text, marginTop: 25 }]}>Job Applications</Text>
        {apps.length > 0 ? (
          apps.map(item => (
            <View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.service, { color: colors.text }]}>{item.expertise} Role</Text>
                <View style={styles.badge}><Text style={styles.badgeTxt}>Pending Review</Text></View>
              </View>
              <Text style={styles.detail}>Applied: {item.date}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyBox}><Text style={styles.empty}>No recent applications.</Text></View>
        )}

      </ScrollView>

      <Modal visible={editModal} transparent animationType="slide">
         <View style={styles.modalOver}>
            <View style={[styles.modalCard, { backgroundColor: '#FFF' }]}>
               <Text style={styles.mTitle}>Update Professional Portal</Text>
               <TextInput style={styles.input} placeholder="Display Name" value={profile.name} onChangeText={v => setProfile({...profile, name: v})} />
               <TextInput style={styles.input} placeholder="Expertise" value={profile.expertise} onChangeText={v => setProfile({...profile, expertise: v})} />
               <TextInput style={styles.input} placeholder="Experience (Years)" value={profile.experience} onChangeText={v => setProfile({...profile, experience: v})} keyboardType="numeric" />
               <View style={styles.mBtnRow}>
                  <TouchableOpacity style={styles.cancel} onPress={() => setEditModal(false)}><Text style={{ fontWeight: '700' }}>CANCEL</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.save} onPress={handleUpdateProfile}><Text style={{ color: '#FFF', fontWeight: 'bold' }}>UPDATE</Text></TouchableOpacity>
               </View>
            </View>
         </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  profileCard: { padding: 20, borderRadius: 24, elevation: 4 },
  profHead: { flexDirection: 'row', alignItems: 'center' },
  photoContainer: { width: 64, height: 64, position: 'relative' },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#064E3B' },
  proIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#064E3B', justifyContent: 'center', alignItems: 'center' },
  camIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#064E3B', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  pName: { fontSize: 22, fontWeight: '900' },
  pSub: { fontSize: 13, color: '#6B7280' },
  editIcon: { padding: 5 },
  trackerBox: { flexDirection: 'row', marginTop: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 15, justifyContent: 'space-around' },
  trackItem: { alignItems: 'center' },
  trackLabel: { fontSize: 9, fontWeight: '800', color: '#9CA3AF', marginBottom: 4 },
  trackVal: { fontSize: 16, fontWeight: '900' },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 15 },
  custCard: { padding: 15, borderRadius: 12, marginBottom: 10, elevation: 1 },
  custHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  custName: { fontWeight: '700', fontSize: 14 },
  custPrice: { color: '#10B981', fontWeight: '800', fontSize: 13 },
  custService: { fontSize: 12, color: '#666', marginTop: 2 },
  custDate: { fontSize: 10, color: '#9CA3AF', marginTop: 4 },
  card: { padding: 18, borderRadius: 16, marginBottom: 12, borderLeftWidth: 6, borderLeftColor: '#3B82F6', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  service: { fontWeight: '700' },
  badge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, borderRadius: 6 },
  badgeTxt: { fontSize: 9, fontWeight: '900', color: '#1E40AF' },
  detail: { fontSize: 12, color: '#666' },
  emptyBox: { padding: 20, alignItems: 'center' },
  empty: { color: '#9CA3AF', fontStyle: 'italic' },
  modalOver: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 25 },
  modalCard: { padding: 30, borderRadius: 24 },
  mTitle: { fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 25, textAlign: 'center' },
  input: { backgroundColor: '#F3F4F6', padding: 15, borderRadius: 12, marginBottom: 18 },
  mBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20, marginTop: 10 },
  save: { backgroundColor: '#064E3B', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
  cancel: { padding: 10 }
});
