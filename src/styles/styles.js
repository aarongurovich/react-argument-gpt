const styles = {
  container: {
    fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    overflow: 'hidden',
  },

  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(78, 205, 196, 0.05) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  },
  
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(40px)',
    borderRadius: '32px',
    padding: '4rem',
    maxWidth: '1000px',
    width: '100%',
    boxShadow: `
      0 32px 64px -12px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
  },

  cardGlow: {
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    background: 'linear-gradient(135deg, #7877c6, #ff6b6b, #4ecdc4)',
    borderRadius: '34px',
    zIndex: -1,
    opacity: 0.6,
    filter: 'blur(8px)',
  },

  header: {
    fontSize: '4rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    marginBottom: '0.5rem',
    letterSpacing: '-0.03em',
    lineHeight: '1.1',
    textShadow: '0 0 30px rgba(102, 126, 234, 0.3)',
  },

  subtitle: {
    fontSize: '1.5rem',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '4rem',
    fontWeight: '500',
    lineHeight: '1.6',
    opacity: 0.8,
  },

  controlsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
    marginBottom: '3rem',
  },

  recordingControls: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '1.25rem 2.5rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: '180px',
    position: 'relative',
    overflow: 'hidden',
    textDecoration: 'none',
    userSelect: 'none',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },

  buttonIcon: {
    fontSize: '1.25rem',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
  },

  primaryButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
  },

  primaryButtonHover: {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 12px 40px rgba(16, 185, 129, 0.5)',
  },

  secondaryButton: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
  },

  secondaryButtonHover: {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 12px 40px rgba(239, 68, 68, 0.5)',
  },

  tertiaryButton: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white',
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
  },

  tertiaryButtonHover: {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
  },

  disabledButton: {
    background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
    color: '#9ca3af',
    cursor: 'not-allowed',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    transform: 'none',
  },

  fileUploadSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '3rem',
    border: '3px dashed #d1d5db',
    borderRadius: '24px',
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },

  fileUploadSectionActive: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    transform: 'scale(1.02)',
  },

  hiddenFileInput: {
    display: 'none',
  },

  fileLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#374151',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '500',
    maxWidth: '400px',
    wordBreak: 'break-all',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },

  statusCard: {
    backgroundColor: 'rgba(248, 250, 252, 0.9)',
    border: '1px solid rgba(226, 232, 240, 0.5)',
    borderRadius: '20px',
    padding: '2rem',
    marginTop: '3rem',
    position: 'relative',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  },

  statusText: {
    fontSize: '1.1rem',
    color: '#475569',
    textAlign: 'center',
    margin: 0,
    lineHeight: '1.6',
    fontWeight: '500',
  },

  loadingIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    color: '#8b5cf6',
    fontSize: '1.1rem',
    fontWeight: '600',
  },

  spinner: {
    width: '24px',
    height: '24px',
    border: '3px solid rgba(139, 92, 246, 0.2)',
    borderTop: '3px solid #8b5cf6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  transcriptSection: {
    marginTop: '3rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },

  transcriptCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(226, 232, 240, 0.5)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden',
  },

  transcriptCardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
    borderRadius: '20px 20px 0 0',
  },

  transcriptHeader: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },

  transcriptText: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#475569',
    margin: 0,
    fontWeight: '400',
  },

  evaluationSection: {
    marginTop: '3rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(226, 232, 240, 0.5)',
    borderRadius: '24px',
    padding: '3rem',
    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.12)',
    backdropFilter: 'blur(20px)',
    position: 'relative',
    overflow: 'hidden',
  },

  evaluationGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #10b981, #8b5cf6, #ef4444)',
    borderRadius: '24px 24px 0 0',
  },

  evaluationHeader: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '3rem',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  scoresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2.5rem',
    marginBottom: '3rem',
  },

  speakerCard: {
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    border: '1px solid rgba(226, 232, 240, 0.5)',
    borderRadius: '20px',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
  },

  speakerHeader: {
    fontSize: '1.375rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },

  scoresList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  scoreItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
  },

  scoreLabel: {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: '500',
  },

  scoreValue: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1e293b',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '0.5rem 1rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },

  summarySection: {
    marginTop: '3rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },

  summaryCard: {
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    border: '1px solid rgba(226, 232, 240, 0.5)',
    borderRadius: '20px',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
  },

  summaryText: {
    fontSize: '1rem',
    lineHeight: '1.7',
    color: '#475569',
    margin: 0,
    fontWeight: '400',
  },

  winnerBanner: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    color: 'white',
    padding: '2.5rem',
    borderRadius: '24px',
    textAlign: 'center',
    marginTop: '3rem',
    boxShadow: '0 16px 64px rgba(16, 185, 129, 0.4)',
    position: 'relative',
    overflow: 'hidden',
  },

  winnerBannerGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    animation: 'rotate 20s linear infinite',
  },

  winnerText: {
    fontSize: '2rem',
    fontWeight: '800',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    position: 'relative',
    zIndex: 1,
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },

  errorCard: {
    backgroundColor: 'rgba(254, 242, 242, 0.95)',
    border: '1px solid rgba(254, 202, 202, 0.5)',
    borderRadius: '20px',
    padding: '2rem',
    marginTop: '3rem',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)',
  },

  errorText: {
    color: '#dc2626',
    fontSize: '1.1rem',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontWeight: '600',
  },

  // Responsive design
  '@media (max-width: 768px)': {
    container: {
      padding: '1rem',
    },
    mainCard: {
      padding: '2.5rem',
      borderRadius: '24px',
    },
    header: {
      fontSize: '3rem',
    },
    subtitle: {
      fontSize: '1.25rem',
    },
    recordingControls: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    button: {
      width: '100%',
      maxWidth: '300px',
    },
    scoresGrid: {
      gridTemplateColumns: '1fr',
    },
    summarySection: {
      gridTemplateColumns: '1fr',
    },
  },

  '@media (max-width: 480px)': {
    mainCard: {
      padding: '2rem',
    },
    header: {
      fontSize: '2.5rem',
    },
    controlsSection: {
      gap: '2rem',
    },
    fileUploadSection: {
      padding: '2rem',
    },
  },

  // Keyframe animations
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },

  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },

  '@keyframes pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.8 },
  },
};

export default styles;