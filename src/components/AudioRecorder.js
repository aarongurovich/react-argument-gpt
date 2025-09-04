import React, { useState, useRef } from 'react';
import { startRecording, stopRecording, processAudioFile } from '../utils/AudioUtils';
import styles from '../styles/styles'; // Assuming styles are adapted for this new layout

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

  const clearState = () => {
    setOutput('');
    setTranscript({ speaker1: '', speaker2: '' });
    setEvaluation(null);
    setError(null);
    setSelectedFileName('');
  };

  const handleStartRecording = async () => {
    clearState();
    setOutput('Recording started...');
    setIsRecording(true);
    try {
      await startRecording(audioRecorderRef, mediaStreamRef, audioChunksRef, setOutput, setIsRecording, setError);
    } catch (err) {
      setError('Failed to start recording.');
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopRecording(audioRecorderRef, mediaStreamRef, audioChunksRef, setOutput, setIsRecording, setIsTranscribing, setTranscript, setEvaluation, setError);
    } catch (err) {
      setError('Failed to stop recording.');
    }
  };

  const handleFileUploadClick = () => {
    hiddenFileInputRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      clearState();
      setSelectedFileName(file.name);
      setOutput('Processing uploaded audio file...');
      setIsTranscribing(true);
      try {
        await processAudioFile(file, setOutput, setTranscript, setEvaluation, setError);
      } catch (err) {
        setError(`Error processing audio file: ${err.message}`);
      } finally {
        setIsTranscribing(false);
      }
    }
  };

  const getButtonStyle = (baseStyle, hoverStyle, disabled = false) => {
    return disabled ? { ...styles.button, ...baseStyle, ...styles.disabledButton } : { ...styles.button, ...baseStyle };
  };

  const renderScoreItem = (label, value) => (
    <div key={label} style={styles.scoreItem}>
      <span style={styles.scoreLabel}>{label.replace(/_/g, ' ')}</span>
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
        
        {/* --- Controls Section (Unchanged) --- */}
        <div style={styles.controlsSection}>
          <div style={styles.recordingControls}>
             <button onClick={handleStartRecording} disabled={isRecording || isTranscribing} style={getButtonStyle(styles.primaryButton, styles.primaryButtonHover, isRecording || isTranscribing)}>
                <span style={styles.buttonIcon}>🎤</span> Start Recording
            </button>
            <button onClick={handleStopRecording} disabled={!isRecording} style={getButtonStyle(styles.secondaryButton, styles.secondaryButtonHover, !isRecording)}>
                <span style={styles.buttonIcon}>⏹️</span> Stop Recording
            </button>
          </div>
          <div style={selectedFileName ? { ...styles.fileUploadSection, ...styles.fileUploadSectionActive } : styles.fileUploadSection}>
            <input type="file" accept="audio/*" ref={hiddenFileInputRef} style={styles.hiddenFileInput} onChange={handleFileUpload} />
            <button onClick={handleFileUploadClick} disabled={isTranscribing} style={getButtonStyle(styles.tertiaryButton, styles.tertiaryButtonHover, isTranscribing)}>
                <span style={styles.buttonIcon}>📁</span> Choose Audio File
            </button>
            {selectedFileName && <div style={styles.fileLabel}><span>📄</span>{selectedFileName}</div>}
          </div>
        </div>

        {/* --- Status & Transcript Sections (Unchanged) --- */}
        {(output || isTranscribing) && (
          <div style={styles.statusCard}>
            {isTranscribing ? (
              <div style={styles.loadingIndicator}><div style={styles.spinner}></div><span>Processing audio and analyzing arguments...</span></div>
            ) : (<p style={styles.statusText}>{output}</p>)}
          </div>
        )}
        {(transcript.speaker1 || transcript.speaker2) && (
          <div style={styles.transcriptSection}>
            {transcript.speaker1 && <div style={styles.transcriptCard}><div style={styles.transcriptCardGlow}></div><h3 style={styles.transcriptHeader}><span>👤</span>Speaker 1</h3><p style={styles.transcriptText}>{transcript.speaker1}</p></div>}
            {transcript.speaker2 && <div style={styles.transcriptCard}><div style={styles.transcriptCardGlow}></div><h3 style={styles.transcriptHeader}><span>👥</span>Speaker 2</h3><p style={styles.transcriptText}>{transcript.speaker2}</p></div>}
          </div>
        )}

        {/* --- ✅ NEW, SERIOUS EVALUATION SECTION --- */}
        {evaluation && evaluation.performance_scores && (
          <div style={styles.evaluationSection}>
            <div style={styles.evaluationGlow}></div>
            <h2 style={styles.evaluationHeader}>Debate Analysis Report</h2>

            {evaluation.overall_assessment && (
              <div style={styles.subsectionCard}>
                <h3 style={styles.speakerHeader}>Overall Assessment</h3>
                <p style={styles.summaryText}>{evaluation.overall_assessment}</p>
              </div>
            )}
            
            <h3 style={styles.sectionTitle}>Performance Metrics</h3>
            <div style={styles.scoresGrid}>
              {['Speaker 1', 'Speaker 2'].map((speaker) => (
                <div key={speaker} style={styles.speakerCard}>
                  <h4 style={styles.speakerHeader}><span>{speaker === 'Speaker 1' ? '👤' : '👥'}</span>{speaker}</h4>
                  <div style={styles.scoresList}>
                    {Object.entries(evaluation.performance_scores[speaker]).map(([criteria, score]) => renderScoreItem(criteria, score))}
                  </div>
                </div>
              ))}
            </div>
            
            <h3 style={styles.sectionTitle}>Detailed Analysis</h3>
            <div style={styles.analysisGrid}>
              {['Speaker 1', 'Speaker 2'].map((speaker) => (
                <div key={speaker} style={styles.summaryCard}>
                    <h4 style={styles.speakerHeader}><span>{speaker === 'Speaker 1' ? '👤' : '👥'}</span>Analysis of {speaker}</h4>
                    <div style={styles.analysisCategory}>
                        <strong>Strengths:</strong>
                        <ul>{evaluation.detailed_analysis[speaker].strengths.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    </div>
                    <div style={styles.analysisCategory}>
                        <strong>Weaknesses:</strong>
                        <ul>{evaluation.detailed_analysis[speaker].weaknesses.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    </div>
                    {evaluation.detailed_analysis[speaker].logical_fallacies.length > 0 && (
                        <div style={styles.analysisCategory}>
                            <strong>Logical Fallacies Identified:</strong>
                            {evaluation.detailed_analysis[speaker].logical_fallacies.map((fallacy, i) => (
                                <div key={i} style={styles.fallacyCard}>
                                    <strong>{fallacy.fallacy}:</strong> "{fallacy.quote}"
                                    <p><em>Explanation: {fallacy.explanation}</em></p>
                                </div>
                            ))}
                        </div>
                    )}
                    <div style={styles.analysisCategory}>
                        <strong>Pivotal Moments:</strong>
                        <ul>{evaluation.detailed_analysis[speaker].pivotal_moments.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    </div>
                </div>
              ))}
            </div>

            {evaluation.strategic_recommendations && (
              <div style={styles.subsectionCard}>
                <h3 style={styles.speakerHeader}>Strategic Recommendations</h3>
                <p style={styles.summaryText}><strong>For Speaker 1:</strong> {evaluation.strategic_recommendations.speaker_1}</p>
                <p style={styles.summaryText}><strong>For Speaker 2:</strong> {evaluation.strategic_recommendations.speaker_2}</p>
              </div>
            )}
            
            {evaluation.verdict_and_rationale && (
                <div style={styles.verdictSection}>
                    <h3 style={styles.sectionTitle}>Final Verdict</h3>
                    <div style={styles.winnerBanner}>
                        <div style={styles.winnerBannerGlow}></div>
                        <h3 style={styles.winnerText}><span>🏆</span>Winner: {evaluation.verdict_and_rationale.winner}<span>🎉</span></h3>
                    </div>
                    <div style={styles.rationaleCard}>
                        <h4 style={styles.speakerHeader}>Rationale</h4>
                        <p style={styles.summaryText}>{evaluation.verdict_and_rationale.rationale}</p>
                    </div>
                </div>
            )}
          </div>
        )}

        {error && <div style={styles.errorCard}><p style={styles.errorText}><span>⚠️</span>{error}</p></div>}
      </div>
    </div>
  );
};

export default AudioRecorderWithTranscription;