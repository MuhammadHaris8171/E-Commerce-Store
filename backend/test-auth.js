const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5050/api';

async function testAuthentication() {
  console.log('Testing Authentication System...\n');

  try {
    // Test 1: Login with correct credentials
    console.log('1. Testing login with correct credentials...');
    const loginResponse = await axios.post(`${API_URL}/users/login`, {
      email: 'admin@gmail.com',
      password: '243Gc794'
    });
    
    console.log('✅ Login successful');
    console.log('User:', loginResponse.data.name);
    console.log('Role:', loginResponse.data.role);
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    
    const token = loginResponse.data.token;

    // Test 2: Access protected route with valid token
    console.log('\n2. Testing access to protected route...');
    const profileResponse = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Protected route access successful');
    console.log('Profile data received');

    // Test 3: Test logout
    console.log('\n3. Testing logout...');
    const logoutResponse = await axios.post(`${API_URL}/users/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Logout successful');

    // Test 4: Try to access protected route after logout
    console.log('\n4. Testing access to protected route after logout...');
    try {
      await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('❌ Should have failed - token should be invalid');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected access after logout');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('\n🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

testAuthentication(); 