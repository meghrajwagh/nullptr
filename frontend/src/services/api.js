const API_BASE_URL = 'http://localhost:5000';

export const analyzeCompany = async (companyName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company/${companyName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing company:', error);
    throw error;
  }
}; 