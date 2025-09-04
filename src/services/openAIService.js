import axios from 'axios';

// It's recommended to retrieve the API key from server-side environment variables in a real application
// For this client-side example, we'll continue using process.env
const openAIApiKey = process.env.REACT_APP_OPENAI_API_KEY;

const checkApiKey = () => {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key is not set. Please check your .env file.');
  }
};

export const evaluateTranscription = async (speaker1Transcript, speaker2Transcript) => {
  checkApiKey();
  if (!speaker1Transcript || !speaker2Transcript) {
    throw new Error("Both Speaker 1 and Speaker 2 transcripts must be provided for a comprehensive analysis.");
  }

  // --- NEW, MORE SERIOUS AND IN-DEPTH SYSTEM PROMPT ---
  const systemPrompt = `You are an expert rhetorical analyst and debate adjudicator with a reputation for incisive, erudite, and objective analysis. Your task is to deconstruct the provided debate transcripts with academic rigor. Avoid colloquialisms, humor, or a conversational tone. Your output must be structured, formal, and analytical. You will identify logical fallacies, assess the quality of evidence, analyze rhetorical strategies, and provide a clear, evidence-based verdict.

Your entire response must be a single, clean JSON object, without any introductory or concluding text.

JSON format:
{
  "overall_assessment": "A concise, high-level summary of the debate's dynamics, core tensions, and overall quality.",
  "performance_scores": {
    "Speaker 1": {
      "Argumentation_and_Logic": "number // Score from 1-10 on logical consistency, coherence, and avoidance of fallacies.",
      "Evidence_and_Support": "number // Score from 1-10 on the quality, relevance, and application of evidence.",
      "Rhetorical_Effectiveness": "number // Score from 1-10 on the use of persuasive language, ethos, pathos, and logos.",
      "Clarity_and_Structure": "number // Score from 1-10 on the organization and clarity of the arguments.",
      "Rebuttal_and_Clash": "number // Score from 1-10 on the effectiveness of responses to the opponent.",
      "Total": "number // Sum of all scores."
    },
    "Speaker 2": {
      "Argumentation_and_Logic": "number",
      "Evidence_and_Support": "number",
      "Rhetorical_Effectiveness": "number",
      "Clarity_and_Structure": "number",
      "Rebuttal_and_Clash": "number",
      "Total": "number"
    }
  },
  "detailed_analysis": {
    "Speaker 1": {
      "strengths": [
        "A bulleted list of key strengths, citing specific examples from the transcript."
      ],
      "weaknesses": [
        "A bulleted list of key weaknesses, citing specific examples."
      ],
      "logical_fallacies": [
        {
          "fallacy": "Name of the logical fallacy (e.g., 'Ad Hominem', 'Straw Man').",
          "quote": "The exact quote from the transcript where the fallacy occurred.",
          "explanation": "A brief explanation of why this constitutes the fallacy."
        }
      ],
      "pivotal_moments": [
        "A list of moments or arguments that significantly impacted their performance, for better or worse."
      ]
    },
    "Speaker 2": {
      "strengths": ["..."],
      "weaknesses": ["..."],
      "logical_fallacies": [{ "fallacy": "...", "quote": "...", "explanation": "..." }],
      "pivotal_moments": ["..."]
    }
  },
  "strategic_recommendations": {
    "speaker_1": "A concise, actionable recommendation for Speaker 1 to improve their debating skills.",
    "speaker_2": "A concise, actionable recommendation for Speaker 2."
  },
  "verdict_and_rationale": {
    "winner": "'Speaker 1' or 'Speaker 2'",
    "rationale": "A detailed paragraph explaining the final verdict, synthesizing the key findings from the detailed analysis and performance scores. This should clearly state the deciding factors that led to the win."
  }
}`;
  
  const userPrompt = `**Speaker 1 Transcript:**
  ${speaker1Transcript}
  
  **Speaker 2 Transcript:**
  ${speaker2Transcript}
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o', // Upgraded to the latest, most capable model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4, // Lowered for more deterministic, analytical output
        max_tokens: 4000, // Increased to accommodate the more verbose, detailed structure
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}`,
        },
      }
    );

    const evaluationText = response.data.choices[0].message.content;
    return JSON.parse(evaluationText);

  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    throw new Error('Failed to retrieve an analytical response from the AI model.');
  }
};