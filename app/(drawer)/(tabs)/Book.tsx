import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, FlatList, ActivityIndicator, Image, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import Header2 from '../../../components/Header2';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const cleaningServices = ['Bathroom Cleaning', 'Kitchen Cleaning', 'Home Cleaning', 'Carpet Cleaning', 'Sofa Cleaning', 'Move-In/Out Cleaning', 'Disinfection', 'A/C Cleaning'];
const cities = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 'Chitwan'];
const leadSources = ['Facebook', 'Google Search', 'Recommendation', 'TikTok', 'Other'];

export default function ServiceBookingScreen() {
  const params = useLocalSearchParams<{ service: string }>();
  const [f, setF] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    landmark: '',
    budget: '',
    service: params.service || '',
    property: '',
    date: new Date(),
    lead: '',
    message: '',
    terms: false
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [p, setP] = useState({ v: false, t: '', i: [] as string[], target: '' });

  const handlePickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setF({ ...f, date: selectedDate });
    }
  };

  const handleSubmit = () => {
    if (!f.name || !f.phone || !f.city || !f.budget || !f.service || !f.date || !f.lead || !f.terms) {
      return Alert.alert('Required Fields', 'Please fill all mandatory fields and agree to T&C.');
    }

    Alert.alert(
      'Payment Required',
      'To confirm your booking, please proceed to payment via eSewa.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay with eSewa',
          onPress: () => router.push({
            pathname: '/ESewaPayment',
            params: { price: f.budget.replace(/\D/g, '') || '2500', service: f.service }
          })
        }
      ]
    );
  };

  const openP = (t: string, i: string[], target: string) => setP({ v: true, t, i, target });

  return (
    <View style={styles.screen}>
      <Header2 />
      <KeyboardAwareScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Book Cleaning Service in Nepal</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput style={styles.input} value={f.name} onChangeText={v => setF({...f, name: v})} placeholder="Enter name" />

          <Text style={styles.label}>Phone *</Text>
          <View style={styles.phoneWrap}>
            <Text style={styles.flag}>🇳🇵</Text>
            <TextInput style={styles.phoneInput} value={f.phone} onChangeText={v => setF({...f, phone: v})} keyboardType="phone-pad" maxLength={10} placeholder="98XXXXXXXX" />
          </View>

          <Text style={styles.label}>City *</Text>
          <TouchableOpacity style={styles.drop} onPress={() => openP('Select City', cities, 'city')}>
            <Text style={f.city ? styles.sel : styles.ph}>{f.city || 'Select city'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Manual Budget (NPR) *</Text>
          <TextInput
            style={styles.input}
            value={f.budget}
            onChangeText={v => setF({...f, budget: v})}
            placeholder="e.g. 5000"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Service *</Text>
          <TouchableOpacity style={styles.drop} onPress={() => openP('Select Service', cleaningServices, 'service')}>
            <Text style={f.service ? styles.sel : styles.ph}>{f.service || 'Select service'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Booking Date *</Text>
          <TouchableOpacity style={styles.drop} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.sel}>{f.date.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={f.date}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={onDateChange}
            />
          )}

          <Text style={styles.label}>How did you hear? *</Text>
          <TouchableOpacity style={styles.drop} onPress={() => openP('Select Option', leadSources, 'lead')}>
            <Text style={f.lead ? styles.sel : styles.ph}>{f.lead || 'Select option'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.upload} onPress={handlePickImage}>
            {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : <Text style={styles.upText}>Click to add photos</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.terms} onPress={() => setF({...f, terms: !f.terms})}>
            <Ionicons name={f.terms ? "checkbox" : "square-outline"} size={20} color="green" />
            <Text style={styles.termsText}> Agree to Terms & Conditions *</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>BOOK NOW</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      <Modal visible={p.v} transparent animationType="slide">
        <View style={styles.mOver}>
          <View style={styles.mCard}>
            <View style={styles.mHead}><Text style={styles.mTitle}>{p.t}</Text><TouchableOpacity onPress={() => setP({...p, v: false})}><Text>✕</Text></TouchableOpacity></View>
            <FlatList data={p.i} keyExtractor={i => i} renderItem={({ item }) => (
              <TouchableOpacity style={styles.mItem} onPress={() => { setF({...f, [p.target]: item}); setP({...p, v: false}); }}>
                <Text style={styles.mItemTxt}>{item}</Text>
              </TouchableOpacity>
            )} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 60 },
  title: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginVertical: 20, color: '#064E3B' },
  card: { backgroundColor: '#FFF', marginHorizontal: 16, borderRadius: 16, padding: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
  label: { fontSize: 14, fontWeight: '800', marginTop: 12, marginBottom: 8, color: '#374151' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, height: 50, paddingHorizontal: 15, fontSize: 15, backgroundColor: '#F9FAFB' },
  phoneWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, height: 50, paddingHorizontal: 15, backgroundColor: '#F9FAFB' },
  flag: { fontSize: 20, marginRight: 10 },
  phoneInput: { flex: 1, fontSize: 15 },
  drop: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, height: 50, justifyContent: 'center', paddingHorizontal: 15, backgroundColor: '#F9FAFB' },
  ph: { color: '#9CA3AF', fontSize: 15 },
  sel: { color: '#111827', fontSize: 15, fontWeight: '500' },
  upload: { borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed', height: 100, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginVertical: 20, backgroundColor: '#F9FAFB' },
  preview: { width: '100%', height: '100%', borderRadius: 10 },
  upText: { color: '#6B7280', fontSize: 14, fontWeight: '600' },
  terms: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  termsText: { fontSize: 14, marginLeft: 10, color: '#4B5563' },
  btn: { backgroundColor: '#064E3B', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 15, elevation: 2 },
  btnText: { color: '#FFF', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  mOver: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  mCard: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%', paddingBottom: 20 },
  mHead: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#EEE' },
  mTitle: { fontWeight: 'bold', fontSize: 16 },
  mItem: { padding: 15, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  mItemTxt: { fontSize: 15 }
});