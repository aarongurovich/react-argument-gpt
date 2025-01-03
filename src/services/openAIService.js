import axios from 'axios';

const openAIApiKey = process.env.REACT_APP_OPENAI_API_KEY;

if (!openAIApiKey) {
  throw new Error('OpenAI API key is not set. Please check your environment variables.');
}

export const evaluateTranscription = async (speaker1Transcript, speaker2Transcript) => {
  // Check for empty transcripts
  if (!speaker1Transcript || !speaker2Transcript) {
    throw new Error("Both Speaker 1 and Speaker 2 transcripts must be provided.");
  }

  const prompt = `
  You are an impartial judge evaluating an argument between two participants: Speaker 1 and Speaker 2. Please be super critical and do not hold back on your analysis (Do not worry no one will be offended). Based on their statements, please determine the winner of the argument.
  
  **Evaluation Criteria:**
  1. **Logical Consistency:** How logical and coherent are the arguments presented?
  2. **Emotional Intensity:** How effectively do the participants convey emotions to strengthen their position?
  3. **Persuasiveness:** How persuasive are the arguments in convincing the other party or an external observer?
  4. **Rebuttal Effectiveness:** How well do the participants counter the opposing points?
  5. **Overall Impact:** What is the overall effectiveness of each participant in the argument?
  
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
      "Speaker 1": "Provide a brief explanation for the scores assigned to Speaker 1, focusing on how well they met each evaluation criterion.",
      "Speaker 2": "Provide a brief explanation for the scores assigned to Speaker 2, focusing on how well they met each evaluation criterion."
    },
    "summaries": {
      "Speaker 1": "Summarize the key points and main arguments presented by Speaker 1. (Make sure its different from justifications)",
      "Speaker 2": "Summarize the key points and main arguments presented by Speaker 2. (Make sure its different from justifications)"
    },
    "winner": "Speaker 1" or "Speaker 2"
  }
  
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
        model: 'gpt-4',
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
        max_tokens: 1500,
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
