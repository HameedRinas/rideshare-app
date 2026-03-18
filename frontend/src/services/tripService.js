import api from './api';

const tripService = {
  async searchTrips(params) {
    const response = await api.get('/trips/search', { params });
    return response.data;
  },

  async getTripById(id) {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  async createTrip(tripData) {
    const response = await api.post('/trips', tripData);
    return response.data;
  },

  async updateTrip(id, tripData) {
    const response = await api.put(`/trips/${id}`, tripData);
    return response.data;
  },

  async cancelTrip(id) {
    const response = await api.delete(`/trips/${id}/cancel`);
    return response.data;
  },

  async getMyTrips() {
    const response = await api.get('/trips/driver/my-trips');
    return response.data;
  },

  async getActiveTrips() {
    const response = await api.get('/trips/active');
    return response.data;
  }
};

export default tripService;