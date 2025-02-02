import React, { useState, useEffect } from "react";

const Sound = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [recognition, setRecognition] = useState(null);

  // Initialize the SpeechRecognition API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true; // Keep recording until stopped
    recognitionInstance.interimResults = true; // Show interim results
    recognitionInstance.lang = "en-US"; // Set language

    recognitionInstance.onresult = (event) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    setRecognition(recognitionInstance);
  }, []);

  // Start or stop recording
  const toggleRecording = () => {
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  // Call the Hugging Face API for sentiment analysis
  const analyzeSentiment = async (text) => {
    const apiUrl =
      "https://api-inference.huggingface.co/models/tabularisai/multilingual-sentiment-analysis";
    const headers = {
      Authorization: `Bearer ${import.meta.env.HUGGINGFACE_API_KEY}`, // Add your Hugging Face API key
      "Content-Type": "application/json",
    };
    const payload = {
      inputs: text,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data && data[0]) {
        setSentiment(data[0][0].label); // Extract sentiment label
      }
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
    }
  };

  // Analyze sentiment whenever the transcript changes
  useEffect(() => {
    if (transcript) {
      analyzeSentiment(transcript);
    }
  }, [transcript]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#f0f0f0",
        padding: "10px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      <h2>Speech to Text and Sentiment Analysis</h2>
      <button
        onClick={toggleRecording}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: isRecording ? "#ff4444" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <div style={{ marginTop: "20px" }}>
        <h3>Transcript:</h3>
        <p>{transcript}</p>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h3>Sentiment:</h3>
        <p
          style={{
            color:
              sentiment === "POSITIVE"
                ? "green"
                : sentiment === "NEGATIVE"
                ? "red"
                : "gray",
          }}
        >
          {sentiment || "No sentiment detected yet."}
        </p>
      </div>
    </div>
  );
};

export default Sound;
