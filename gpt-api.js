export async function fetchData(apiKey, prompt) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
  
    const requestBody = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  }
  
//   // Example usage:
//   const apiKey = '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';
//   const prompt = 'Que es un lapiz?';
  
//   try {
//     const result = await fetchData(apiKey, prompt);
//     console.log(result.choices[0].message);
//   } catch (error) {
//     // Handle errors as needed
//   }
  