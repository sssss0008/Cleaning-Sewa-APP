import { supabase } from '../lib/supabase';

export const feedbackService = {
  async submitFeedback(message: string, email?: string) {
    try {
      const { data: result, error } = await supabase
        .from('feedback')
        .insert([{ message, user_email: email }])
        .select();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Error submitting feedback:', error.message);
      return { success: false, error: error.message };
    }
  },
};
