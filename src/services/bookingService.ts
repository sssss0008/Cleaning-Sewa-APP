import { supabase } from '../lib/supabase';

export interface BookingData {
  full_name: string;
  email?: string;
  phone: string;
  city: string;
  landmark?: string;
  budget: string;
  service: string;
  property_type?: string;
  timing: string;
  lead_source: string;
  message?: string;
  image_url?: string;
}

export const bookingService = {
  async submitBooking(data: BookingData) {
    try {
      const { data: result, error } = await supabase
        .from('bookings')
        .insert([data])
        .select();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Error submitting booking:', error.message);
      return { success: false, error: error.message };
    }
  },
};
