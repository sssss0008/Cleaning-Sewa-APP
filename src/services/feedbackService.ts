import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseRequest } from './supabaseClient';

export const feedbackService = {
  async sendFeedback(message: string, email: string = 'cleaningsewa@sriyog.com') {
    const feedbackEntry = {
      id: Date.now().toString(),
      message,
      email,
      date: new Date().toISOString(),
    };

    try {
      const existing = await AsyncStorage.getItem('user_feedbacks');
      const items = existing ? JSON.parse(existing) : [];
      await AsyncStorage.setItem('user_feedbacks', JSON.stringify([feedbackEntry, ...items]));
    } catch (e) {
      console.error('Feedback Local Save Error:', e);
    }

    const { data, error } = await supabaseRequest('feedback', {
      method: 'POST',
      body: JSON.stringify({
        id: feedbackEntry.id,
        message: feedbackEntry.message,
        email: feedbackEntry.email,
      }),
    });

    return { success: true, remoteData: data, remoteError: error };
  }
};
