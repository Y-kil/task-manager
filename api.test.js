const request = require('supertest');
const app = require('../server');

let token = '';
let taskId = '';

describe('Auth Endpoints', () => {
  it('POST /api/auth/register - should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
    });
    expect([201, 409]).toContain(res.statusCode);
  });

  it('POST /api/auth/login - should login and return token', async () => {
    // Register first
    const email = `user${Date.now()}@test.com`;
    await request(app).post('/api/auth/register').send({ name: 'User', email, password: 'pass123' });

    const res = await request(app).post('/api/auth/login').send({ email, password: 'pass123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('POST /api/auth/login - should fail with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'wrong@test.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });
});

describe('Task Endpoints', () => {
  it('GET /api/tasks - should return tasks for authenticated user', async () => {
    const res = await request(app).get('/api/tasks').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/tasks - should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Task', description: 'Test Description', priority: 'high' });
    expect(res.statusCode).toBe(201);
    taskId = res.body.taskId;
  });

  it('PUT /api/tasks/:id - should update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Task', status: 'completed', priority: 'low' });
    expect(res.statusCode).toBe(200);
  });

  it('DELETE /api/tasks/:id - should delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('GET /api/tasks - should return 401 without token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(401);
  });
});

describe('User Endpoints', () => {
  it('GET /api/users/profile - should return user profile', async () => {
    const res = await request(app).get('/api/users/profile').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email');
  });
});
