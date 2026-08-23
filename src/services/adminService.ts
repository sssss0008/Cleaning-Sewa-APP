export const adminService = {
  async verifyAdmin(phone: string, pin: string) {
    if (phone === '9811527744' && pin === '1234') return { success: true };
    return { success: false, error: 'Invalid Credentials' };
  },
  async getAllBookings() { return { data: [] }; },
  async getAllCareers() { return { data: [] }; },
  async getAllPartnerships() { return { data: [] }; },
  async getAllFeedback() { return { data: [] }; }
};
