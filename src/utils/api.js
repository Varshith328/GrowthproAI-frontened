const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://growthproai-backened.onrender.com';
console.log("🔗 Connected to backend:", API_BASE_URL);

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to handle API requests with timeout
const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

// Fetch business data from backend
export const fetchBusinessData = async (businessInfo) => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/business-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: businessInfo.name,
        location: businessInfo.location,
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching business data:', error);
    throw error;
  }
};

// Regenerate SEO headline
export const regenerateHeadlineAPI = async (name, location) => {
  try {
    const params = new URLSearchParams({
      name: name,
      location: location,
    });

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/regenerate-headline?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error('Error regenerating headline:', error);
    throw error;
  }
};

// Test API connection
export const testConnection = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/health`, {
      method: 'GET',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error testing connection:', error);
    throw error;
  }
};