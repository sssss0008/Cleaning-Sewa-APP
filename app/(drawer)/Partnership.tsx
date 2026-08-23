import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import Header3 from '../../components/Header3drawer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function PartnershipScreen() {
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({
    fullName: '',
    orgName: '',
    phone: '',
    email: '',
    area: '',
    accepted: false
  });
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const clearForm = () => {
    setF({ fullName: '', orgName: '', phone: '', email: '', area: '', accepted: false });
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!f.fullName || !f.orgName || !f.phone || !f.area || !f.accepted) {
      return Alert.alert('Error', 'Please fill all required fields (*) and accept Terms');
    }
    setLoading(true);
    try {
      const existing = await AsyncStorage.getItem('partnership_requests');
      const requests = existing ? JSON.parse(existing) : [];
      const newRequest = { id: Date.now().toString(), ...f, image, date: new Date().toLocaleDateString() };
      await AsyncStorage.setItem('partnership_requests', JSON.stringify([newRequest, ...requests]));

      setTimeout(() => {
        setLoading(false);
        Alert.alert('Success', 'Your partnership request has been submitted locally!');
        clearForm();
      }, 1500);
    } catch (e) { console.error(e); }
  };

  return (
    <View style={styles.screen}>
      <Header3 />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Become a Partner</Text>
        <Text style={styles.subTitle}>Partnership opportunity with HomeSewa</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name <Text style={{color:'red'}}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Enter your Full Name" value={f.fullName} onChangeText={v => setF({...f, fullName: v})} />

          <Text style={styles.label}>Name of Organization <Text style={{color:'red'}}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Enter the name of your Organization" value={f.orgName} onChangeText={v => setF({...f, orgName: v})} />

          <Text style={styles.label}>Phone Number <Text style={{color:'red'}}>*</Text></Text>
          <View style={styles.phoneWrap}>
            <Text style={styles.flag}>🇳🇵</Text>
            <TextInput style={styles.phoneInput} placeholder="98520 24 365" keyboardType="phone-pad" value={f.phone} onChangeText={v => setF({...f, phone: v})} />
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="Enter your Email Address" value={f.email} onChangeText={v => setF({...f, email: v})} />

          <Text style={styles.label}>Company Photos <Text style={{color:'red'}}>*</Text></Text>
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            {image ? (
              <Image source={{uri: image}} style={styles.preview} />
            ) : (
              <View style={{alignItems:'center'}}>
                <Ionicons name="arrow-down-circle-outline" size={32} color="#3B82F6" />
                <Text style={styles.uploadTxt}>Drop files/photos here</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Area <Text style={{color:'red'}}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Select your Area" value={f.area} onChangeText={v => setF({...f, area: v})} />

          <TouchableOpacity style={styles.checkRow} onPress={() => setF({...f, accepted: !f.accepted})}>
             <Ionicons name={f.accepted ? "checkbox" : "square-outline"} size={24} color="#134E4A" />
             <Text style={styles.checkTxt}>I Accept <Text style={{textDecorationLine:'underline'}}>Terms & Conditions</Text></Text>
          </TouchableOpacity>

          <View style={styles.btnRow}>
             <TouchableOpacity style={styles.clearBtn} onPress={clearForm}>
                <Ionicons name="refresh" size={16} color="#666" />
                <Text style={styles.clearTxt}>Clear form</Text>
             </TouchableOpacity>

             <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitTxt}>Submit</Text>}
             </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 26, fontWeight: '800', color: '#134E4A' },
  subTitle: { fontSize: 14, color: '#666', marginTop: 5, marginBottom: 30 },
  form: { gap: 15 },
  label: { fontSize: 15, fontWeight: '700', color: '#374151' },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 15, fontSize: 14 },
  phoneWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 15 },
  flag: { fontSize: 20, marginRight: 10 },
  phoneInput: { flex: 1, height: 50 },
  uploadBox: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#3B82F6', borderRadius: 15, height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F7FF' },
  uploadTxt: { color: '#666', marginTop: 8, fontSize: 13 },
  preview: { width: '100%', height: '100%', borderRadius: 13 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  checkTxt: { marginLeft: 10, fontSize: 14, color: '#374151' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30 },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  clearTxt: { color: '#666', fontSize: 14 },
  submitBtn: { backgroundColor: '#134E4A', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 12 },
  submitTxt: { color: '#FFF', fontWeight: '800', fontSize: 16 }
});