import { useState, useEffect, useRef } from "react";
import {
  Bot,
  UserRound,
  Send,
  Trash2,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { askAIAssistant } from "../services/aiService.js";
import { chatDbService } from "../services/supabase.js";

const DEFAULT_HISTORY = [
  { id: "h1", title: "Seasonal fever prevention", time: "Today, 10:24 AM" },
  { id: "h2", title: "Diet for PCOS", time: "Yesterday, 7:12 PM" },
  { id: "h3", title: "Acne and skincare", time: "Yesterday, 5:05 PM" },
  { id: "h4", title: "Menstrual health", time: "22 Oct, 9:15 AM" },
  { id: "h5", title: "General wellness", time: "20 Oct, 6:42 PM" },
];

const SUGGESTION_PILLS = [
  "What diet is good for PCOS?",
  "How to manage weight?",
  "Can PCOS be cured?",
  "Symptoms in Marathi",
];

export default function AssistantPage() {
  const { user, profile } = useAuth();
  const { language, t } = useLanguage();

  const [conversations, setConversations] = useState(DEFAULT_HISTORY);
  const [activeConvId, setActiveConvId] = useState("h2");
  const [messages, setMessages] = useState([
    {
      id: "m1",
      role: "user",
      content: "What are the symptoms of PCOS?",
      time: "10:24 AM",
    },
    {
      id: "m2",
      role: "assistant",
      content: `PCOS (Polycystic Ovary Syndrome) can cause:
• Irregular periods or missed periods
• Acne and oily skin
• Increased hair growth (especially on face)
• Weight gain or difficulty losing weight
• Mood changes and anxiety

It's important to consult a gynecologist for proper diagnosis and treatment.
(This is general information and not a substitute for professional medical advice.)`,
      time: "10:24 AM",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState(false);
  const [apiError, setApiError] = useState("");
  const messagesEndRef = useRef(null);

  const initial =
    profile?.full_name?.trim()[0]?.toUpperCase() ||
    user?.email?.split("@")[0][0]?.toUpperCase() ||
    "A";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load user's conversations from Supabase if available
  useEffect(() => {
    async function loadData() {
      if (user?.id) {
        const { data } = await chatDbService.getConversations(user.id);
        if (data && data.length > 0) {
          setConversations(
            data.map((c) => ({
              id: c.id,
              title: c.title,
              time: new Date(c.updated_at).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              }),
            }))
          );
          setActiveConvId(data[0].id);
        }
      }
    }
    loadData();
  }, [user?.id]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    setInput("");
    setApiError("");
    setEmergencyAlert(false);

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = {
      id: "msg-" + Date.now(),
      role: "user",
      content: text.trim(),
      time: currentTime,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const { reply, isEmergency, error: apiErr } = await askAIAssistant(
        newHistory.map((m) => ({ role: m.role, content: m.content })),
        language
      );

      setLoading(false);

      if (isEmergency) {
        setEmergencyAlert(true);
      }

      if (apiErr) {
        setApiError(apiErr);
        return;
      }

      const assistantMsg = {
        id: "msg-" + Date.now() + 1,
        role: "assistant",
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Save to Supabase if connected
      if (user?.id && activeConvId && !activeConvId.startsWith("h")) {
        await chatDbService.addMessage(activeConvId, user.id, "user", text.trim());
        await chatDbService.addMessage(activeConvId, user.id, "assistant", reply);
      }
    } catch {
      setLoading(false);
      setApiError("Could not reach AI assistant. Please check your backend connection.");
    }
  };

  const handleNewChat = async () => {
    const newId = "chat-" + Date.now();
    const newChat = {
      id: newId,
      title: "New Health Consultation",
      time: "Just now",
    };
    setConversations([newChat, ...conversations]);
    setActiveConvId(newId);
    setMessages([
      {
        id: "m-welcome",
        role: "assistant",
        content: "Hello! Ask anything about your health. I provide trusted, easy-to-understand educational answers in English or Marathi.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    if (user?.id) {
      await chatDbService.createConversation(user.id, "New Health Consultation", language);
    }
  };

  return (
    <div className="chat-layout-wrapper">
      {/* Top Header */}
      <div className="chat-page-header">
        <div>
          <h1 className="chat-page-title">AI Health Assistant</h1>
          <p className="chat-page-subtitle">
            Ask anything about your health. Get trusted, easy-to-understand answers in English or Marathi.
          </p>
        </div>
      </div>

      {/* Emergency Notice if detected */}
      {emergencyAlert && (
        <div className="safety-banner" style={{ background: "#FDE8E8", borderColor: "#F8B4B4", color: "#9B1C1C", marginBottom: "16px" }}>
          <AlertTriangle size={20} className="banner-icon" />
          <div>
            <strong>Possible Medical Emergency Detected!</strong>
            <p>
              Your inquiry indicates acute symptoms. Please immediately call <strong>112</strong> or proceed to the nearest emergency room.
            </p>
          </div>
          <a href="tel:112" className="button button-danger btn-sm" style={{ marginLeft: "auto" }}>
            <Phone size={14} /> Call 112
          </a>
        </div>
      )}

      {/* 2-Column Chat Container */}
      <div className="chat-workspace-card">
        {/* Left Sub-Panel: Chat History */}
        <aside className="chat-history-sidebar">
          <div className="history-header">
            <strong>Chat History</strong>
            <button type="button" className="new-chat-btn" onClick={handleNewChat}>
              <Plus size={14} /> New Chat
            </button>
          </div>

          <div className="history-items-list">
            {conversations.map((item) => (
              <div
                key={item.id}
                className={`history-item-row ${activeConvId === item.id ? "active" : ""}`}
                onClick={() => setActiveConvId(item.id)}
              >
                <div className="history-item-info">
                  <span className="history-title">{item.title}</span>
                  <small className="history-time">{item.time}</small>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Main Chat Stage */}
        <main className="chat-messages-stage">
          <div className="messages-scroll-area">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.role === "user" ? "user-row" : "assistant-row"}`}
              >
                {msg.role === "assistant" && (
                  <div className="bot-avatar-circle">
                    <Bot size={18} />
                  </div>
                )}

                <div className={`chat-bubble ${msg.role === "user" ? "bubble-user" : "bubble-assistant"}`}>
                  <div className="bubble-content-text">
                    {msg.content.split("\n").map((line, idx) => {
                      if (line.startsWith("•")) {
                        return (
                          <div key={idx} className="bullet-item-row">
                            <span className="bullet-check">✓</span>
                            <span>{line.replace("•", "").trim()}</span>
                          </div>
                        );
                      }
                      return <p key={idx}>{line}</p>;
                    })}
                  </div>
                  <span className="bubble-time-stamp">{msg.time}</span>
                </div>

                {msg.role === "user" && (
                  <div className="user-avatar-circle">
                    <span>{initial}</span>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble-row assistant-row">
                <div className="bot-avatar-circle">
                  <Bot size={18} />
                </div>
                <div className="chat-bubble bubble-assistant typing-bubble">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}

            {apiError && (
              <div className="alert-box error" style={{ margin: "16px 20px" }}>
                <AlertTriangle size={16} /> {apiError}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Bar */}
          <div className="suggested-prompts-bar">
            {SUGGESTION_PILLS.map((pill, idx) => (
              <button
                key={idx}
                type="button"
                className="suggestion-pill-btn"
                onClick={() => handleSendMessage(pill)}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="chat-input-row"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
