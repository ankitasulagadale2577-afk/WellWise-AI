import { useState, useEffect } from "react";
import {
  FileText,
  Mic,
  MicOff,
  Printer,
  Download,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Plus,
  Trash2,
  Share2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { doctorPassportService } from "../services/supabase.js";

export default function DoctorPassportPage() {
  const { user, profile } = useAuth();
  const { t, language } = useLanguage();

  const [patientName, setPatientName] = useState(
    profile?.full_name || user?.user_metadata?.full_name || ""
  );
  const [age, setAge] = useState("");
  const [chiefSymptoms, setChiefSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("Moderate");
  const [existingConditions, setExistingConditions] = useState("");
  const [currentMedicines, setCurrentMedicines] = useState("");
  const [allergies, setAllergies] = useState("");
  const [questionsForDoctor, setQuestionsForDoctor] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [savedPassports, setSavedPassports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load saved passports
  useEffect(() => {
    async function loadData() {
      if (user?.id) {
        const { data } = await doctorPassportService.getPassports(user.id);
        if (data) setSavedPassports(data);
      }
    }
    loadData();
  }, [user?.id]);

  // Speech recognition for dictating symptoms
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type symptoms manually.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langCodeMap = { en: "en-IN", mr: "mr-IN", hi: "hi-IN", kn: "kn-IN" };
      recognition.lang = langCodeMap[language] || "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setChiefSymptoms((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleGenerateSummary = (e) => {
    e.preventDefault();
    if (!chiefSymptoms.trim()) {
      setErrorMsg("Please describe your symptoms to generate a summary.");
      return;
    }

    setErrorMsg("");
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const summaryText = `=====================================================
WELLWISE AI — PATIENT CLINICAL VISIT PASSPORT
Date: ${dateStr}
Notice: Patient-reported summary for doctor consultation. NOT a diagnosis.
=====================================================

1. PATIENT INFORMATION
• Name: ${patientName.trim() || "Not specified"}
• Age: ${age.trim() || "Not specified"}
• Visit Date: ${dateStr}

2. CHIEF COMPLAINTS & SYMPTOMS
• Symptoms: ${chiefSymptoms.trim()}
• Duration: ${duration.trim() || "Not specified"}
• Reported Severity: ${severity}

3. MEDICAL HISTORY & CONTEXT
• Known Conditions: ${existingConditions.trim() || "None reported"}
• Current Medications: ${currentMedicines.trim() || "None reported"}
• Known Allergies: ${allergies.trim() || "None reported"}

4. QUESTIONS FOR DOCTOR
• ${questionsForDoctor.trim() || "General clinical evaluation and diagnosis recommendations"}

=====================================================
Prepared with WellWise AI (Patient Summary Companion)
=====================================================`;

    setGeneratedSummary(summaryText);
  };

  const handleSave = async () => {
    if (!generatedSummary) return;
    setLoading(true);
    setSaveSuccess(false);

    const passportObj = {
      patient_name: patientName.trim() || "Patient",
      age: age ? parseInt(age, 10) : null,
      visit_date: new Date().toISOString().split("T")[0],
      chief_symptoms: chiefSymptoms,
      duration: duration || "Recent",
      severity,
      existing_conditions: existingConditions,
      current_medicines: currentMedicines,
      allergies,
      questions_for_doctor: questionsForDoctor,
      generated_summary: generatedSummary,
    };

    const { data, error } = await doctorPassportService.savePassport(user?.id, passportObj);

    setLoading(false);
    if (!error && data) {
      setSaveSuccess(true);
      setSavedPassports((prev) => [data, ...prev]);
      setTimeout(() => setSaveSuccess(false), 4000);
    } else {
      setErrorMsg("Could not save to database. Record is kept locally.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this doctor passport?")) {
      await doctorPassportService.deletePassport(id);
      setSavedPassports((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="feature-page passport-page">
      <div className="page-header">
        <div className="page-header-content">
          <span className="section-kicker">FEATURE 3 • CLINICAL PREPARATION</span>
          <h1>Voice-to-Doctor Passport 🩺</h1>
          <p className="page-description">
            Describe symptoms using voice or text. Get an organized, printable clinical summary
            ready for your physician visit.
          </p>
        </div>
      </div>

      <div className="safety-banner">
        <AlertCircle size={20} className="banner-icon" />
        <div>
          <strong>Patient-Reported Preparation Tool:</strong> This summary is prepared by you to help
          your doctor understand your symptoms clearly. It does not replace medical examination or constitute a clinical diagnosis.
        </div>
      </div>

      <div className="two-col-grid" style={{ marginTop: "24px" }}>
        {/* Left Column: Form */}
        <div className="card-box">
          <h2 className="card-title">
            <FileText size={18} /> Prepare Visit Summary
          </h2>

          {errorMsg && <div className="alert-box error">{errorMsg}</div>}

          <form onSubmit={handleGenerateSummary} className="passport-form">
            <div className="form-row two-col">
              <div className="form-group">
                <label>Patient Full Name</label>
                <input
                  type="text"
                  placeholder="e.g., Rajesh Kumar"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  placeholder="e.g., 34"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-with-action">
                <label>Chief Symptoms *</label>
                <button
                  type="button"
                  className={`voice-dictate-btn ${isListening ? "active" : ""}`}
                  onClick={toggleSpeechRecognition}
                  title={isListening ? "Stop voice input" : "Speak symptoms"}
                >
                  {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  <span>{isListening ? "Listening..." : "Dictate with Voice"}</span>
                </button>
              </div>
              <textarea
                rows={3}
                required
                placeholder="Describe what you are feeling (e.g. sharp headache on the right side, accompanied by nausea after meals...)"
                value={chiefSymptoms}
                onChange={(e) => setChiefSymptoms(e.target.value)}
              />
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label>Duration of Symptoms</label>
                <input
                  type="text"
                  placeholder="e.g. 3 days, since yesterday morning"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Reported Severity</label>
                <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                  <option value="Mild">Mild (Noticeable but does not affect routine)</option>
                  <option value="Moderate">Moderate (Interferes with work/sleep)</option>
                  <option value="Severe">Severe (Intense discomfort, need prompt care)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Existing Medical Conditions</label>
              <input
                type="text"
                placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma, None"
                value={existingConditions}
                onChange={(e) => setExistingConditions(e.target.value)}
              />
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label>Current Medications & Dosages</label>
                <input
                  type="text"
                  placeholder="e.g. Metformin 500mg, Vitamin D"
                  value={currentMedicines}
                  onChange={(e) => setCurrentMedicines(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Known Drug / Food Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts, None"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Questions You Want to Ask Your Doctor</label>
              <textarea
                rows={2}
                placeholder="e.g. Do I need blood tests? Are there any foods I should avoid while taking medicine?"
                value={questionsForDoctor}
                onChange={(e) => setQuestionsForDoctor(e.target.value)}
              />
            </div>

            <button type="submit" className="button button-primary full-width">
              Generate Formatted Passport
            </button>
          </form>
        </div>

        {/* Right Column: Output & Actions */}
        <div className="card-box print-card">
          <div className="card-header-actions">
            <h2 className="card-title">
              <CheckCircle2 size={18} /> Structured Doctor Passport
            </h2>
            {generatedSummary && (
              <div className="action-buttons-group">
                <button
                  type="button"
                  className="button button-outline btn-sm"
                  onClick={handlePrint}
                  title="Print or Save as PDF"
                >
                  <Printer size={15} /> Print / PDF
                </button>
                <button
                  type="button"
                  className="button button-primary btn-sm"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save size={15} /> {loading ? "Saving..." : "Save Passport"}
                </button>
              </div>
            )}
          </div>

          {saveSuccess && (
            <div className="alert-box success">
              <CheckCircle2 size={16} /> Passport securely saved to your health vault!
            </div>
          )}

          {generatedSummary ? (
            <div className="printable-passport">
              <pre className="passport-preview">{generatedSummary}</pre>
            </div>
          ) : (
            <div className="empty-state-box">
              <FileText size={42} className="empty-icon" />
              <h3>No summary generated yet</h3>
              <p>
                Fill out your symptoms and details on the left, then click "Generate Formatted
                Passport" to preview and export.
              </p>
            </div>
          )}

          {/* Past Passports */}
          {savedPassports.length > 0 && (
            <div className="past-passports-section">
              <h3 className="sub-heading">Saved Doctor Passports ({savedPassports.length})</h3>
              <div className="past-passports-list">
                {savedPassports.map((p) => (
                  <div key={p.id} className="passport-history-item">
                    <div>
                      <strong>{p.chief_symptoms.slice(0, 45)}...</strong>
                      <div className="item-meta">
                        <span><Clock size={12} /> {p.visit_date}</span>
                        <span>Severity: {p.severity}</span>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => setGeneratedSummary(p.generated_summary)}
                        title="Load into view"
                      >
                        <FileText size={15} />
                      </button>
                      <button
                        type="button"
                        className="icon-button danger"
                        onClick={() => handleDelete(p.id)}
                        title="Delete record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
