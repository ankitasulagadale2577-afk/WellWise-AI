import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  Sparkles,
  Clock,
  Trash2,
  AlertTriangle,
  Send,
  User,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { askAIAssistant } from "../services/aiService.js";

const DEFAULT_QUERIES = [
  { id: "q1", text: "What are the symptoms of dengue?", time: "2 mins ago", lang: "English" },
  { id: "q2", text: "डेंग्यूची लक्षणे कोणती आहेत?", time: "5 mins ago", lang: "Marathi" },
  { id: "q3", text: "Nearest hospital near me", time: "12 mins ago", lang: "English" },
  { id: "q4", text: "हंगामी आजारांपासून बचाव कसा करावा?", time: "20 mins ago", lang: "Marathi" },
];

const SUGGESTIONS = [
  "What are the symptoms of fever?",
  "How to prevent seasonal infections?",
  "Where is the nearest hospital?",
  "What is the nearest pharmacy?",
];

export default function VoicePage() {
  const { language, setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState("en"); // 'en' | 'mr'
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [recentQueries, setRecentQueries] = useState(DEFAULT_QUERIES);
  const [errorMsg, setErrorMsg] = useState("");

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = selectedLang === "mr" ? "mr-IN" : "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMsg("");
    };

    recognition.onresult = (event) => {
      let current = "";
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      setTranscript(current);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      if (e.error !== "no-speech") {
        setErrorMsg(`Speech recognition error: ${e.error}`);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch {
        // ignore
      }
    };
  }, [selectedLang]);

  const handleToggleListening = () => {
    if (!recognitionRef.current) {
      setErrorMsg("Voice recognition is not supported in this browser. Please type below.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript.trim()) {
        handleSubmitQuery(transcript);
      }
    } else {
      setTranscript("");
      setAiResponse("");
      recognitionRef.current.lang = selectedLang === "mr" ? "mr-IN" : "en-IN";
      try {
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.stop();
      }
    }
  };

  const handleStop = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const handleSubmitQuery = async (queryText) => {
    const text = queryText || transcript;
    if (!text.trim() || loading) return;

    setLoading(true);
    setErrorMsg("");

    const newQuery = {
      id: "q-" + Date.now(),
      text: text.trim(),
      time: "Just now",
      lang: selectedLang === "mr" ? "Marathi" : "English",
    };
    setRecentQueries([newQuery, ...recentQueries]);

    try {
      const { reply, error: apiErr } = await askAIAssistant(
        [{ role: "user", content: text.trim() }],
        selectedLang
      );

      setLoading(false);

      if (apiErr) {
        setErrorMsg(apiErr);
        return;
      }

      setAiResponse(reply);
      speakText(reply);
    } catch {
      setLoading(false);
      setErrorMsg("Could not formulate speech response.");
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[•*#]/g, ""));
    utterance.lang = selectedLang === "mr" ? "mr-IN" : "en-IN";
    utterance.rate = 0.95;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="voice-page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="voice-page-title">Voice Assistant</h1>
          <p className="voice-page-subtitle">
            Speak in English or Marathi. Get instant responses with voice.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="alert-box error" style={{ marginBottom: "16px" }}>
          <AlertTriangle size={16} /> {errorMsg}
        </div>
      )}

      <div className="voice-content-grid">
        {/* Left Stage: Voice Waveform & Microphone */}
        <div className="voice-stage-card">
          {/* Language Switcher Pills */}
          <div className="voice-lang-pills">
            <button
              type="button"
              className={`voice-lang-pill ${selectedLang === "en" ? "active" : ""}`}
              onClick={() => setSelectedLang("en")}
            >
              English
            </button>
            <button
              type="button"
              className={`voice-lang-pill ${selectedLang === "mr" ? "active" : ""}`}
              onClick={() => setSelectedLang("mr")}
            >
              मराठी
            </button>
          </div>

          {/* Central Glowing Waveform Stage */}
          <div className="waveform-center-stage">
            <div className={`wave-ring-outer ${isListening ? "animating" : ""}`}>
              <div className={`wave-ring-inner ${isListening ? "animating" : ""}`}>
                <button
                  type="button"
                  className={`mic-orb-button ${isListening ? "listening" : ""}`}
                  onClick={handleToggleListening}
                  aria-label={isListening ? "Stop listening" : "Start speaking"}
                >
                  <Mic size={38} className="mic-svg" />
                </button>
              </div>
            </div>

            <div className="mic-status-text">
              <strong>Tap the microphone and speak</strong>
              <span>माईकवर टॅप करून बोला</span>
            </div>

            {/* Action Buttons: Listening / Stop */}
            <div className="voice-actions-row">
              <button
                type="button"
                className={`button ${isListening ? "button-primary" : "button-outline"} btn-sm`}
                onClick={handleToggleListening}
              >
                <span className={`pulse-dot ${isListening ? "active" : ""}`} />
                {isListening ? "Listening..." : "Start Listening"}
              </button>

              <button
                type="button"
                className="button button-outline btn-sm"
                onClick={handleStop}
              >
                <Square size={13} /> Stop
              </button>
            </div>
          </div>

          {/* Realtime Spoken Transcript or Response Box */}
          {(transcript || aiResponse || loading) && (
            <div className="voice-transcript-card">
              {transcript && (
                <div className="spoken-query-bubble">
                  <small>You said:</small>
                  <p>"{transcript}"</p>
                </div>
              )}

              {loading && <p className="voice-loading-note">Formulating voice answer...</p>}

              {aiResponse && (
                <div className="voice-response-bubble">
                  <div className="response-top-row">
                    <small>WellWise AI:</small>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => speakText(aiResponse)}
                    >
                      {speaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      {speaking ? "Mute" : "Replay"}
                    </button>
                  </div>
                  <p>{aiResponse}</p>
                </div>
              )}
            </div>
          )}

          {/* Bottom Suggestion Prompts */}
          <div className="voice-prompts-row">
            {SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                className="voice-prompt-pill"
                onClick={() => {
                  setTranscript(sug);
                  handleSubmitQuery(sug);
                }}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Recent Voice Queries & Doctor Card */}
        <aside className="voice-sidebar-card">
          <div className="recent-queries-header">
            <h3>Recent Voice Queries</h3>
            <button
              type="button"
              className="clear-link-btn"
              onClick={() => setRecentQueries([])}
            >
              Clear All
            </button>
          </div>

          <div className="recent-queries-list">
            {recentQueries.length === 0 ? (
              <p className="no-queries-text">No recent voice inquiries</p>
            ) : (
              recentQueries.map((q) => (
                <div
                  key={q.id}
                  className="recent-query-item"
                  onClick={() => {
                    setTranscript(q.text);
                    handleSubmitQuery(q.text);
                  }}
                >
                  <div className="query-item-dot" />
                  <div className="query-item-body">
                    <strong>{q.text}</strong>
                    <small>
                      {q.time} • {q.lang}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Doctor Promo Card */}
          <div className="doctor-voice-card">
            <div className="doctor-avatar-circle">
              <span className="doc-emoji">👩‍⚕️</span>
            </div>
            <div className="doctor-card-text">
              <strong>Your voice matters</strong>
              <small>Get help in your preferred language.</small>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
