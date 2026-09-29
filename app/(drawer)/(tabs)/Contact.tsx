import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Linking, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator, StatusBar } from 'react-native';
import Header2 from '../../../components/Header2';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';
import { feedbackService } from '../../../src/services/feedbackService';

const CONTACT_INFO = {
  phone: '+9779851152774',
  whatsapp: '9779851152774',
  email: 'cleaningsewa@sriyog.com',
  location: 'Kamalpokhari, Kathmandu (Sriyog Consulting)',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sriyog+Consulting+Kamalpokhari+Kathmandu'
};

export default function ContactScreen() {
  const { colors, isDarkMode } = useTheme();
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = (type: 'call' | 'whatsapp' | 'email' | 'map') => {
    let url = '';
    if (type === 'call') url = `tel:${CONTACT_INFO.phone}`;
    if (type === 'whatsapp') url = `whatsapp://send?phone=${CONTACT_INFO.whatsapp}`;
    if (type === 'email') url = `mailto:${CONTACT_INFO.email}`;
    if (type === 'map') url = CONTACT_INFO.mapUrl;

    Linking.openURL(url).catch(() => Alert.alert('Error', 'Unable to open application.'));
  };

  const submit = async () => {
    if (!msg.trim()) return Alert.alert('Error', 'Please enter feedback');
    setLoading(true);
    try {
      await feedbackService.sendFeedback(msg, CONTACT_INFO.email);
      setLoading(false);
      Alert.alert('Success', 'Feedback submitted to database successfully!');
      setMsg('');
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', 'Failed to send feedback.');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Header2 title="Contact & Support" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.cont}>
          <Text style={[styles.title, { color: isDarkMode ? colors.primary : '#064E3B' }]}>Contact Us</Text>

          <TouchableOpacity activeOpacity={0.9} onPress={() => handleAction('map')} style={styles.mapContainer}>
            <Image source={require('../../../assets/home/sriyogmap.png')} style={styles.mapImg} resizeMode="cover" />
            <View style={styles.mapBadge}><Text style={styles.mapBadgeText}>Sriyog Location - Tap to Open</Text></View>
          </TouchableOpacity>

          <View style={styles.infoGrid}>
             <TouchableOpacity style={[styles.card, { backgroundColor: isDarkMode ? colors.card : '#FFF' }]} onPress={() => handleAction('call')}>
                <Ionicons name="call" size={24} color="#064E3B" />
                <View style={styles.cardLead}>
                   <Text style={[styles.ct, { color: colors.text }]}>Call Us</Text>
                   <Text style={styles.cs}>{CONTACT_INFO.phone}</Text>
                </View>
             </TouchableOpacity>

             <TouchableOpacity style={[styles.card, { backgroundColor: isDarkMode ? colors.card : '#FFF' }]} onPress={() => handleAction('whatsapp')}>
                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                <View style={styles.cardLead}>
                   <Text style={[styles.ct, { color: colors.text }]}>WhatsApp</Text>
                   <Text style={styles.cs}>Chat with us now</Text>
                </View>
             </TouchableOpacity>

             <TouchableOpacity style={[styles.card, { backgroundColor: isDarkMode ? colors.card : '#FFF' }]} onPress={() => handleAction('email')}>
                <Ionicons name="mail" size={24} color="#3B82F6" />
                <View style={styles.cardLead}>
                   <Text style={[styles.ct, { color: colors.text }]}>Email Us</Text>
                   <Text style={styles.cs}>{CONTACT_INFO.email}</Text>
                </View>
             </TouchableOpacity>
          </View>

          <View style={[styles.fBox, { backgroundColor: isDarkMode ? colors.card : '#FFF' }]}>
            <Text style={[styles.ft, { color: isDarkMode ? colors.primary : '#064E3B' }]}>Send Feedback</Text>
            <TextInput style={[styles.input, { color: colors.text, borderColor: colors.border }]} multiline value={msg} onChangeText={setMsg} placeholder="How can we improve?" placeholderTextColor="#9CA3AF" />
            <TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Send Feedback</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { paddingBottom: 40 },
  cont: { padding: 20 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 20 },
  mapContainer: { width: '100%', height: 180, borderRadius: 20, overflow: 'hidden', marginBottom: 25, position: 'relative', elevation: 5 },
  mapImg: { width: '100%', height: '100%' },
  mapBadge: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(6, 78, 59, 0.9)', padding: 10, borderRadius: 20 },
  mapBadgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  infoGrid: { gap: 12, marginBottom: 25 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 16, elevation: 2 },
  cardLead: { marginLeft: 15 },
  ct: { fontWeight: '800', fontSize: 15 },
  cs: { color: '#6B7280', fontSize: 13, marginTop: 2 },
  fBox: { padding: 25, borderRadius: 20, elevation: 2 },
  ft: { fontSize: 20, fontWeight: '800', marginBottom: 15 },
  input: { borderRadius: 12, padding: 15, height: 110, textAlignVertical: 'top', borderWidth: 1, backgroundColor: '#F9FAFB' },
  btn: { backgroundColor: '#064E3B', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 15 }
});
