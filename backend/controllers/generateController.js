const axios = require('axios');

exports.generate = async (req, res) => {
  const { prompt } = req.body;

  try {
    // Request payload for Gemini API
    const response = await axios.post('https://generative-ai.googleapis.com/v1beta2/models/gemini-1.5:generate', 
      {
        prompt: prompt,
        max_output_tokens: 100, // Adjust as needed
      }, 
      {
        headers: {
          'Authorization': `Bearer ${process.env.GOOGLE_API}`, // Your Gemini API Key
          'Content-Type': 'application/json',
        }
      }
    );

    const generatedText = response.data?.choices[0]?.text || "No content generated";
    res.json({ response: generatedText });
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
};
