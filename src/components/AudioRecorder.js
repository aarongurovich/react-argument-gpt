import React, { useState, useRef } from 'react';
import axios from 'axios';

const AudioRecorderWithTranscription = () => {
  const [output, setOutput] = useState('');
  const [transcript, setTranscript] = useState({ speaker1: '', speaker2: '' });
  const [evaluation, setEvaluation] = useState('');
  const [error, setError] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const audioRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]); // Use ref to store audio chunks

  // Function to start recording
  const startRecording = async () => {
    audioChunksRef.current = []; // Reset audio chunks
    setTranscript({ speaker1: '', speaker2: '' });
    setEvaluation('');
    setError(null);
    setOutput('');
    setIsTranscribing(false);

    setOutput('Requesting microphone access...');
    setIsRecording(true);

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Choose a MIME type that's widely supported
      let options = { mimeType: 'audio/webm;codecs=opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'audio/ogg;codecs=opus' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: '' }; // Let the browser choose the best available
        }
      }

      const recorder = new MediaRecorder(stream, options);
      audioRecorderRef.current = recorder;

      // Collect audio data chunks
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstart = () => {
        setOutput('Recording started! Speak now.');
      };

      recorder.onstop = async () => {
        setOutput('Recording stopped! Preparing transcription...');
        setIsRecording(false);

        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType });

        if (blob.size === 0) {
          setOutput('Recording failed: No audio data captured.');
          return;
        }

        try {
          // Step 1: Upload audio to AssemblyAI
          setIsTranscribing(true);
          setOutput('Uploading audio for transcription...');
          const uploadUrl = await uploadAudio(blob);

          // Step 2: Request transcription
          setOutput('Requesting transcription...');
          const transcriptionId = await requestTranscription(uploadUrl);

          // Step 3: Poll for transcription completion
          setOutput('Transcribing... Please wait.');
          const transcriptionResult = await pollTranscription(transcriptionId);

          const { text, speaker_labels } = transcriptionResult;

          // Debugging: Inspect speaker_labels
          console.log('Speaker Labels:', speaker_labels);

          // Step 4: Process speaker labels to separate transcripts
          const separatedTranscripts = separateSpeakers(text, speaker_labels);

          setTranscript(separatedTranscripts);
          setOutput('Transcription completed! Now evaluating...');

          // Step 5: Evaluate transcription with OpenAI using separated transcripts
          const evaluationResult = await evaluateTranscription(
            separatedTranscripts.speaker1,
            separatedTranscripts.speaker2
          );
          setEvaluation(evaluationResult);
          setOutput('Evaluation completed!');
        } catch (transcriptionError) {
          console.error('Error:', transcriptionError);
          setError(`Error: ${transcriptionError.message}`);
          setOutput('');
        } finally {
          // Stop all media tracks to release the microphone
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          setIsTranscribing(false);
        }
      };

      recorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Error accessing microphone. Please check your permissions.');
      setOutput('');
      setIsRecording(false);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (audioRecorderRef.current && audioRecorderRef.current.state !== 'inactive') {
      audioRecorderRef.current.stop();
    }
  };

  // Function to upload audio to AssemblyAI
  const uploadAudio = async (blob) => {
    // Access the API key from environment variables
    const apiKey = process.env.REACT_APP_ASSEMBLYAI_API_KEY;

    if (!apiKey) {
      throw new Error('AssemblyAI API key is not set. Please check your environment variables.');
    }

    try {
      const response = await axios.post('https://api.assemblyai.com/v2/upload', blob, {
        headers: {
          authorization: apiKey,
          'content-type': 'application/octet-stream',
        },
      });
      return response.data.upload_url;
    } catch (uploadError) {
      console.error('Upload Error:', uploadError);
      throw new Error('Failed to upload audio.');
    }
  };

  // Function to request transcription from AssemblyAI
  const requestTranscription = async (audioUrl) => {
    const apiKey = process.env.REACT_APP_ASSEMBLYAI_API_KEY;

    if (!apiKey) {
      throw new Error('AssemblyAI API key is not set. Please check your environment variables.');
    }

    try {
      const response = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        {
          audio_url: audioUrl,
          speaker_labels: true, // Enable speaker labeling
          format_text: true,    // Optional: Format text for better readability
          // Add other transcription options here
        },
        {
          headers: {
            authorization: apiKey,
            'content-type': 'application/json',
          },
        }
      );
      return response.data.id;
    } catch (transcriptionError) {
      console.error('Transcription Request Error:', transcriptionError);
      throw new Error('Failed to request transcription.');
    }
  };

  // Function to poll transcription status
  const pollTranscription = async (transcriptId) => {
    const apiKey = process.env.REACT_APP_ASSEMBLYAI_API_KEY;
    const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

    while (true) {
      try {
        const response = await axios.get(pollingEndpoint, {
          headers: {
            authorization: apiKey,
          },
        });

        const status = response.data.status;

        if (status === 'completed') {
          console.log('Transcription Completed:', response.data); // Log entire response
          return {
            text: response.data.text,
            speaker_labels: response.data.speaker_labels, // Should be an array
          };
        } else if (status === 'error') {
          throw new Error(response.data.error);
        }

        // Wait for 3 seconds before polling again
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (pollError) {
        console.error('Polling Error:', pollError);
        throw new Error('Failed during transcription polling.');
      }
    }
  };

  // Function to evaluate transcription with OpenAI
  const evaluateTranscription = async (speaker1Transcript, speaker2Transcript) => {
    const openAIApiKey = process.env.REACT_APP_OPENAI_API_KEY;

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not set. Please check your environment variables.');
    }

    const prompt = `
You are an impartial judge evaluating an argument between two participants: Speaker 1 and Speaker 2. Based on their statements, please determine the winner of the argument.

**Evaluation Criteria:**
1. **Logical Consistency:** How logical and coherent are the arguments presented?
2. **Emotional Intensity:** How effectively do the participants convey emotions to strengthen their position?
3. **Persuasiveness:** How persuasive are the arguments in convincing the other party or an external observer?
4. **Rebuttal Effectiveness:** How well do the participants counter the opposing points?
5. **Overall Impact:** What is the overall effectiveness of each participant in the argument?

**Instructions:**
- Assign a score from 1 to 10 for each participant in each category.
- Provide a brief justification for each score.
- Summarize the overall performance of each speaker.
- Declare the winner based on the aggregated scores.

**Transcripts:**

**Speaker 1:**
${speaker1Transcript}

**Speaker 2:**
${speaker2Transcript}

**Evaluation:**
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
          temperature: 0.7, // Adjust temperature for creativity vs. determinism
          max_tokens: 1000, // Adjust as needed
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAIApiKey}`,
          },
        }
      );

      const evaluation = response.data.choices[0].message.content.trim();
      return evaluation;
    } catch (openAIError) {
      console.error('OpenAI Error:', openAIError);
      throw new Error('Failed to evaluate transcription with OpenAI.');
    }
  };

  // Function to separate transcript based on speaker labels
  const separateSpeakers = (text, speakerLabels) => {
    if (!speakerLabels) {
      console.warn('Speaker labels are missing. Returning full transcript as Speaker 1.');
      return { speaker1: text, speaker2: '' };
    }

    if (typeof speakerLabels === 'boolean') {
      console.warn('Speaker labels are a boolean. Expected an array. Returning full transcript as Speaker 1.');
      return { speaker1: text, speaker2: '' };
    }

    if (!Array.isArray(speakerLabels)) {
      console.error('Speaker labels are not in expected array format:', speakerLabels);
      return { speaker1: text, speaker2: '' };
    }

    let speaker1 = '';
    let speaker2 = '';
    let currentSpeaker = null;

    speakerLabels.forEach((label) => {
      const { speaker, text: spokenText } = label;

      if (speaker === 0) {
        speaker1 += spokenText + ' ';
      } else if (speaker === 1) {
        speaker2 += spokenText + ' ';
      }
      // Extend this if more than two speakers are possible
    });

    return {
      speaker1: speaker1.trim(),
      speaker2: speaker2.trim(),
    };
  };

  return (
    <div style={styles.container}>
      <h2>Audio Recorder with Transcription and Evaluation</h2>
      <div style={styles.buttonContainer}>
        <button
          onClick={startRecording}
          style={styles.button}
          disabled={isRecording || isTranscribing}
        >
          {isRecording ? 'Recording...' : 'Start Recording'}
        </button>
        <button onClick={stopRecording} style={styles.button} disabled={!isRecording}>
          Stop Recording
        </button>
      </div>
      <div id="output" style={styles.output}>
        {output}
      </div>
      {isTranscribing && <div style={styles.transcribing}>Transcription in progress...</div>}
      {transcript.speaker1 && (
        <div style={styles.transcript}>
          <h3>Speaker 1:</h3>
          <p>{transcript.speaker1}</p>
        </div>
      )}
      {transcript.speaker2 && (
        <div style={styles.transcript}>
          <h3>Speaker 2:</h3>
          <p>{transcript.speaker2}</p>
        </div>
      )}
      {evaluation && (
        <div style={styles.evaluation}>
          <h3>Evaluation:</h3>
          <p>{evaluation}</p>
        </div>
      )}
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
};

// Basic styling
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  buttonContainer: {
    margin: '20px 0',
  },
  button: {
    margin: '0 10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  output: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#333',
  },
  transcribing: {
    marginTop: '10px',
    fontSize: '16px',
    color: '#555',
  },
  transcript: {
    marginTop: '20px',
    textAlign: 'left',
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '5px',
    wordWrap: 'break-word',
  },
  evaluation: {
    marginTop: '20px',
    textAlign: 'left',
    backgroundColor: '#e6ffe6',
    padding: '15px',
    borderRadius: '5px',
    wordWrap: 'break-word',
    border: '1px solid #b3ffb3',
  },
  error: {
    marginTop: '20px',
    color: 'red',
    fontWeight: 'bold',
  },
};

export default AudioRecorderWithTranscription;
