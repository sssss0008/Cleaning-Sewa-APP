import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar
} from 'react-native';
import Header3 from '../../components/Header3drawer';
import { useTheme } from '../../src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationScreen() {
  const { colors, isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Mock notifications based on actual app features
      const mockNotifs = [
        { id: '1', title: 'Payment Successful', body: 'Your booking for Sofa Cleaning has been confirmed via eSewa.', time: 'Just now', icon: 'checkmark-circle', color: '#10B981' },
        { id: '2', title: 'New Professional Joined', body: 'Arjun Giri is now available for Deep Cleaning near you.', time: '2 hours ago', icon: 'people', color: '#3B82F6' },
        { id: '3', title: 'Welcome to CleaningSewa', body: 'Your account is ready. Explore our 33+ services!', time: '1 day ago', icon: 'star', color: '#F59E0B' },
      ];
      setNotifications(mockNotifs);
    } catch (e) { console.error(e); }
  };

  const renderNotif = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: isDarkMode ? colors.card : '#FFF' }]}>
       <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
          <Ionicons name={item.icon} size={24} color={item.color} />
       </View>
       <View style={styles.content}>
          <Text style={[styles.nTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.nBody, { color: colors.subText }]}>{item.body}</Text>
          <Text style={styles.nTime}>{item.time}</Text>
       </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Header3 />

      <View style={styles.headerBox}>
         <Text style={[styles.title, { color: isDarkMode ? colors.primary : '#064E3B' }]}>Notification Center</Text>
         <Text style={styles.sub}>Track all your service updates and payments</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={i => i.id}
        renderItem={renderNotif}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
             <Ionicons name="notifications-off-outline" size={60} color="#CCC" />
             <Text style={styles.emptyTxt}>No new notifications.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: { padding: 25, paddingBottom: 15 },
  title: { fontSize: 26, fontWeight: '900' },
  sub: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  list: { padding: 20 },
  card: { flexDirection: 'row', padding: 20, borderRadius: 20, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  content: { flex: 1 },
  nTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  nBody: { fontSize: 13, lineHeight: 18 },
  nTime: { fontSize: 11, color: '#9CA3AF', marginTop: 10, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyTxt: { color: '#999', marginTop: 15, fontSize: 15 }
});