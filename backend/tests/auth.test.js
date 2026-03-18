const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          universityEmail: 'test@university.edu',
          password: 'password123',
          university: 'Test University',
          phone: '1234567890'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should not register user with existing email', async () => {
      // Create user first
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        universityEmail: 'existing@university.edu',
        password: 'password123',
        university: 'Test University',
        phone: '1234567890'
      });

      // Try to register with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          universityEmail: 'test@university.edu',
          password: 'password123',
          university: 'Test University',
          phone: '1234567890'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});