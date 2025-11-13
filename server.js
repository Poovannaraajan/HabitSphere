import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const USDA_API_KEY = process.env.USDA_API_KEY;

console.log('\n' + '='.repeat(60));
console.log('🚀 USDA API Server Starting');
console.log('='.repeat(60));
console.log('API Key Present:', USDA_API_KEY ? '✅ Yes' : '❌ No');
console.log('='.repeat(60) + '\n');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server running ✅',
    apiKeyPresent: !!USDA_API_KEY
  });
});

// Search foods - API key in HEADERS (not body)
app.post('/api/usda/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query required' });
    }

    if (!USDA_API_KEY) {
      console.error('❌ API Key not found in .env');
      return res.status(500).json({ 
        error: 'API key not configured',
        hint: 'Set USDA_API_KEY in .env file'
      });
    }

    console.log('🔍 Searching for:', query);

    // ✅ CORRECT: API key in body for POST search
    const response = await fetch('https://api.nal.usda.gov/fdc/v1/foods/search', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Api-Key': USDA_API_KEY  // ✅ Add API key to headers
      },
      body: JSON.stringify({
        query: query,
        pageSize: 10
        // ❌ REMOVE: api_key from body
      })
    });

    console.log('📥 USDA Response Status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ USDA Error:', response.status, data);
      return res.status(response.status).json({ 
        error: 'USDA API error',
        status: response.status,
        details: data
      });
    }

    console.log('✅ Found', data.foods?.length || 0, 'foods\n');
    res.json(data);
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
});

// Get food details - API key in QUERY parameter
app.post('/api/usda/food', async (req, res) => {
  try {
    const { food_id } = req.body;
    
    if (!food_id) {
      return res.status(400).json({ error: 'food_id required' });
    }

    if (!USDA_API_KEY) {
      console.error('❌ API Key not found in .env');
      return res.status(500).json({ 
        error: 'API key not configured'
      });
    }

    console.log('📋 Getting food details for ID:', food_id);

    // ✅ CORRECT: API key in query parameter for GET-style request
    const foodUrl = `https://api.nal.usda.gov/fdc/v1/food/${food_id}?api_key=${USDA_API_KEY}`;

    const response = await fetch(foodUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📥 USDA Response Status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ USDA Error:', response.status, data);
      return res.status(response.status).json({ 
        error: 'USDA API error',
        details: data
      });
    }

    console.log('✅ Food retrieved\n');
    res.json(data);
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
});

app.listen(port, () => {
  console.log('✅ Server ready on http://localhost:' + port);
  console.log('Ready to process food searches...\n');
});