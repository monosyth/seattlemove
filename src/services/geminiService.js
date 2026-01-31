/**
 * Gemini AI Service for rental property search and analysis
 * Pattern matches groceryshop app for reliability
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

/**
 * Generate optimized search URLs for rental sites
 * @param {Object} criteria - Search criteria (bedrooms, price, etc.)
 * @param {Object} learnedPreferences - AI-learned user preferences
 * @returns {Promise<Object>} Object with URLs for each site
 */
export const generateSearchURLs = async (criteria, learnedPreferences = {}) => {
  try {
    const prompt = `You are helping someone find rental properties in Seattle.

SEARCH CRITERIA:
- Bedrooms: ${criteria.bedrooms?.min || 1}-${criteria.bedrooms?.max || 3}
- Bathrooms: ${criteria.bathrooms?.min || 1}+
- Max Price: $${criteria.priceRange?.max || 2500}/month
- Pet-Friendly: ${criteria.petFriendly ? 'Required' : 'Not required'}
- Neighborhoods: ${criteria.neighborhoods?.join(', ') || 'Seattle area'}
- Duration: ${criteria.duration || 'any'} (short-term 1 month OR long-term 1 year)
- Description Keywords: ${criteria.descriptionKeywords?.join(', ') || 'none'}

${learnedPreferences.dealBreakers?.length > 0 ? `AVOID: ${learnedPreferences.dealBreakers.join(', ')}` : ''}
${learnedPreferences.preferredFeatures?.length > 0 ? `PREFER: ${learnedPreferences.preferredFeatures.join(', ')}` : ''}

Generate optimized search URLs for these 3 sites:
1. Zillow (https://www.zillow.com)
2. Redfin (https://www.redfin.com)
3. Hotpads (https://hotpads.com)

For each site, create a URL that incorporates:
- Seattle location
- Bedroom/bathroom requirements
- Price range
- Pet-friendly filter (if required)
- Rental type (if specified)

Return ONLY a JSON object with this structure:
{
  "zillow": "https://www.zillow.com/seattle-wa/rentals/...",
  "redfin": "https://www.redfin.com/city/16163/WA/Seattle/filter/...",
  "hotpads": "https://hotpads.com/seattle-wa/apartments-for-rent?..."
}

Make sure the URLs are properly formatted with query parameters for filters.`;

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
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit reached. Please wait a minute and try again.');
      }
      // Get detailed error message
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText;
      throw new Error(`Gemini API error (${response.status}): ${errorMessage}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    // Parse JSON from the response
    const jsonText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const urls = JSON.parse(jsonText);

    return urls;
  } catch (error) {
    console.error('generateSearchURLs error:', error);
    throw error;
  }
};

/**
 * Analyze a rental listing and score it based on criteria
 * @param {Object} listing - Listing data with description
 * @param {Object} criteria - User's search criteria
 * @param {Object} learnedPreferences - AI-learned preferences
 * @returns {Promise<Object>} Analysis with score, reasoning, matched keywords
 */
export const analyzeListingFit = async (listing, criteria, learnedPreferences = {}) => {
  try {
    const prompt = `Analyze this rental listing and score it 0-10 based on how well it matches the criteria.

HARD REQUIREMENTS:
- Bedrooms: ${criteria.bedrooms?.min || 1}-${criteria.bedrooms?.max || 3}
- Max Price: $${criteria.priceRange?.max || 2500}
- Pet-friendly: ${criteria.petFriendly ? 'Required' : 'Not required'}

DESCRIPTION KEYWORDS TO SEARCH FOR:
${criteria.descriptionKeywords?.join(', ') || 'none'}

LEARNED PREFERENCES:
- Deal Breakers: ${learnedPreferences.dealBreakers?.join(', ') || 'none'}
- Preferred Features: ${learnedPreferences.preferredFeatures?.join(', ') || 'none'}

LISTING:
Address: ${listing.address || 'N/A'}
Price: $${listing.price || 'N/A'}
Bedrooms: ${listing.bedrooms || 'N/A'}
Bathrooms: ${listing.bathrooms || 'N/A'}
Pet-Friendly: ${listing.petFriendly ? 'Yes' : 'No'}
Description: ${listing.description || 'No description'}

Analyze the listing and provide:
1. Score (0-10, where 10 is perfect match)
2. Reasoning (2-3 sentences explaining the score)
3. Matched keywords from the description (from the keywords list above)
4. Red flags (any concerns or deal breakers)

Return ONLY a JSON object:
{
  "score": 8.5,
  "reasoning": "Excellent match for criteria. Close to neighborhoods...",
  "matchedKeywords": ["natural light", "quiet"],
  "keywordMatches": [
    {
      "keyword": "natural light",
      "context": "Large windows provide natural light throughout",
      "confidence": 0.95
    }
  ],
  "redFlags": []
}`;

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
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.5,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit reached. Please wait a minute and try again.');
      }
      // Get detailed error message
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText;
      throw new Error(`Gemini API error (${response.status}): ${errorMessage}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    // Parse JSON from the response
    const jsonText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const analysis = JSON.parse(jsonText);

    return analysis;
  } catch (error) {
    console.error('analyzeListingFit error:', error);
    throw error;
  }
};

/**
 * Extract preferences from a rejection reason
 * @param {string} reason - Why user rejected the listing
 * @returns {Promise<Object>} Extracted preferences
 */
export const extractRejectionKeywords = async (reason) => {
  try {
    const prompt = `Extract preferences from this rejection reason and categorize them.

REJECTION REASON: "${reason}"

Categorize the preferences into:
1. Deal breakers - Negative keywords to avoid in future searches
2. Preferred features - Positive keywords to look for
3. Description keywords - Qualitative terms for description search

Examples:
- "Too expensive" → dealBreakers: ["expensive", "over budget"]
- "Too far from downtown" → dealBreakers: ["far from downtown"], descriptionKeywords: ["near downtown", "walkable to downtown"]
- "Dark, no natural light" → preferredFeatures: ["natural light"], descriptionKeywords: ["bright", "sunny", "windows"]
- "Noisy street" → dealBreakers: ["noisy"], descriptionKeywords: ["quiet", "peaceful"]

Return ONLY a JSON object:
{
  "dealBreakers": ["keyword1", "keyword2"],
  "preferredFeatures": ["keyword3"],
  "descriptionKeywords": ["keyword4", "keyword5"]
}`;

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
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.95,
          maxOutputTokens: 512,
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API error in extractRejectionKeywords');
      return { dealBreakers: [], preferredFeatures: [], descriptionKeywords: [] };
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return { dealBreakers: [], preferredFeatures: [], descriptionKeywords: [] };
    }

    // Parse JSON from the response
    const jsonText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const keywords = JSON.parse(jsonText);

    return keywords;
  } catch (error) {
    console.warn('extractRejectionKeywords error:', error);
    return { dealBreakers: [], preferredFeatures: [], descriptionKeywords: [] };
  }
};

/**
 * Extract listing data from a URL (for manual paste feature)
 * @param {string} url - Listing URL from Zillow/Redfin/Hotpads
 * @returns {Promise<Object>} Extracted listing data
 */
export const extractListingFromURL = async (url) => {
  try {
    const prompt = `You are helping extract rental listing information from a URL.

URL: ${url}

Based on the URL structure and patterns, extract what information you can determine:
- Which site is this from? (zillow/redfin/hotpads)
- Can you determine the address from the URL?
- Any other details visible in the URL?

Also provide:
- Instructions for the user on what manual information they should fill in
- Typical fields for this type of listing

Return ONLY a JSON object:
{
  "site": "zillow",
  "address": "extracted or 'unknown'",
  "neighborhood": "extracted or 'unknown'",
  "suggestedFields": ["price", "bedrooms", "bathrooms", "sqft", "description"],
  "instructions": "Please fill in the price, bedrooms, bathrooms, and other details from the listing page."
}`;

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
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 10,
          topP: 0.95,
          maxOutputTokens: 512,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to extract listing data');
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    const jsonText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const extractedData = JSON.parse(jsonText);

    return extractedData;
  } catch (error) {
    console.error('extractListingFromURL error:', error);
    throw error;
  }
};
