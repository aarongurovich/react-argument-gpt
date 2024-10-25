import axios from 'axios';

const apiKey = process.env.REACT_APP_ASSEMBLYAI_API_KEY;

if (!apiKey) {
  throw new Error('AssemblyAI API key is not set. Please check your environment variables.');
}

export const uploadAudio = async (audioData) => {
  try {
    const response = await axios.post(
      'https://api.assemblyai.com/v2/upload',
      audioData,
      {
        headers: {
          authorization: apiKey,
          'content-type': 'application/octet-stream',
        },
      }
    );
    return response.data.upload_url;
  } catch (uploadError) {
    console.error(
      'Upload Error:',
      uploadError.response ? uploadError.response.data : uploadError.message
    );
    throw new Error('Failed to upload audio.');
  }
};

export const requestTranscription = async (audioUrl) => {
    try {
      const response = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        {
          audio_url: audioUrl,
          speaker_labels: true,       // Enable speaker labels
          punctuate: true,            // Optional: Adds punctuation
          format_text: true,          // Optional: Formats text
          dual_channel: false,        // Set to true if using dual-channel audio
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
      console.error('Transcription Request Error:', transcriptionError.response?.data || transcriptionError.message);
      throw new Error('Failed to request transcription.');
    }
  };
export const pollTranscription = async (transcriptId) => {
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
        console.log('Transcription Completed:', response.data);
        return {
          text: response.data.text,
          utterances: response.data.utterances,
        };
      } else if (status === 'error') {
        throw new Error(response.data.error);
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (pollError) {
      console.error('Polling Error:', pollError);
      throw new Error('Failed during transcription polling.');
    }
  }
};
