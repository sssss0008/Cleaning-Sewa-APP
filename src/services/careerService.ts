import { supabase } from '../lib/supabase';

export interface CareerApplicationData {
  full_name: string;
  phone: string;
  email: string;
  position_applied: string;
  experience_years: number;
  preferred_area: string[];
  emergency_contact: string;
  cover_letter: string;
  short_bio: string;
  id_proof_urls?: string[];
  certificate_urls?: string[];
}

export const careerService = {
  async submitApplication(data: CareerApplicationData) {
    try {
      const { data: result, error } = await supabase
        .from('career_applications')
        .insert([data])
        .select();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Error submitting career application:', error.message);
      return { success: false, error: error.message };
    }
  },
};
