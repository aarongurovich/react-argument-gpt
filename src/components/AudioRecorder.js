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

  const audioRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = async () => {
    await startRecording(
      audioRecorderRef,
      mediaStreamRef,
      audioChunksRef,
      setOutput,
      setIsRecording,
      setError
    );
  };

  const handleStopRecording = async () => {
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
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setOutput('Processing uploaded audio file...');
      setIsTranscribing(true);
      try {
        await processAudioFile(
          file,
          setOutput,
          setTranscript,
          setEvaluation,
          setError
        );
      } catch (error) {
        setError(`Error processing audio file: ${error.message}`);
      } finally {
        setIsTranscribing(false);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Audio Recorder with Transcription and Evaluation</h2>
      <div style={styles.buttonContainer}>
        <button
          onClick={handleStartRecording}
          style={styles.button}
          disabled={isRecording || isTranscribing}
        >
          {isRecording ? 'Recording...' : 'Start Recording'}
        </button>
        <button
          onClick={handleStopRecording}
          style={styles.button}
          disabled={!isRecording}
        >
          Stop Recording
        </button>
      </div>
      <div style={styles.fileInputContainer}>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          style={styles.fileInput}
        />
      </div>
      <div id="output" style={styles.output}>
        {output}
      </div>
      {isTranscribing && (
        <div style={styles.transcribing}>Transcription in progress...</div>
      )}
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
      {evaluation && evaluation.scores && evaluation.scores['Speaker 1'] && evaluation.scores['Speaker 2'] ? (
        <div style={styles.evaluation}>
          <h3>Evaluation:</h3>
          <div style={styles.evaluationSection}>
            <h4>Scores:</h4>
            {['Speaker 1', 'Speaker 2'].map((speaker) => (
              <div key={speaker} style={styles.speakerSection}>
                <h5>{speaker}:</h5>
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
            <h4>Justifications:</h4>
            {['Speaker 1', 'Speaker 2'].map((speaker) => (
              <div key={speaker} style={styles.speakerSection}>
                <h5>{speaker}:</h5>
                <p>{evaluation.justifications[speaker]}</p>
              </div>
            ))}
          </div>
          <div style={styles.evaluationSection}>
            <h4>Summaries:</h4>
            {['Speaker 1', 'Speaker 2'].map((speaker) => (
              <div key={speaker} style={styles.speakerSection}>
                <h5>{speaker}:</h5>
                <p>{evaluation.summaries[speaker]}</p>
              </div>
            ))}
          </div>
          <div style={styles.winnerSection}>
            <h4>Winner:</h4>
            <p>{evaluation.winner}</p>
          </div>
        </div>
      ) : (
        evaluation && (
          <div style={styles.error}>Evaluation data is incomplete or missing.</div>
        )
      )}
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
};

export default AudioRecorderWithTranscription;
