// Test script to verify backend connection
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function testConnection() {
  try {
    console.log(`🔍 Testing connection to: ${BACKEND_URL}`);
    
    // Test health endpoint
    const response = await axios.get(`${BACKEND_URL}/api/test`);
    console.log('✅ Backend is responding!');
    console.log('📊 Response:', response.data);
    
    return true;
  } catch (error) {
    console.log('❌ Backend connection failed:');
    console.log('Error:', error.message);
    return false;
  }
}

testConnection();