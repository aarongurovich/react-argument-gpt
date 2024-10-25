import React, { useState, useRef } from 'react';
import axios from 'axios';

const AudioRecorderWithTranscription = () => {
  const [output, setOutput] = useState('');
  const [transcript, setTranscript] = useState('');
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
    setTranscript('');
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
          const transcriptionText = await pollTranscription(transcriptionId);

          setTranscript(transcriptionText);
          setOutput('Transcription completed! Now evaluating...');
          
          // Step 4: Evaluate transcription with OpenAI
          const evaluationResult = await evaluateTranscription(transcriptionText);
          setEvaluation(evaluationResult);
          setOutput('Evaluation completed!');
        } catch (transcriptionError) {
          console.error('Error:', transcriptionError);
          setError(`Error: ${transcriptionError.message}`);
          setOutput('');
        } finally {
          // Stop all media tracks to release the microphone
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
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
      const response = await axios.post('https://api.assemblyai.com/v2/transcript', {
        audio_url: audioUrl,
        speaker_labels: true, // Optional: Enable speaker labeling
        // Add other transcription options here
      }, {
        headers: {
          authorization: apiKey,
          'content-type': 'application/json',
        },
      });
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
          return response.data.text;
        } else if (status === 'error') {
          throw new Error(response.data.error);
        }

        // Wait for 3 seconds before polling again
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (pollError) {
        console.error('Polling Error:', pollError);
        throw new Error('Failed during transcription polling.');
      }
    }
  };

  // Function to evaluate transcription with OpenAI
  const evaluateTranscription = async (transcriptionText) => {
    const openAIApiKey = process.env.REACT_APP_OPENAI_API_KEY;

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not set. Please check your environment variables.');
    }

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4", // Ensure the model name is correct
        messages: [
          { 
            role: "system", 
            content: "You are the impartial judge of a debate between two participants. Your task is to declare the winner based on specific categories. The categories are: (1) Argument strength, (2) Clarity of communication, (3) Use of evidence/examples, (4) Rebuttal effectiveness, and (5) Overall persuasiveness. Assign a score from 1 to 10 for each participant in each category, then declare the winner based on their overall performance. Please remain unbiased and judge solely on the skills displayed in each category." 
          },
          {
            role: "user",
            content: transcriptionText,
          },
        ],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}`,
        },
      });

      const object1 = response.data.choices[0].message;
      let answer = object1.content;
      return answer;
    } catch (openAIError) {
      console.error('OpenAI Error:', openAIError);
      throw new Error('Failed to evaluate transcription with OpenAI.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Audio Recorder with Transcription and Evaluation</h2>
      <div style={styles.buttonContainer}>
        <button onClick={startRecording} style={styles.button} disabled={isRecording || isTranscribing}>
          {isRecording ? 'Recording...' : 'Start Recording'}
        </button>
        <button
          onClick={stopRecording}
          style={styles.button}
          disabled={!isRecording}
        >
          Stop Recording
        </button>
      </div>
      <div id="output" style={styles.output}>
        {output}
      </div>
      {isTranscribing && (
        <div style={styles.transcribing}>
          Transcription in progress...
        </div>
      )}
      {transcript && (
        <div style={styles.transcript}>
          <h3>Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}
      {evaluation && (
        <div style={styles.evaluation}>
          <h3>Evaluation:</h3>
          <p>{evaluation}</p>
        </div>
      )}
      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}
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
