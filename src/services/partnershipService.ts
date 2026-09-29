import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseRequest } from './supabaseClient';

export interface PartnershipData {
  id?: string;
  fullName: string;
  orgName: string;
  phone: string;
  email?: string;
  area: string;
  image?: string | null;
  date?: string;
}

export const partnershipService = {
  async submitPartnershipRequest(reqData: PartnershipData) {
    const newReq = {
      id: reqData.id || Date.now().toString(),
      ...reqData,
      email: reqData.email || 'cleaningsewa@sriyog.com',
      date: new Date().toLocaleDateString(),
    };

    // 1. Sync local AsyncStorage
    try {
      const existing = await AsyncStorage.getItem('partnership_requests');
      const requests = existing ? JSON.parse(existing) : [];
      await AsyncStorage.setItem('partnership_requests', JSON.stringify([newReq, ...requests]));
    } catch (e) {
      console.error('AsyncStorage Partnership Error:', e);
    }

    // 2. Post to Supabase DB backend
    const { data, error } = await supabaseRequest('partnerships', {
      method: 'POST',
      body: JSON.stringify({
        id: newReq.id,
        full_name: newReq.fullName,
        organization_name: newReq.orgName,
        phone: newReq.phone,
        email: newReq.email,
        area: newReq.area,
      }),
    });

    return { success: true, req: newReq, remoteData: data, remoteError: error };
  },

  async getPartnershipRequests() {
    try {
      const data = await AsyncStorage.getItem('partnership_requests');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Partnership Fetch Error:', e);
    }

    const { data } = await supabaseRequest('partnerships?select=*&order=created_at.desc');
    return data || [];
  }
};
