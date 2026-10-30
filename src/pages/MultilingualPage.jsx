import { useState } from "react";
import {
  Globe,
  CheckCircle2,
  Languages,
  Sparkles,
  Volume2,
  Bot,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { profileService } from "../services/supabase.js";

const LANGUAGE_DETAILS = [
  {
    code: "en",
    label: "English",
    native: "English",
    speakers: "India & Global",
    sampleGreeting: "Hello! How can WellWise AI help your health today?",
    description: "Full clinical terminology, evidence-based health guidance, and AI assistant interaction.",
    flag: "🌐",
  },
  {
    code: "mr",
    label: "Marathi",
    native: "मराठी",
    speakers: "Maharashtra & Western India",
    sampleGreeting: "नमस्कार! आज WellWise AI आपल्या आरोग्यासाठी कशी मदत करू शकते?",
    description: "स्थानिक वैद्यकीय भाषा, लसीकरण वेळापत्रक आणि थेट मराठी आवाज संभाषण.",
    flag: "🇮🇳",
  },
  {
    code: "hi",
    label: "Hindi",
    native: "हिन्दी",
    speakers: "National / Northern & Central India",
    sampleGreeting: "नमस्ते! आज WellWise AI आपके स्वास्थ्य में किस प्रकार सहायता कर सकता है?",
    description: "सरल और सहज हिंदी में स्वास्थ्य परामर्श, दवा रिमाइंडर और आपातकालीन सहायता.",
    flag: "🇮🇳",
  },
  {
    code: "kn",
    label: "Kannada",
    native: "ಕನ್ನಡ",
    speakers: "Karnataka & Southern India",
    sampleGreeting: "ನಮಸ್ಕಾರ! ಇಂದು WellWise AI ನಿಮ್ಮ ಆರೋಗ್ಯಕ್ಕೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    description: "ಸಂಪೂರ್ಣ ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿ ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ, ಆಸ್ಪತ್ರೆಗಳ ಹುಡುಕಾಟ ಮತ್ತು ಧ್ವನಿ ಸಂವಾದ.",
    flag: "🇮🇳",
  },
];

export default function MultilingualPage() {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelectLanguage = async (code) => {
    setLanguage(code);
    if (user?.id) {
      await profileService.updateProfile(user.id, { preferred_language: code });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="feature-page multilingual-page">
      <div className="page-header">
        <div className="page-header-content">
          <span className="section-kicker">FEATURE 11 • MULTILINGUAL EQUALITY</span>
          <h1>Multilingual Healthcare Support 🌐</h1>
          <p className="page-description">
            Health guidance should have no language barrier. Switch seamlessly between English,
            मराठी, हिन्दी, and ಕನ್ನಡ. All forms, AI chats, and voice services will adapt to your choice.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert-box success">
          <CheckCircle2 size={16} /> Language preference saved to your profile and restored across sessions!
        </div>
      )}

      <div className="languages-card-grid" style={{ marginTop: "24px" }}>
        {LANGUAGE_DETAILS.map((item) => {
          const isSelected = language === item.code;
          return (
            <div
              key={item.code}
              className={`language-selection-card ${isSelected ? "selected" : ""}`}
              onClick={() => handleSelectLanguage(item.code)}
            >
              <div className="card-top-row">
                <span className="lang-flag">{item.flag}</span>
                <span className="lang-code-tag">{item.code.toUpperCase()}</span>
                {isSelected && (
                  <span className="active-check-badge">
                    <CheckCircle2 size={16} /> Active
                  </span>
                )}
              </div>

              <div className="lang-names">
                <h2 className="native-name">{item.native}</h2>
                <span className="english-name">{item.label}</span>
              </div>

              <p className="speakers-info">Primary Region: {item.speakers}</p>
              <p className="lang-description">{item.description}</p>

              <div className="sample-phrase-box">
                <small className="phrase-label">Sample Assistant Greeting:</small>
                <blockquote className="phrase-text">"{item.sampleGreeting}"</blockquote>
              </div>

              <button
                type="button"
                className={`button full-width ${
                  isSelected ? "button-primary" : "button-outline"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectLanguage(item.code);
                }}
              >
                {isSelected ? "Currently Active" : `Switch to ${item.native}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="feature-grid-3" style={{ marginTop: "32px" }}>
        <div className="info-feature-card">
          <Bot size={24} className="feature-icon" />
          <h3>Multilingual AI Assistant</h3>
          <p>
            The generative health assistant understands queries and formulates evidence-based
            answers in your chosen Indian language.
          </p>
        </div>
        <div className="info-feature-card">
          <Volume2 size={24} className="feature-icon" />
          <h3>Native Voice Recognition</h3>
          <p>
            Utilizes browser speech synthesizers and recognition calibrated to regional Indian
            accents and native pronunciation.
          </p>
        </div>
        <div className="info-feature-card">
          <ShieldCheck size={24} className="feature-icon" />
          <h3>Persistent Storage</h3>
          <p>
            Your preference is securely stored in your Supabase user profile and synced automatically
            whenever you log in from any device.
          </p>
        </div>
      </div>
    </div>
  );
}
