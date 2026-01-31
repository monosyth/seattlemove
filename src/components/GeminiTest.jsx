import { useState } from 'react';
import { Box, Button, Typography, Alert, Card, CardContent } from '@mui/material';

export default function GeminiTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const hasApiKey = apiKey && apiKey !== 'undefined';

  const testGemini = async () => {
    setTesting(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing with API key:', apiKey?.substring(0, 10) + '...');

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: 'Say "Hello from Seattle!" in exactly 3 words.' }]
            }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 100,
            }
          })
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error (${response.status}): ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      setResult({
        success: true,
        text: text || 'No response text',
        fullResponse: data
      });
    } catch (err) {
      console.error('Test error:', err);
      setError(err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        🧪 Gemini API Test
      </Typography>

      {/* API Key Status */}
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            API Key Status
          </Typography>
          {hasApiKey ? (
            <Alert severity="success">
              ✅ API Key loaded: {apiKey.substring(0, 10)}...{apiKey.slice(-4)}
            </Alert>
          ) : (
            <Alert severity="error">
              ❌ API Key not found!
              <br />
              Expected: VITE_GEMINI_API_KEY in .env.local
              <br />
              Current value: {String(apiKey)}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Test Button */}
      <Button
        variant="contained"
        size="large"
        onClick={testGemini}
        disabled={!hasApiKey || testing}
        sx={{ marginBottom: 3 }}
      >
        {testing ? '🔄 Testing...' : '🚀 Test Gemini API'}
      </Button>

      {/* Results */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Error:</Typography>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{error}</pre>
        </Alert>
      )}

      {result && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="success.main">
              ✅ Success!
            </Typography>
            <Typography variant="subtitle2" gutterBottom>Response:</Typography>
            <Typography variant="body1" sx={{ padding: 2, background: '#f5f5f5', borderRadius: 1, marginBottom: 2 }}>
              {result.text}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Full response logged to console
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
