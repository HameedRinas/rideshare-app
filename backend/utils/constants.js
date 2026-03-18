module.exports = {
  USER_ROLES: {
    DRIVER: 'driver',
    RIDER: 'rider',
    BOTH: 'both',
    ADMIN: 'admin'
  },

  TRIP_STATUS: {
    ACTIVE: 'active',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    FULL: 'full'
  },

  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
  },

  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    REFUNDED: 'refunded'
  },

  PAYMENT_METHODS: {
    CASH: 'cash',
    CARD: 'card',
    MOBILE_MONEY: 'mobile_money'
  },

  VEHICLE_TYPES: {
    CAR: 'car',
    MOTORCYCLE: 'motorcycle',
    VAN: 'van',
    TUKTUK: 'tuk-tuk',
    OTHER: 'other'
  },

  MAX_SEATS: 10,
  MIN_SEATS: 1,
  
  PASSWORD_MIN_LENGTH: 6,
  
  JWT_EXPIRY: '7d',
  
  RATE_LIMITS: {
    API: 100,
    AUTH: 5
  }
};