import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseRequest } from './supabaseClient';

export interface CareerData {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  gender: string;
  expertise: string;
  experience: string;
  city: string;
  area: string;
  emergency: string;
  referral?: string;
  message?: string;
  image?: string | null;
  date?: string;
  verification?: string;
}

export const careerService = {
  async submitApplication(appData: CareerData) {
    const newApp = {
      id: appData.id || Date.now().toString(),
      ...appData,
      email: appData.email || 'cleaningsewa@sriyog.com',
      verification: 'Verified',
      date: new Date().toLocaleDateString(),
    };

    // 1. Sync local AsyncStorage
    try {
      const existing = await AsyncStorage.getItem('pro_applications');
      const apps = existing ? JSON.parse(existing) : [];
      await AsyncStorage.setItem('pro_applications', JSON.stringify([newApp, ...apps]));
    } catch (e) {
      console.error('AsyncStorage Pro Error:', e);
    }

    // 2. Post to Supabase DB backend
    const { data, error } = await supabaseRequest('careers', {
      method: 'POST',
      body: JSON.stringify({
        id: newApp.id,
        full_name: newApp.name,
        phone: newApp.phone,
        email: newApp.email,
        gender: newApp.gender,
        expertise: newApp.expertise,
        experience_years: parseInt(newApp.experience) || 1,
        city: newApp.city,
        working_area: newApp.area,
        emergency_phone: newApp.emergency,
      }),
    });

    return { success: true, app: newApp, remoteData: data, remoteError: error };
  },

  async getProApplications() {
    try {
      const data = await AsyncStorage.getItem('pro_applications');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Pro Fetch Error:', e);
    }

    const { data } = await supabaseRequest('careers?select=*&order=created_at.desc');
    return data || [];
  }
};
