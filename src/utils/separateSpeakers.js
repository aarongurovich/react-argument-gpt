export const separateSpeakers = (utterances) => {
    if (!utterances || !Array.isArray(utterances) || utterances.length === 0) {
      console.warn('Utterances are missing or not in expected format. Returning empty transcripts.');
      return { speaker1: '', speaker2: '' };
    }
  
    const speakerMap = {};
  
    utterances.forEach((utterance) => {
      const speaker = utterance.speaker;
      const content = utterance.text;
  
      if (!speakerMap[speaker]) {
        speakerMap[speaker] = '';
      }
      speakerMap[speaker] += content + ' ';
    });
  
    // Get speaker keys
    const speakers = Object.keys(speakerMap);
  
    const separatedTranscripts = {
      speaker1: speakerMap[speakers[0]] ? speakerMap[speakers[0]].trim() : '',
      speaker2: speakerMap[speakers[1]] ? speakerMap[speakers[1]].trim() : '',
    };
  
    return separatedTranscripts;
  };