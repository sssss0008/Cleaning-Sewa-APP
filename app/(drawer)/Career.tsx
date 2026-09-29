import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import Header2 from '../../components/Header2';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { careerService } from '../../src/services/careerService';

export default function CareerScreen() {
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState('Male');
  const [image, setImage] = useState<string | null>(null);
  const [f, setF] = useState({
    name: '',
    phone: '',
    email: 'cleaningsewa@sriyog.com',
    expertise: '',
    experience: '5',
    city: '',
    area: '',
    emergency: '',
    referral: '',
    message: '',
    accepted: false
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const clearForm = () => {
    setF({ name: '', phone: '', email: 'cleaningsewa@sriyog.com', expertise: '', experience: '5', city: '', area: '', emergency: '', referral: '', message: '', accepted: false });
    setImage(null);
    setGender('Male');
  };

  const submit = async () => {
    if (!f.name || !f.phone || !f.expertise || !f.city || !f.area || !f.emergency || !f.accepted) {
       return Alert.alert('Error', 'Please fill all required fields (*) and accept Terms');
    }
    setLoading(true);
    try {
      await careerService.submitApplication({
        name: f.name,
        phone: f.phone,
        email: f.email || 'cleaningsewa@sriyog.com',
        gender,
        expertise: f.expertise,
        experience: f.experience,
        city: f.city,
        area: f.area,
        emergency: f.emergency,
        referral: f.referral,
        message: f.message,
        image,
      });

      setLoading(false);
      Alert.alert('Success', 'Your professional application has been saved to the database!', [
        { text: 'View Dashboard', onPress: () => router.push('/ProDashboard') }
      ]);
      clearForm();
    } catch (e) {
      setLoading(false);
      console.error('Pro App Submit Error:', e);
      Alert.alert('Error', 'Submission failed. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header2 title="Join as Professional" showBack={true} />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Join Now</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name <Text style={{color:'red'}}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Enter your Full Name" value={f.name} onChangeText={v => setF({...f, name: v})} />

          <Text style={styles.label}>Phone Number <Text style={{color:'red'}}>*</Text></Text>
          <View style={styles.phoneWrap}>
            <Text style={styles.flag}>🇳🇵</Text>
            <TextInput style={styles.phoneInput} placeholder="98520 24 365" keyboardType="phone-pad" value={f.phone} onChangeText={v => setF({...f, phone: v})} />
          </View>

          <Text style={styles.label}>Gender <Text style={{color:'red'}}>*</Text></Text>
          <View style={styles.radioRow}>
             <TouchableOpacity style={styles.radio} onPress={() => setGender('Male')}>
                <Ionicons name={gender === 'Male' ? "radio-button-on" : "radio-button-off"} size={22} color="#134E4A" />
                <Text style={styles.radioTxt}>Male</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.radio} onPress={() => setGender('Female')}>
                <Ionicons name={gender === 'Female' ? "radio-button-on" : "radio-button-off"} size={22} color="#134E4A" />
                <Text style={styles.radioTxt}>Female</Text>
             </TouchableOpacity>
          </View>

          <Text style={styles.label}>Headshot / Profile Picture</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            {image ? (
              <Image source={{uri: image}} style={styles.preview} />
            ) : (
              <View style={{alignItems:'center'}}>
                <Ionicons name="arrow-down-circle-outline" size={32} color="#3B82F6" />
                <Text style={styles.uploadTxt}>Upload Profile Picture</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="cleaningsewa@sriyog.com" value={f.email} onChangeText={v => setF({...f, email: v})} />

          <Text style={styles.label}>Your Expertise <Text style={{color:'red'}}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Select maximum UpTo 5" value={f.expertise} onChangeText={v => setF({...f, expertise: v})} />

          <Text style={styles.label}>Years of Experience <Text style={{color:'red'}}>*</Text></Text>
          <TextInput style={styles.input} placeholder="5" value={f.experience} onChangeText={v => setF({...f, experience: v})} keyboardType="numeric" />

          <Text style={styles.label}>Preferred City <Text style={{color:'red'}}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Select your preferred city" value={f.city} onChangeText={v => setF({...f, city: v})} />

          <Text style={styles.label}>Preferred Working Area <Text style={{color:'red'}}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Select maximum UpTo 5" value={f.area} onChangeText={v => setF({...f, area: v})} />

          <Text style={styles.label}>Emergency Contact Number <Text style={{color:'red'}}>*</Text></Text>
          <View style={styles.phoneWrap}>
            <Text style={styles.flag}>🇳🇵</Text>
            <TextInput style={styles.phoneInput} placeholder="98520 24 365" keyboardType="phone-pad" value={f.emergency} onChangeText={v => setF({...f, emergency: v})} />
          </View>

          <Text style={styles.label}>Referral Phone Number</Text>
          <View style={styles.phoneWrap}>
            <Text style={styles.flag}>🇳🇵</Text>
            <TextInput style={styles.phoneInput} placeholder="Enter referral phone number" keyboardType="phone-pad" value={f.referral} onChangeText={v => setF({...f, referral: v})} />
          </View>

          <Text style={styles.label}>Message</Text>
          <TextInput style={[styles.input, {height: 100, textAlignVertical:'top'}]} multiline value={f.message} onChangeText={v => setF({...f, message: v})} />

          <TouchableOpacity style={styles.checkRow} onPress={() => setF({...f, accepted: !f.accepted})}>
             <Ionicons name={f.accepted ? "checkbox" : "square-outline"} size={22} color="#134E4A" />
             <Text style={styles.checkTxt}>I Accept <Text style={{textDecorationLine:'underline'}}>Terms & Conditions</Text></Text>
          </TouchableOpacity>

          <View style={styles.btnRow}>
             <TouchableOpacity style={styles.clearBtn} onPress={clearForm}>
                <Ionicons name="refresh" size={16} color="#666" />
                <Text style={styles.clearTxt}>Clear form</Text>
             </TouchableOpacity>

             <TouchableOpacity style={styles.submitBtn} onPress={submit} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitTxt}>Submit</Text>}
             </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 26, fontWeight: '800', color: '#134E4A', marginBottom: 30 },
  form: { gap: 15 },
  label: { fontSize: 15, fontWeight: '700', color: '#374151' },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 15, fontSize: 14 },
  phoneWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 15 },
  flag: { fontSize: 20, marginRight: 10 },
  phoneInput: { flex: 1, height: 50 },
  radioRow: { flexDirection: 'row', gap: 20, marginVertical: 5 },
  radio: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioTxt: { fontSize: 15, fontWeight: '500' },
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
