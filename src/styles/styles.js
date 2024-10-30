const styles = {
  container: {
    fontFamily: `'Bubblegum Sans', cursive`, // Bubbly font for body text
    textAlign: 'center',
    padding: '30px',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#FFF9C4', // Light yellow background
    border: '4px dashed #FF5722', // Dashed border for a playful look
    borderRadius: '15px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    // Responsive adjustments
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    fontFamily: `'Fredoka One', cursive`, // Bubbly font for headers
    fontSize: '3em',
    color: '#FF5722', // Vibrant orange color
    textShadow: '2px 2px #FFC107',
    marginBottom: '20px',
  },
  buttonContainer: {
    margin: '25px 0',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px', // Added for consistent spacing between buttons
    width: '100%', // Ensures buttons utilize available space
  },
  button: {
    margin: '0', // Removed margin to use gap from container
    padding: '12px 25px',
    fontSize: '18px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50', // Bright green
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    boxShadow: '0 4px #388E3C',
    transition: 'all 0.3s ease',
    minWidth: '150px',
    maxWidth: '250px', // Prevents buttons from becoming too wide on large screens
    textAlign: 'center',
    flex: '1 1 150px', // Allows buttons to grow and shrink with a base width
  },
  fileInputContainer: {
    margin: '25px 0',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  hiddenFileInput: {
    display: 'none', // Hides the actual file input
  },
  fileInputButton: {
    padding: '12px 25px',
    fontSize: '18px',
    cursor: 'pointer',
    backgroundColor: '#FF9800', // Bright orange
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    boxShadow: '0 4px #F57C00',
    transition: 'all 0.3s ease',
    minWidth: '150px',
    maxWidth: '250px',
    textAlign: 'center',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInputLabel: {
    fontSize: '16px',
    color: '#333',
    backgroundColor: '#FFF3E0',
    padding: '8px 15px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '80%',
    maxWidth: '400px',
    textAlign: 'center',
    wordWrap: 'break-word',
  },
  output: {
    marginTop: '25px',
    fontSize: '20px',
    color: '#333',
    backgroundColor: '#E1F5FE',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: 'inset 0 0 10px #81D4FA',
    border: '2px solid #0288D1',
    wordWrap: 'break-word',
    width: '90%',
    maxWidth: '800px',
  },
  transcribing: {
    marginTop: '15px',
    fontSize: '18px',
    color: '#D84315',
    fontWeight: 'bold',
    animation: 'bounce 2s infinite',
  },
  transcript: {
    marginTop: '25px',
    textAlign: 'left',
    backgroundColor: '#FFFDE7',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '2px solid #FFEB3B',
    position: 'relative',
    width: '90%',
    maxWidth: '800px',
    overflowX: 'auto',
  },
  transcriptHeader: {
    fontFamily: `'Fredoka One', cursive`,
    fontSize: '1.8em',
    color: '#F57F17',
    marginBottom: '10px',
    textShadow: '1px 1px #FFF176',
  },
  evaluation: {
    marginTop: '25px',
    textAlign: 'left',
    backgroundColor: '#F1F8E9',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '2px solid #8BC34A',
    position: 'relative',
    width: '90%',
    maxWidth: '800px',
    overflowX: 'auto',
  },
  evaluationHeader: {
    fontFamily: `'Fredoka One', cursive`,
    fontSize: '2em',
    color: '#33691E',
    marginBottom: '15px',
    textShadow: '1px 1px #AED581',
  },
  evaluationSection: {
    marginTop: '20px',
  },
  speakerSection: {
    marginBottom: '15px',
  },
  speakerHeader: {
    fontFamily: `'Fredoka One', cursive`,
    fontSize: '1.3em',
    color: '#D32F2F',
    marginBottom: '8px',
    textShadow: '1px 1px #FFCDD2',
  },
  winnerSection: {
    marginTop: '25px',
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#1976D2',
    textShadow: '2px 2px #BBDEFB',
  },
  error: {
    marginTop: '25px',
    color: '#C62828',
    fontWeight: 'bold',
    backgroundColor: '#FFEBEE',
    padding: '15px',
    borderRadius: '10px',
    border: '2px solid #B71C1C',
    width: '90%',
    maxWidth: '800px',
    wordWrap: 'break-word',
  },
  // Keyframes for animations
  '@keyframes bounce': {
    '0%, 100%': {
      transform: 'translateY(0)',
    },
    '50%': {
      transform: 'translateY(-10px)',
    },
  },
  // Media Queries for Responsiveness
  '@media (max-width: 768px)': {
    container: {
      padding: '20px',
    },
    header: {
      fontSize: '2.5em',
    },
    button: {
      fontSize: '16px',
      padding: '10px 20px',
      minWidth: '120px',
      maxWidth: '200px',
    },
    fileInputButton: {
      fontSize: '16px',
      padding: '10px 20px',
      minWidth: '120px',
      maxWidth: '200px',
    },
    fileInputLabel: {
      fontSize: '16px',
      padding: '8px 15px',
    },
    output: {
      fontSize: '18px',
      padding: '15px',
    },
    transcriptHeader: {
      fontSize: '1.5em',
    },
    evaluationHeader: {
      fontSize: '1.8em',
    },
    speakerHeader: {
      fontSize: '1.1em',
    },
    winnerSection: {
      fontSize: '1.8em',
    },
  },
  '@media (max-width: 480px)': {
    container: {
      padding: '15px',
    },
    header: {
      fontSize: '2em',
    },
    buttonContainer: {
      flexDirection: 'column', // Stack buttons vertically on small screens
      gap: '10px',
    },
    button: {
      fontSize: '14px',
      padding: '8px 16px',
      minWidth: '100px',
      maxWidth: '150px',
      width: '100%', // Make buttons full width on very small screens
    },
    fileInputButton: {
      fontSize: '14px',
      padding: '8px 16px',
      minWidth: '100px',
      maxWidth: '150px',
      width: '100%', // Make buttons full width on very small screens
    },
    fileInputLabel: {
      fontSize: '14px',
      padding: '6px 12px',
    },
    output: {
      fontSize: '16px',
      padding: '10px',
    },
    transcriptHeader: {
      fontSize: '1.3em',
    },
    evaluationHeader: {
      fontSize: '1.6em',
    },
    speakerHeader: {
      fontSize: '1em',
    },
    winnerSection: {
      fontSize: '1.6em',
    },
  },
};

export default styles;
