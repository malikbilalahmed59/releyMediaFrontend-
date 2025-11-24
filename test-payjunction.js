/**
 * Test script for PayJunction API integration
 * 
 * This script tests the PayJunction API endpoints using sandbox credentials
 * Run with: node test-payjunction.js
 */

const PAYJUNCTION_SANDBOX_URL = 'https://api.payjunctionlabs.com';
const PAYJUNCTION_USERNAME = 'relymedia';
const PAYJUNCTION_PASSWORD = 'Bilal(00)Ahmed';
const PAYJUNCTION_APP_KEY = '83ef9f5a-b3da-43ba-97fd-2044c45751d5';

console.log('Using Credentials:');
console.log('Username:', PAYJUNCTION_USERNAME);
console.log('Password:', PAYJUNCTION_PASSWORD.replace(/./g, '*'));
console.log('App Key:', PAYJUNCTION_APP_KEY);
console.log('');

// Create Basic Auth header
function getAuthHeader() {
  const credentials = Buffer.from(`${PAYJUNCTION_USERNAME}:${PAYJUNCTION_PASSWORD}`).toString('base64');
  return `Basic ${credentials}`;
}

// Make request to PayJunction API
async function payJunctionRequest(endpoint, method = 'POST', data = {}) {
  const url = `${PAYJUNCTION_SANDBOX_URL}${endpoint}`;
  
  const headers = {
    'Accept': 'application/json',
    'X-PJ-Application-Key': PAYJUNCTION_APP_KEY,
    'Authorization': getAuthHeader(),
  };

  const options = {
    method,
    headers,
  };

  // Add form data for POST/PUT requests
  if (Object.keys(data).length > 0 && (method === 'POST' || method === 'PUT')) {
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    options.body = formData.toString();
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  try {
    console.log(`\n${method} ${endpoint}`);
    console.log('Request URL:', url);
    console.log('Request Headers:', JSON.stringify(headers, null, 2));
    if (options.body) {
      console.log('Request Body:', options.body);
    }
    
    const response = await fetch(url, options);
    const responseText = await response.text();
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.error('Error Response:', responseText);
      return { error: true, status: response.status, message: responseText };
    }

    try {
      const json = JSON.parse(responseText);
      console.log('Success Response:', JSON.stringify(json, null, 2));
      return { success: true, data: json };
    } catch {
      console.log('Response (text):', responseText);
      return { success: true, data: responseText };
    }
  } catch (error) {
    console.error('Request Error:', error.message);
    return { error: true, message: error.message };
  }
}

// Test functions
async function testChargeCreditCard() {
  console.log('\n=== TEST 1: Charge Credit Card (Default CAPTURE) ===');
  return await payJunctionRequest('/transactions', 'POST', {
    cardNumber: '4444333322221111',
    cardExpMonth: '01',
    cardExpYear: '2020',
    amountBase: '1.00',
  });
}

async function testAuthorizeCreditCard() {
  console.log('\n=== TEST 2: Authorize Credit Card (HOLD) ===');
  return await payJunctionRequest('/transactions', 'POST', {
    status: 'HOLD',
    cardNumber: '4444333322221111',
    cardExpMonth: '01',
    cardExpYear: '2020',
    amountBase: '2.00',
  });
}

async function testRefundCreditCard() {
  console.log('\n=== TEST 3: Refund Credit Card ===');
  return await payJunctionRequest('/transactions', 'POST', {
    action: 'REFUND',
    cardNumber: '4444333322221111',
    cardExpMonth: '01',
    cardExpYear: '2020',
    amountBase: '1.00',
  });
}

async function testChargeACH() {
  console.log('\n=== TEST 4: Charge Checking Account (ACH) ===');
  return await payJunctionRequest('/transactions', 'POST', {
    achRoutingNumber: '104000016',
    achAccountNumber: '12345678',
    achAccountType: 'CHECKING',
    achType: 'PPD',
    amountBase: '1.00',
  });
}

async function testRefundACH() {
  console.log('\n=== TEST 5: Refund Checking Account (ACH) ===');
  return await payJunctionRequest('/transactions', 'POST', {
    action: 'REFUND',
    achRoutingNumber: '104000016',
    achAccountNumber: '12345678',
    achAccountType: 'CHECKING',
    achType: 'PPD',
    amountBase: '1.00',
  });
}

// Run all tests
async function runTests() {
  console.log('========================================');
  console.log('PayJunction API Integration Tests');
  console.log('Sandbox Environment');
  console.log('========================================');

  const results = [];

  // Test 1: Charge Credit Card
  results.push(await testChargeCreditCard());
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between requests

  // Test 2: Authorize Credit Card
  results.push(await testAuthorizeCreditCard());
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 3: Refund Credit Card
  results.push(await testRefundCreditCard());
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 4: Charge ACH
  results.push(await testChargeACH());
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 5: Refund ACH
  results.push(await testRefundACH());

  // Summary
  console.log('\n========================================');
  console.log('Test Summary');
  console.log('========================================');
  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => r.error).length;
  console.log(`Total Tests: ${results.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
  console.log('========================================\n');
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  // For Node.js environment
  const https = require('https');
  const http = require('http');
  
  // Polyfill fetch for Node.js
  if (typeof fetch === 'undefined') {
    global.fetch = async (url, options) => {
      return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const lib = urlObj.protocol === 'https:' ? https : http;
        
        const requestOptions = {
          hostname: urlObj.hostname,
          port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
          path: urlObj.pathname + urlObj.search,
          method: options.method || 'GET',
          headers: options.headers || {},
        };

        const req = lib.request(requestOptions, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              statusText: res.statusMessage,
              text: () => Promise.resolve(data),
              json: () => Promise.resolve(JSON.parse(data)),
            });
          });
        });

        req.on('error', reject);
        
        if (options.body) {
          req.write(options.body);
        }
        
        req.end();
      });
    };
  }
  
  runTests().catch(console.error);
} else {
  // For browser environment
  runTests().catch(console.error);
}

