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
  const hiddenFileInputRef = useRef(null);

  const handleStartRecording = async () => {
    console.log('Start Recording Clicked');
    setError(null);
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
    hiddenFileInputRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      setSelectedFileName(file.name);
      setOutput('Processing uploaded audio file...');
      setIsTranscribing(true);
      setError(null);
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

  const getButtonStyle = (baseStyle, hoverStyle, disabled = false) => {
    if (disabled) {
      return { ...styles.button, ...baseStyle, ...styles.disabledButton };
    }
    return { ...styles.button, ...baseStyle };
  };

  const renderScoreItem = (label, value) => (
    <div style={styles.scoreItem}>
      <span style={styles.scoreLabel}>{label}</span>
      <span style={styles.scoreValue}>{value}</span>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      <div style={styles.mainCard}>
        <div style={styles.cardGlow}></div>
        <h1 style={styles.header}>Argumate AI</h1>
        <p style={styles.subtitle}>AI-Powered Debate Analysis</p>
        
        <div style={styles.controlsSection}>
          <div style={styles.recordingControls}>
            <button
              onClick={handleStartRecording}
              style={getButtonStyle(styles.primaryButton, styles.primaryButtonHover, isRecording || isTranscribing)}
              disabled={isRecording || isTranscribing}
              onMouseEnter={(e) => {
                if (!isRecording && !isTranscribing) {
                  Object.assign(e.target.style, styles.primaryButtonHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isRecording && !isTranscribing) {
                  Object.assign(e.target.style, getButtonStyle(styles.primaryButton));
                }
              }}
            >
              <span style={styles.buttonIcon}>🎤</span>
              Start Recording
            </button>
            
            <button
              onClick={handleStopRecording}
              style={getButtonStyle(styles.secondaryButton, styles.secondaryButtonHover, !isRecording)}
              disabled={!isRecording}
              onMouseEnter={(e) => {
                if (isRecording) {
                  Object.assign(e.target.style, styles.secondaryButtonHover);
                }
              }}
              onMouseLeave={(e) => {
                if (isRecording) {
                  Object.assign(e.target.style, getButtonStyle(styles.secondaryButton));
                }
              }}
            >
              <span style={styles.buttonIcon}>⏹️</span>
              Stop Recording
            </button>
          </div>

          <div style={selectedFileName ? { ...styles.fileUploadSection, ...styles.fileUploadSectionActive } : styles.fileUploadSection}>
            <input
              type="file"
              accept="audio/*"
              ref={hiddenFileInputRef}
              style={styles.hiddenFileInput}
              onChange={handleFileUpload}
            />
            
            <button
              onClick={handleFileUploadClick}
              style={getButtonStyle(styles.tertiaryButton, styles.tertiaryButtonHover, isTranscribing)}
              disabled={isTranscribing}
              onMouseEnter={(e) => {
                if (!isTranscribing) {
                  Object.assign(e.target.style, styles.tertiaryButtonHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isTranscribing) {
                  Object.assign(e.target.style, getButtonStyle(styles.tertiaryButton));
                }
              }}
            >
              <span style={styles.buttonIcon}>📁</span>
              Choose Audio File
            </button>
            
            {selectedFileName && (
              <div style={styles.fileLabel}>
                <span>📄</span>
                {selectedFileName}
              </div>
            )}
          </div>
        </div>

        {(output || isTranscribing) && (
          <div style={styles.statusCard}>
            {isTranscribing ? (
              <div style={styles.loadingIndicator}>
                <div style={styles.spinner}></div>
                <span>Processing audio and analyzing arguments...</span>
              </div>
            ) : (
              <p style={styles.statusText}>{output}</p>
            )}
          </div>
        )}

        {(transcript.speaker1 || transcript.speaker2) && (
          <div style={styles.transcriptSection}>
            {transcript.speaker1 && (
              <div style={styles.transcriptCard}>
                <div style={styles.transcriptCardGlow}></div>
                <h3 style={styles.transcriptHeader}>
                  <span>👤</span>
                  Speaker 1
                </h3>
                <p style={styles.transcriptText}>{transcript.speaker1}</p>
              </div>
            )}
            
            {transcript.speaker2 && (
              <div style={styles.transcriptCard}>
                <div style={styles.transcriptCardGlow}></div>
                <h3 style={styles.transcriptHeader}>
                  <span>👥</span>
                  Speaker 2
                </h3>
                <p style={styles.transcriptText}>{transcript.speaker2}</p>
              </div>
            )}
          </div>
        )}

        {evaluation && evaluation.scores && evaluation.scores['Speaker 1'] && evaluation.scores['Speaker 2'] && (
          <div style={styles.evaluationSection}>
            <div style={styles.evaluationGlow}></div>
            <h2 style={styles.evaluationHeader}>🔥 The Roast Report</h2>
            
            <div style={styles.scoresGrid}>
              {['Speaker 1', 'Speaker 2'].map((speaker) => (
                <div key={speaker} style={styles.speakerCard}>
                  <h4 style={styles.speakerHeader}>
                    <span>{speaker === 'Speaker 1' ? '👤' : '👥'}</span>
                    {speaker}
                  </h4>
                  <div style={styles.scoresList}>
                    {Object.entries(evaluation.scores[speaker])
                      .filter(([key]) => key !== 'Overall Score')
                      .map(([criteria, score]) => renderScoreItem(criteria, score))}
                    {renderScoreItem('Overall Score', evaluation.scores[speaker]['Overall Score'])}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.summarySection}>
              {['Speaker 1', 'Speaker 2'].map((speaker) => (
                <div key={speaker} style={styles.summaryCard}>
                  <h4 style={styles.speakerHeader}>
                    <span>{speaker === 'Speaker 1' ? '📝' : '📋'}</span>
                    {speaker} Analysis
                  </h4>
                  <p style={styles.summaryText}>
                    <strong>Summary:</strong> {evaluation.summaries[speaker]}
                  </p>
                  <br />
                  <p style={styles.summaryText}>
                    <strong>Justification:</strong> {evaluation.justifications[speaker]}
                  </p>
                </div>
              ))}
            </div>

            <div style={styles.winnerBanner}>
              <div style={styles.winnerBannerGlow}></div>
              <h3 style={styles.winnerText}>
                <span>🏆</span>
                Winner: {evaluation.winner}
                <span>🎉</span>
              </h3>
            </div>
          </div>
        )}

        {error && (
          <div style={styles.errorCard}>
            <p style={styles.errorText}>
              <span>⚠️</span>
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorderWithTranscription;