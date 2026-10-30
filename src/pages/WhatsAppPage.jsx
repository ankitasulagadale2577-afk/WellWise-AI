import { useState } from "react";
import {
  MessageSquare,
  ExternalLink,
  Send,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  Info,
  Copy,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function WhatsAppPage() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();

  // Configurable verified business WhatsApp number
  const DEFAULT_PHONE = "919876543210";
  const [phoneNumber, setPhoneNumber] = useState(DEFAULT_PHONE);
  const [selectedTemplate, setSelectedTemplate] = useState("symptoms");
  const [customMessage, setCustomMessage] = useState(
    "Hello WellWise AI! I would like to get guidance regarding my mild headache and fever."
  );
  const [copied, setCopied] = useState(false);

  const templates = [
    {
      id: "symptoms",
      title: "Symptom Inquiry",
      text: "Hello WellWise AI! I have had a sore throat and slight fever for 2 days. What home care steps should I follow and when should I see a doctor?",
    },
    {
      id: "medicine",
      title: "Medicine Schedule Log",
      text: "Hello WellWise AI! Please record that I have taken my evening dose of Paracetamol 500mg today at 8:00 PM.",
    },
    {
      id: "passport",
      title: "Doctor Passport Summary",
      text: `Hello Doctor! Here is my clinical visit passport prepared with WellWise AI:\nPatient: ${
        profile?.full_name || "Patient"
      }\nSymptoms: Persistent dry cough and fatigue for 3 days.\nAllergies: None reported.`,
    },
    {
      id: "emergency",
      title: "Emergency Alert Notice",
      text: "URGENT: I need immediate guidance regarding severe chest pain. (Connecting to India Emergency 112).",
    },
  ];

  const handleTemplateSelect = (tmpl) => {
    setSelectedTemplate(tmpl.id);
    setCustomMessage(tmpl.text);
  };

  const getEncodedUrl = () => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(customMessage.trim());
    return `https://wa.me/${cleanNumber}?text=${encodedText}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="feature-page whatsapp-page">
      <div className="page-header">
        <div className="page-header-content">
          <span className="section-kicker">FEATURE 10 • SECURE MESSAGING</span>
          <h1>WhatsApp Companion 💬</h1>
          <p className="page-description">
            Continue your health conversations on WhatsApp. Review and customize your prefilled
            message before launching official click-to-chat.
          </p>
        </div>
      </div>

      <div className="two-col-grid" style={{ marginTop: "24px" }}>
        {/* Left: Message Customizer */}
        <div className="card-box">
          <h2 className="card-title">
            <MessageSquare size={18} /> Compose WhatsApp Message
          </h2>

          <div className="template-selector-section">
            <label className="field-label">Choose a Quick Health Template:</label>
            <div className="template-buttons">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  className={`template-pill ${selectedTemplate === tmpl.id ? "active" : ""}`}
                  onClick={() => handleTemplateSelect(tmpl)}
                >
                  {tmpl.title}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "18px" }}>
            <label>Recipient WhatsApp Number (India standard format)</label>
            <div className="input-with-prefix">
              <span className="input-prefix">+</span>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="919876543210"
              />
            </div>
            <small className="helper-text">
              Defaults to official WellWise AI health companion line or your clinic's business number.
            </small>
          </div>

          <div className="form-group">
            <div className="label-with-action">
              <label>Message Content (Editable)</label>
              <button
                type="button"
                className="text-button"
                onClick={handleCopy}
                style={{ fontSize: "12px" }}
              >
                <Copy size={13} /> {copied ? "Copied!" : "Copy Text"}
              </button>
            </div>
            <textarea
              rows={5}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Type your message to send on WhatsApp..."
            />
          </div>

          <a
            href={getEncodedUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-primary full-width"
            style={{
              background: "#25D366",
              color: "#FFFFFF",
              borderColor: "#1EBE5D",
              boxShadow: "0 8px 20px rgba(37, 211, 102, 0.25)",
            }}
          >
            <Send size={16} /> Open in WhatsApp Click-to-Chat
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Right: Phone Preview & Security Notes */}
        <div className="card-box">
          <h2 className="card-title">
            <ShieldCheck size={18} /> Live Mobile Message Preview
          </h2>

          <div className="whatsapp-preview-device">
            <div className="wa-header">
              <div className="wa-avatar">🌿</div>
              <div>
                <strong>WellWise AI Companion</strong>
                <small>Official Verified Business</small>
              </div>
            </div>

            <div className="wa-chat-window">
              <div className="wa-bubble outgoing">
                <p>{customMessage || "Type a message..."}</p>
                <span className="wa-timestamp">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ✓✓
                </span>
              </div>
            </div>
          </div>

          <div className="safety-banner note-banner" style={{ marginTop: "24px" }}>
            <Info size={18} className="banner-icon" />
            <div>
              <strong>Privacy & Delivery Disclaimer:</strong> Clicking will securely redirect you to
              the official WhatsApp app or web client. WellWise AI does not claim messages are
              delivered until confirmed by WhatsApp's servers.
            </div>
          </div>

          <div className="setup-guide-box" style={{ marginTop: "20px" }}>
            <h4>Enterprise WhatsApp Cloud API Integration</h4>
            <p>
              To enable automated server-initiated reminders via WhatsApp Business Cloud API,
              configure the following backend environment secrets:
            </p>
            <code>
              WHATSAPP_PHONE_NUMBER_ID=your_id<br />
              WHATSAPP_ACCESS_TOKEN=your_token<br />
              WHATSAPP_VERIFY_TOKEN=your_webhook_token
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
