import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseRequest } from './supabaseClient';

export interface BookingData {
  id?: string;
  name: string;
  phone: string;
  city: string;
  budget: string;
  service: string;
  date: string;
  lead: string;
  imageUri?: string | null;
  status?: string;
  price?: string;
  createdAt?: string;
}

export const bookingService = {
  async createBooking(booking: BookingData) {
    const newBooking = {
      id: booking.id || Date.now().toString(),
      name: booking.name,
      phone: booking.phone,
      city: booking.city,
      budget: booking.budget,
      price: booking.budget.replace(/\D/g, '') || '2500',
      service: booking.service,
      date: booking.date,
      lead: booking.lead,
      image_url: booking.imageUri || null,
      status: booking.status || 'Pending',
      created_at: new Date().toISOString(),
    };

    // 1. Sync to local AsyncStorage
    try {
      const existing = await AsyncStorage.getItem('user_bookings');
      const bookings = existing ? JSON.parse(existing) : [];
      await AsyncStorage.setItem('user_bookings', JSON.stringify([newBooking, ...bookings]));
    } catch (e) {
      console.error('AsyncStorage Save Error:', e);
    }

    // 2. Post to Supabase DB backend
    const { data, error } = await supabaseRequest('bookings', {
      method: 'POST',
      body: JSON.stringify({
        id: newBooking.id,
        customer_name: newBooking.name,
        customer_phone: newBooking.phone,
        city: newBooking.city,
        service_name: newBooking.service,
        booking_date: newBooking.date,
        total_amount: parseFloat(newBooking.price),
        status: newBooking.status,
      }),
    });

    return { success: true, booking: newBooking, remoteData: data, remoteError: error };
  },

  async getUserBookings() {
    let localBookings: BookingData[] = [];
    try {
      const bData = await AsyncStorage.getItem('user_bookings');
      if (bData) localBookings = JSON.parse(bData);
    } catch (e) {
      console.error('AsyncStorage Fetch Error:', e);
    }

    // Fetch from Supabase remote DB
    const { data: remoteData } = await supabaseRequest('bookings?select=*&order=created_at.desc');

    if (remoteData && Array.isArray(remoteData) && remoteData.length > 0) {
      const formattedRemote = remoteData.map((r: any) => ({
        id: String(r.id),
        name: r.customer_name || 'Customer',
        phone: r.customer_phone || '',
        city: r.city || 'Kathmandu',
        price: String(r.total_amount || '2500'),
        budget: String(r.total_amount || '2500'),
        service: r.service_name || 'Cleaning Service',
        date: r.booking_date || new Date().toDateString(),
        status: r.status || 'Pending',
        lead: 'App',
      }));

      const map = new Map();
      [...localBookings, ...formattedRemote].forEach(item => {
        if (item.id && !map.has(item.id)) {
          map.set(item.id, item);
        }
      });

      const merged = Array.from(map.values());
      try {
        await AsyncStorage.setItem('user_bookings', JSON.stringify(merged));
      } catch (e) {}

      return merged;
    }

    return localBookings;
  },

  async updateBookingStatus(id: string, status: string) {
    try {
      const existing = await AsyncStorage.getItem('user_bookings');
      if (existing) {
        const bookings = JSON.parse(existing);
        const updated = bookings.map((b: any) => b.id === id ? { ...b, status } : b);
        await AsyncStorage.setItem('user_bookings', JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Status Update Error:', e);
    }

    await supabaseRequest(`bookings?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });

    return { success: true };
  }
};
