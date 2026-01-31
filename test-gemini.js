/**
 * Quick test script for Gemini API
 * Run with: node test-gemini.js
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function testGeminiAPI() {
  console.log('Testing Gemini API connection...\n');

  if (!GEMINI_API_KEY) {
    console.error('❌ VITE_GEMINI_API_KEY not found in .env.local');
    process.exit(1);
  }

  console.log('✓ API key found');
  console.log(`Key: ${GEMINI_API_KEY.substring(0, 10)}...${GEMINI_API_KEY.slice(-4)}\n`);

  try {
    const testPrompt = 'Say "Hello from Seattle!" in exactly 3 words.';
    console.log(`Testing with prompt: "${testPrompt}"\n`);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: testPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 100,
        }
      })
    });

    if (!response.ok) {
      console.error(`❌ API request failed: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error('Error details:', errorBody);
      process.exit(1);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (generatedText) {
      console.log('✅ Gemini API is working!');
      console.log(`Response: "${generatedText}"\n`);
      console.log('🎉 All systems go! Ready to build the AI Rental Finder.\n');
    } else {
      console.error('❌ No response text from Gemini');
      console.error('Response data:', JSON.stringify(data, null, 2));
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error testing Gemini API:', error.message);
    process.exit(1);
  }
}

testGeminiAPI();
