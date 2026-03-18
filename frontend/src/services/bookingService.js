import api from './api';

const bookingService = {
  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async getMyBookings() {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  async getBookingById(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  async cancelBooking(id) {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  async confirmBooking(id) {
    const response = await api.put(`/bookings/${id}/confirm`);
    return response.data;
  },

  async getTripBookings(tripId) {
    const response = await api.get(`/bookings/trip/${tripId}`);
    return response.data;
  }
};

export default bookingService;