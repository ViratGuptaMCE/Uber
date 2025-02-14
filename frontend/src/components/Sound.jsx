// import React, { useState, useEffect } from "react";

// const Sound = ({ soundPane }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [sentiment, setSentiment] = useState("");
//   const [recognition, setRecognition] = useState(null);

//   // List of negative words/phrases to detect
//   const negativeWords = [
//     "help",
//     "get away",
//     "leave me",
//     "get out",
//     "stop",
//     "no",
//   ];

//   // Initialize the SpeechRecognition API
//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert("Speech recognition is not supported in this browser.");
//       return;
//     }

//     const recognitionInstance = new SpeechRecognition();
//     recognitionInstance.continuous = true; // Keep recording until stopped
//     recognitionInstance.interimResults = true; // Show interim results
//     recognitionInstance.lang = "en-US"; // Set language

//     recognitionInstance.onresult = (event) => {
//       let currentTranscript = "";
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         currentTranscript += event.results[i][0].transcript;
//       }
//       setTranscript(currentTranscript);

//       // Check for negative words in the transcript
//       const containsNegativeWords = negativeWords.some((word) =>
//         currentTranscript.toLowerCase().includes(word)
//       );

//       if (containsNegativeWords) {
//         setSentiment("Negative Emotions detected");
//         recognitionInstance.stop(); // Stop recognition if negative words are detected
//         setIsRecording(false);
//       } else {
//         setSentiment("Neutral or Positive");
//       }
//     };

//     recognitionInstance.onerror = (event) => {
//       console.error("Speech recognition error:", event.error);
//     };

//     setRecognition(recognitionInstance);
//   }, []);

//   // Start or stop recording based on soundPane
//   useEffect(() => {
//     if (soundPane && recognition) {
//       recognition.start();
//       setIsRecording(true);
//     } else if (recognition) {
//       recognition.stop();
//       setIsRecording(false);
//     }
//   }, [soundPane, recognition]);

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: "#f0f0f0",
//         padding: "10px",
//         boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//         zIndex: 1000,
//       }}
//     >
//       <h2>Speech to Text and Sentiment Analysis</h2>
//       <div style={{ marginTop: "20px" }}>
//         <h3>Transcript:</h3>
//         <p>{transcript}</p>
//       </div>
//       <div style={{ marginTop: "20px" }}>
//         <h3>Sentiment:</h3>
//         <p
//           style={{
//             color:
//               sentiment === "Negative Emotions detected"
//                 ? "red"
//                 : sentiment === "Neutral or Positive"
//                 ? "green"
//                 : "gray",
//           }}
//         >
//           {sentiment || "No sentiment detected yet."}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Sound;

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sound = ({ soundPane, onClose , setVehicleFound }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const negativeWords = [
    "help",
    "get away",
    "leave me",
    "save me",
    "get out",
    "stop",
    "accident",
    "rescue",
    "kidnap",
    "betrayal",
    "abuse",
    "violence",
    "crime",
    "theft",
    "robbery",
    "murder",
    "suicide",
    "hostage"
  ];

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true; 
    recognitionInstance.lang = "en-US"; 

    recognitionInstance.onresult = (event) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);

      const containsNegativeWords = negativeWords.some((word) =>
        currentTranscript.toLowerCase().includes(word)
      );

      if (containsNegativeWords) {
        setSentiment("Negative Emotions detected");
        recognitionInstance.stop();
        setIsRecording(false);

        setIsClosing(true);
        toast.error("Negative Emotions detected. Calling for help", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setTimeout(() => {
          onClose();
          setVehicleFound(true);
        }, 500); 
      } else {
        setSentiment("Neutral or Positive");
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionInstance.onstart = () => {
      console.log("Speech recognition started");
      setIsRecording(true);
    };

    recognitionInstance.onend = () => {
      console.log("Speech recognition stopped");
      setIsRecording(false);
    };

    setRecognition(recognitionInstance);
  }, [onClose]);

  // Start or stop recording based on button click
  const toggleRecording = () => {
    if (recognition) {
      if (isRecording) {
        recognition.stop();
        setIsRecording(false);
      } else {
        recognition.start();
        setIsRecording(true);
      }
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 bg-gray-100 p-4 shadow-lg z-50 transition-opacity duration-500 ease-out ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">
          Speech to Text and Sentiment Analysis
        </h2>
        <button
          onClick={toggleRecording}
          className={`px-4 py-2 text-white font-semibold rounded-lg ${
            isRecording ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <div className="mt-5">
          <h3 className="text-xl font-semibold">Transcript:</h3>
          <p className="mt-2 text-gray-700">{transcript}</p>
        </div>
        <div className="mt-5">
          <h3 className="text-xl font-semibold">Sentiment:</h3>
          <p
            className={`mt-2 ${
              sentiment === "Negative Emotions detected"
                ? "text-red-600"
                : sentiment === "Neutral or Positive"
                ? "text-green-600"
                : "text-gray-600"
            }`}
          >
            {sentiment || "No sentiment detected yet."}
          </p>
        </div>
      </div>
    </>
  );
};

export default Sound;