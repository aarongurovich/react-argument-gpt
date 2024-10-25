import {
    uploadAudio,
    requestTranscription,
    pollTranscription,
  } from '../services/assemblyAIService';
  import { evaluateTranscription } from '../services/openAIService';
  import { separateSpeakers } from './separateSpeakers';
  
  export const startRecording = async (
    audioRecorderRef,
    mediaStreamRef,
    audioChunksRef,
    setOutput,
    setIsRecording,
    setError
  ) => {
    audioChunksRef.current = [];
    setError(null);
    setOutput('Requesting microphone access...');
    setIsRecording(true);
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
  
      let options = { mimeType: 'audio/webm;codecs=opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'audio/ogg;codecs=opus' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: '' };
        }
      }
  
      const recorder = new MediaRecorder(stream, options);
      audioRecorderRef.current = recorder;
  
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
  
      recorder.onstart = () => {
        setOutput('Recording started! Speak now.');
      };
  
      recorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Error accessing microphone. Please check your permissions.');
      setOutput('');
      setIsRecording(false);
    }
  };
  
  export const stopRecording = async (
    audioRecorderRef,
    mediaStreamRef,
    audioChunksRef,
    setOutput,
    setIsRecording,
    setIsTranscribing,
    setTranscript,
    setEvaluation,
    setError
  ) => {
    if (audioRecorderRef.current && audioRecorderRef.current.state !== 'inactive') {
      audioRecorderRef.current.stop();
      setOutput('Recording stopped! Preparing transcription...');
      setIsRecording(false);
  
      const blob = new Blob(audioChunksRef.current, {
        type: audioRecorderRef.current.mimeType,
      });
  
      if (blob.size === 0) {
        setOutput('Recording failed: No audio data captured.');
        return;
      }
  
      try {
        setIsTranscribing(true);
        setOutput('Uploading audio for transcription...');
        const uploadUrl = await uploadAudio(blob);
  
        setOutput('Requesting transcription...');
        const transcriptionId = await requestTranscription(uploadUrl);
  
        setOutput('Transcribing... Please wait.');
        const transcriptionResult = await pollTranscription(transcriptionId);
  
        const { utterances } = transcriptionResult;
  
        // Process utterances to separate speakers
        const separatedTranscripts = separateSpeakers(utterances);
  
        setTranscript(separatedTranscripts);
        setOutput('Transcription completed! Now evaluating...');
  
        // Evaluate transcription with OpenAI using separated transcripts
        const evaluationResult = await evaluateTranscription(
          separatedTranscripts.speaker1 || '',
          separatedTranscripts.speaker2 || ''
        );
        setEvaluation(evaluationResult);
        setOutput('Evaluation completed!');
      } catch (error) {
        console.error('Error:', error);
        setError(`Error: ${error.message}`);
        setOutput('');
      } finally {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        setIsTranscribing(false);
      }
    }
  };
  
  
  export const processAudioFile = async (
    file,
    setOutput,
    setTranscript,
    setEvaluation,
    setError
  ) => {
    try {
      setOutput('Uploading audio for transcription...');
      const uploadUrl = await uploadAudio(file);
  
      setOutput('Requesting transcription...');
      const transcriptionId = await requestTranscription(uploadUrl);
  
      setOutput('Transcribing... Please wait.');
      const transcriptionResult = await pollTranscription(transcriptionId);
  
      // Log the transcription result to understand its structure
      console.log('Transcription Result:', transcriptionResult);
  
      const { utterances } = transcriptionResult;
  
      // Process utterances to separate speakers
      const separatedTranscripts = separateSpeakers(utterances);
  
      // Log separated transcripts for debugging
      console.log('Separated Transcripts:', separatedTranscripts);
  
      // Ensure at least one transcript contains data before setting
      if (separatedTranscripts.speaker1 || separatedTranscripts.speaker2) {
        setTranscript(separatedTranscripts);
        setOutput('Transcription completed! Now evaluating...');
        
        const evaluationResult = await evaluateTranscription(
          separatedTranscripts.speaker1 || '',
          separatedTranscripts.speaker2 || ''
        );
        setEvaluation(evaluationResult);
        setOutput('Evaluation completed!');
      } else {
        throw new Error('No speech detected from speakers.');
      }
    } catch (error) {
      console.error('Error processing audio file:', error);
      setError(`Error processing audio file: ${error.message}`);
      setOutput('');
    }
  };