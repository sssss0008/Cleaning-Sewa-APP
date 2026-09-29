import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseRequest } from './supabaseClient';
import { bookingService } from './bookingService';

export interface PaymentRecord {
  id?: string;
  bookingId?: string;
  gateway: string;
  transactionRef: string;
  amount: number;
  status: string;
  date?: string;
}

export const paymentService = {
  async processPayment(record: PaymentRecord) {
    const payment = {
      id: record.id || Date.now().toString(),
      bookingId: record.bookingId || 'BOOKING_' + Date.now(),
      gateway: record.gateway || 'eSewa',
      transactionRef: record.transactionRef,
      amount: record.amount,
      status: record.status || 'Paid',
      date: record.date || new Date().toISOString(),
    };

    // 1. Save locally
    try {
      const existing = await AsyncStorage.getItem('user_payments');
      const payments = existing ? JSON.parse(existing) : [];
      await AsyncStorage.setItem('user_payments', JSON.stringify([payment, ...payments]));
    } catch (e) {
      console.error('Payment Local Error:', e);
    }

    // 2. Post to Supabase database
    const { data, error } = await supabaseRequest('payments', {
      method: 'POST',
      body: JSON.stringify({
        id: payment.id,
        booking_id: payment.bookingId,
        gateway_name: payment.gateway,
        transaction_reference: payment.transactionRef,
        amount_paid: payment.amount,
        payment_status: payment.status,
      }),
    });

    // 3. Update associated booking status
    if (record.bookingId) {
      await bookingService.updateBookingStatus(record.bookingId, 'Confirmed & Paid');
    }

    return { success: true, payment, remoteData: data, remoteError: error };
  }
};
