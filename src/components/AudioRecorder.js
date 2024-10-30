import React, { useState, useRef } from 'react';
import { startRecording, stopRecording, processAudioFile } from '../utils/AudioUtils';
import styles from '../styles/styles';

const AudioRecorderWithTranscription = () => {
  const [output, setOutput] = useState('');
  const [transcript, setTranscript] = useState({ speaker1: '', speaker2: '' });
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  const audioRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const hiddenFileInputRef = useRef(null); // Reference to the hidden file input

  const handleStartRecording = async () => {
    console.log('Start Recording Clicked');
    setError(null); // Clear any existing errors
    setOutput('Recording started...');
    setIsRecording(true);
    try {
      await startRecording(
        audioRecorderRef,
        mediaStreamRef,
        audioChunksRef,
        setOutput,
        setIsRecording,
        setError
      );
    } catch (err) {
      console.error('Error during recording:', err);
      setError('Failed to start recording.');
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    console.log('Stop Recording Clicked');
    try {
      await stopRecording(
        audioRecorderRef,
        mediaStreamRef,
        audioChunksRef,
        setOutput,
        setIsRecording,
        setIsTranscribing,
        setTranscript,
        setEvaluation,
        setError
      );
      console.log('Recording stopped');
    } catch (err) {
      console.error('Error during stopping recording:', err);
      setError('Failed to stop recording.');
    }
  };

  const handleFileUploadClick = () => {
    console.log('Choose File Clicked');
    hiddenFileInputRef.current.click(); // Trigger the hidden file input
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      setSelectedFileName(file.name); // Update the selected file name
      setOutput('Processing uploaded audio file...');
      setIsTranscribing(true);
      setError(null); // Clear any existing errors
      try {
        await processAudioFile(
          file,
          setOutput,
          setTranscript,
          setEvaluation,
          setError
        );
        console.log('File processed successfully');
      } catch (error) {
        console.error('Error processing audio file:', error);
        setError(`Error processing audio file: ${error.message}`);
      } finally {
        setIsTranscribing(false);
        console.log('Transcribing state set to false');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Argumate AI</h2> {/* Updated Title */}
      <h3>“Winning Arguments, the High-Tech Way”</h3>
      
      <div style={styles.buttonContainer}>
        <button
          onClick={handleStartRecording}
          style={styles.button}
          disabled={isRecording || isTranscribing}
        >
          🎤 Start Recording
        </button>
        <button
          onClick={handleStopRecording}
          style={styles.button}
          disabled={!isRecording}
        >
          🛑 Stop Recording
        </button>
      </div>

      <div style={styles.fileInputContainer}>
        {/* Hidden File Input */}
        <input
          type="file"
          accept="audio/*"
          ref={hiddenFileInputRef}
          style={styles.hiddenFileInput}
          onChange={handleFileUpload}
        />
        {/* Custom File Input Button */}
        <button
          onClick={handleFileUploadClick}
          style={styles.fileInputButton}
        >
          📁 Choose File
        </button>
        {/* Display Selected File Name */}
        {selectedFileName && (
          <div style={styles.fileInputLabel}>
            {selectedFileName}
          </div>
        )}
      </div>

      <div id="output" style={styles.output}>
        {output}
      </div>
      
      {isTranscribing && (
        <div style={styles.transcribing}>🕒 Transcription in progress...</div>
      )}

      {transcript.speaker1 && (
        <div style={styles.transcript}>
          <h3 style={styles.transcriptHeader}>Speaker 1:</h3>
          <p>{transcript.speaker1}</p>
        </div>
      )}
      {transcript.speaker2 && (
        <div style={styles.transcript}>
          <h3 style={styles.transcriptHeader}>Speaker 2:</h3>
          <p>{transcript.speaker2}</p>
        </div>
      )}

      {evaluation && evaluation.scores && evaluation.scores['Speaker 1'] && evaluation.scores['Speaker 2'] ? (
        <div style={styles.evaluation}>
          <h3 style={styles.evaluationHeader}>Evaluation:</h3>
          <div style={styles.evaluationSection}>
            <h2>Scores:</h2>
            {['Speaker 1', 'Speaker 2'].map((speaker) => (
              <div key={speaker} style={styles.speakerSection}>
                <h5 style={styles.speakerHeader}>{speaker}:</h5>
                <ul>
                  {Object.entries(evaluation.scores[speaker]).map(
                    ([criteria, score]) => (
                      <li key={criteria}>
                        <strong>{criteria}:</strong> {score}
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
          <div style={styles.evaluationSection}>
            <h2>Justifications:</h2>
            {['Speaker 1', 'Speaker 2'].map((speaker) => (
              <div key={speaker} style={styles.speakerSection}>
                <h5 style={styles.speakerHeader}>{speaker}:</h5>
                <p>{evaluation.justifications[speaker]}</p>
              </div>
            ))}
          </div>
          <div style={styles.evaluationSection}>
            <h2>Summaries:</h2>
            {['Speaker 1', 'Speaker 2'].map((speaker) => (
              <div key={speaker} style={styles.speakerSection}>
                <h5 style={styles.speakerHeader}>{speaker}:</h5>
                <p>{evaluation.summaries[speaker]}</p>
              </div>
            ))}
          </div>
          <div style={styles.evaluationSection}>
            <h2>Overall Scores:</h2>
            {['Speaker 1', 'Speaker 2'].map((speaker) => (
              <div key={speaker} style={styles.speakerSection}>
                <h5 style={styles.speakerHeader}>{speaker}:</h5>
                <p><strong>Overall Score:</strong> {evaluation.scores[speaker]['Overall Score']}</p>
              </div>
            ))}
          </div>
          <div style={styles.winnerSection}>
            🏆 <strong>Winner:</strong> {evaluation.winner}
          </div>
        </div>
      ) : (
        evaluation && (
          <div style={styles.error}>❗ Evaluation data is incomplete or missing.</div>
        )
      )}

      {error && <div style={styles.error}>❌ {error}</div>}
    </div>
  );
};

export default AudioRecorderWithTranscription;
