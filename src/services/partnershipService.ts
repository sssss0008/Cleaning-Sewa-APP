import { supabase } from '../lib/supabase';

export interface PartnershipApplicationData {
  business_name: string;
  contact_person: string;
  phone: string;
  email: string;
  business_type: string[];
  years_in_operation: number;
  registration_number?: string;
  coverage_area: string[];
  interest_duration: string;
  proposal: string;
  document_urls?: string[];
}

export const partnershipService = {
  async submitApplication(data: PartnershipApplicationData) {
    try {
      const { data: result, error } = await supabase
        .from('partnership_applications')
        .insert([data])
        .select();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Error submitting partnership application:', error.message);
      return { success: false, error: error.message };
    }
  },
};
