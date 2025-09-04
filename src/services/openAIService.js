import axios from 'axios';

const openAIApiKey = process.env.REACT_APP_OPENAI_API_KEY;

const checkApiKey = () => {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key is not set. Please check your environment variables.');
  }
};

export const evaluateTranscription = async (speaker1Transcript, speaker2Transcript) => {
  checkApiKey();
  // Check for empty transcripts
  if (!speaker1Transcript || !speaker2Transcript) {
    throw new Error("Both Speaker 1 and Speaker 2 transcripts must be provided.");
  }

  const prompt = `
  You are a brutally honest, witty, and slightly sarcastic AI judge evaluating an argument between two participants. Think of yourself as a combination of Gordon Ramsay's bluntness, a debate coach's expertise, and a comedy roast master's humor. Your job is to analyze this argument with surgical precision while delivering entertaining commentary that would make even the participants laugh (even if they're getting roasted).

  Be RUTHLESSLY CRITICAL but hilariously so. Point out logical fallacies, weak arguments, missed opportunities, and cringe-worthy moments. Don't hold back - this is for entertainment and education. Use humor, wit, and clever observations. Make it feel like a professional roast where everyone learns something.
  
  **Evaluation Criteria:**
  1. **Logical Consistency:** Did they make sense or did their logic take a vacation halfway through?
  2. **Emotional Intensity:** Did they bring the passion or sound like they're ordering coffee?
  3. **Persuasiveness:** Could they convince a toddler to eat vegetables or are they less convincing than a used car salesman?
  4. **Rebuttal Effectiveness:** Did they counter-punch like Muhammad Ali or flail around like an inflatable tube man?
  5. **Overall Impact:** Did they dominate the conversation or get intellectually demolished?
  
  **Output Requirement:**
  Respond strictly with a JSON object in the following format. Do not include any text outside of this JSON structure.
  
  **JSON Format:**
  {
    "scores": {
      "Speaker 1": {
        "Logical Consistency": number,
        "Emotional Intensity": number,
        "Persuasiveness": number,
        "Rebuttal Effectiveness": number,
        "Overall Impact": number,
        "Overall Score": number
      },
      "Speaker 2": {
        "Logical Consistency": number,
        "Emotional Intensity": number,
        "Persuasiveness": number,
        "Rebuttal Effectiveness": number,
        "Overall Impact": number,
        "Overall Score": number
      }
    },
    "justifications": {
      "Speaker 1": "Provide a witty, critical, but fair analysis of Speaker 1's performance. Be brutally honest about their strengths and weaknesses. Use humor and clever observations. Don't be mean-spirited, but don't sugarcoat either.",
      "Speaker 2": "Provide a witty, critical, but fair analysis of Speaker 2's performance. Be brutally honest about their strengths and weaknesses. Use humor and clever observations. Don't be mean-spirited, but don't sugarcoat either."
    },
    "summaries": {
      "Speaker 1": "Summarize Speaker 1's main arguments and approach in an entertaining way. What were they trying to prove? Did they succeed? Make it engaging and slightly humorous.",
      "Speaker 2": "Summarize Speaker 2's main arguments and approach in an entertaining way. What were they trying to prove? Did they succeed? Make it engaging and slightly humorous."
    },
    "winner": "Speaker 1" or "Speaker 2" (Choose the one who actually won, not just who talked more)
  }
  
  Remember: Be critical, be funny, be insightful, but ultimately be fair. The goal is entertainment and education, not destruction. Think "roast with respect."
  
  Respond with only this JSON object. Do not include any other text.
    
  **Transcripts:**
  
  **Speaker 1:**
  ${speaker1Transcript}
  
  **Speaker 2:**
  ${speaker2Transcript}
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are ChatGPT, a large language model trained by OpenAI.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAIApiKey}`,
        },
      }
    );

    const evaluationText = response.data.choices[0].message.content.trim();

    // Attempt to parse JSON response
    let evaluation;
    try {
      evaluation = JSON.parse(evaluationText);
    } catch (jsonError) {
      console.error('JSON Parsing Error:', jsonError, '\nResponse received:', evaluationText);

      // Fallback: If response isn’t JSON, treat as a string error message
      throw new Error('Failed to parse evaluation JSON from OpenAI response. Response received was:\n' + evaluationText);
    }

    return evaluation;
  } catch (openAIError) {
    console.error('OpenAI Error:', openAIError);
    throw new Error('Failed to evaluate transcription with OpenAI.');
  }
};
