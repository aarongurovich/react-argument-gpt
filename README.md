# React Argument GPT

React Argument GPT is an AI-powered debate analysis application built with React. It records audio of a debate or argument, transcribes it using AssemblyAI (identifying distinct speakers), and then uses OpenAI's GPT-4o to act as an expert adjudicator—scoring the performance, identifying logical fallacies, and declaring a winner.

## Features

* **Audio Recording:** Capture debate audio directly within the browser.
* **Intelligent Transcription:** Uses **AssemblyAI** to transcribe audio with speaker identification (diarization), punctuation, and formatting.
* **AI Adjudication:** Leverages **OpenAI's GPT-4o** to analyze transcripts with academic rigor.
    * **Performance Scoring:** rates speakers (1-10) on Argumentation, Evidence, Rhetoric, Clarity, and Rebuttal.
    * **Detailed Analysis:** Identifies specific strengths, weaknesses, and logical fallacies (e.g., Ad Hominem, Straw Man) with direct quotes.
    * **Verdict:** Declares a winner with a detailed rationale.
* **Strategic Recommendations:** Provides actionable advice for each speaker to improve their debating skills.

## Tech Stack

* **Frontend:** React, React Router.
* **AI Services:**
    * AssemblyAI (Speech-to-Text & Speaker Labels).
    * OpenAI API (GPT-4o for Rhetorical Analysis).
* **Utilities:** Axios (API requests), Simple Peer (WebRTC), Socket.io-client.

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js and npm installed.
* API Key from [AssemblyAI](https://www.assemblyai.com/).
* API Key from [OpenAI](https://openai.com/).

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/aarongurovich/react-argument-gpt.git](https://github.com/aarongurovich/react-argument-gpt.git)
    cd react-argument-gpt
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

### Configuration

Create a `.env` file in the root directory of the project to store your API keys.

```env
REACT_APP_ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

*Note: The application explicitly checks for these environment variables to function correctly.*

### Running the Application

In the project directory, you can run:

```bash
npm start

Runs the app in the development mode. Open http://localhost:3000 to view it in your browser.

Available Scripts
npm start: Runs the app in development mode.

npm test: Launches the test runner.

npm run build: Builds the app for production to the build folder.

npm run eject: Removes the single build dependency from your project (one-way operation).
