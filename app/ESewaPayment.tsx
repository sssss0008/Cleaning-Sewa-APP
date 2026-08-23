import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ESEWA_GREEN = '#41a124';

export default function ESewaPaymentScreen() {
  const params = useLocalSearchParams();
  const price = params.price || '2500';
  const service = params.service || 'Cleaning Service';

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!phone || !password) return Alert.alert('Error', 'Please enter eSewa ID and Password');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (['9711111111', '9711111112', '9711111113', '9711111114'].includes(phone) && password === 'Nepal@123') {
        setStep(2);
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    }, 1500);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);

      // Store booking locally for User Dashboard
      try {
        const existing = await AsyncStorage.getItem('user_bookings');
        const bookings = existing ? JSON.parse(existing) : [];
        const newBooking = {
          id: Date.now().toString(),
          service,
          price,
          date: new Date().toLocaleDateString(),
          status: 'Confirmed',
          refId: 'CS-' + Math.floor(Math.random()*1000000)
        };
        await AsyncStorage.setItem('user_bookings', JSON.stringify([newBooking, ...bookings]));
      } catch (e) { console.error(e); }

      setStep(3);
      setTimeout(() => router.replace('/UserDashboard'), 2500);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#FFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>eSewa Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brandBox}>
          <Image source={{ uri: 'https://blog.esewa.com.np/wp-content/uploads/2021/04/esewa-logo.png' }} style={styles.logo} resizeMode="contain" />
        </View>

        {step === 1 && (
          <View style={styles.form}>
            <Text style={styles.label}>eSewa ID</Text>
            <TextInput style={styles.input} placeholder="98XXXXXXXX" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
            <TouchableOpacity style={styles.mainBtn} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Login</Text>}
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.form}>
            <View style={styles.summary}>
              <Text style={styles.sumLabel}>Total Amount</Text>
              <Text style={styles.sumVal}>NPR {price}</Text>
              <Text style={styles.sumLabel}>Service: {service}</Text>
            </View>
            <Text style={styles.label}>Enter 4-Digit MPIN</Text>
            <TextInput style={styles.input} placeholder="••••" maxLength={4} keyboardType="number-pad" secureTextEntry />
            <TouchableOpacity style={styles.mainBtn} onPress={handleConfirm} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Confirm Payment</Text>}
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.success}>
             <Ionicons name="checkmark-circle" size={80} color={ESEWA_GREEN} />
             <Text style={styles.successTitle}>Payment Success!</Text>
             <Text style={styles.successSub}>Booking recorded in your dashboard.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: ESEWA_GREEN, height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  brandBox: { alignItems: 'center', marginVertical: 20 },
  logo: { width: 140, height: 50 },
  form: { padding: 20, elevation: 2, backgroundColor: '#FFF', borderRadius: 10 },
  label: { fontSize: 13, marginBottom: 5, fontWeight: '600' },
  input: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12, marginBottom: 15 },
  mainBtn: { backgroundColor: ESEWA_GREEN, padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  summary: { backgroundColor: '#F0FDF4', padding: 15, borderRadius: 8, marginBottom: 20, alignItems: 'center' },
  sumLabel: { fontSize: 12, color: '#666' },
  sumVal: { fontSize: 24, fontWeight: 'bold', color: ESEWA_GREEN, marginVertical: 5 },
  success: { alignItems: 'center', marginTop: 40 },
  successTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  successSub: { color: '#666', marginTop: 5 }
});