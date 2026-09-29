import { bookingService } from './bookingService';
import { careerService } from './careerService';
import { partnershipService } from './partnershipService';

const ADMIN_PHONE = process.env.EXPO_PUBLIC_ADMIN_PHONE || '9852024365';
const ADMIN_PIN = process.env.EXPO_PUBLIC_ADMIN_PIN || '1234';

export const adminService = {
  async verifyAdmin(phone: string, pin: string) {
    const rawPhone = phone.replace(/\s/g, '');
    if ((rawPhone === ADMIN_PHONE || rawPhone === '9852024365') && pin === ADMIN_PIN) {
      return { success: true };
    }
    return { success: false, error: 'Invalid Credentials' };
  },

  async getAllBookings() {
    const data = await bookingService.getUserBookings();
    return { data };
  },

  async getAllCareers() {
    const data = await careerService.getProApplications();
    return { data };
  },

  async getAllPartnerships() {
    const data = await partnershipService.getPartnershipRequests();
    return { data };
  }
};
