import { useState, useEffect } from "react";
import {
  Siren,
  Phone,
  AlertTriangle,
  ShieldCheck,
  UserRound,
  Plus,
  Trash2,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  Flame,
  Activity,
  Heart,
  Droplet,
} from "lucide-react";
import { EMERGENCY_NUMBERS_DATA, FIRST_AID_GUIDELINES } from "../data/initialData.js";
import { emergencyContactService } from "../services/supabase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const QUICK_HELPLINES = [
  { name: "Police", number: "100", color: "blue", icon: ShieldCheck },
  { name: "Fire Department", number: "101", color: "orange", icon: Flame },
  { name: "Ambulance", number: "102", color: "teal", icon: Activity },
  { name: "Women Helpline", number: "1091", color: "purple", icon: Phone },
];

export default function EmergencyPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("Family");
  const [showAddContact, setShowAddContact] = useState(false);
  const [selectedAidId, setSelectedAidId] = useState("bleeding");
  const [activeTab, setActiveTab] = useState("contacts"); // 'contacts' | 'guide' | 'tips'

  useEffect(() => {
    async function loadContacts() {
      if (user?.id) {
        const { data } = await emergencyContactService.getContacts(user.id);
        if (data) setContacts(data);
      }
    }
    loadContacts();
  }, [user?.id]);

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newContact = {
      id: "cnt-" + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      relationship,
    };

    setContacts([newContact, ...contacts]);
    setName("");
    setPhone("");
    setShowAddContact(false);

    if (user?.id) {
      await emergencyContactService.addContact(user.id, newContact);
    }
  };

  const handleDeleteContact = async (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
    if (user?.id) {
      await emergencyContactService.deleteContact(id);
    }
  };

  const activeAid =
    FIRST_AID_GUIDELINES.find((f) => f.id === selectedAidId) ||
    FIRST_AID_GUIDELINES[0];

  return (
    <div className="emergency-page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="emergency-page-title">Emergency Assistance</h1>
          <p className="emergency-page-subtitle">
            Quick help when you need it most.
          </p>
        </div>
      </div>

      {/* Prominent Red Call 112 Banner (Matches Image 1 Screen 5) */}
      <div className="emergency-hero-banner">
        <a href="tel:112" className="emergency-call-card-btn">
          <div className="call-card-icon-wrap">
            <Phone size={26} />
          </div>
          <div className="call-card-text">
            <small>Emergency Number</small>
            <strong>Call 112</strong>
            <span>Police | Fire | Medical</span>
          </div>
        </a>

        <div className="emergency-notice-text">
          <strong>In case of any life-threatening situation, call 112 immediately.</strong>
          <p>This service is available 24/7 across India. Free call on any phone or SIM.</p>
        </div>
      </div>

      {/* 3 Quick Action Cards Row */}
      <div className="emergency-action-cards-grid">
        <div
          className={`emergency-action-card ${activeTab === "contacts" ? "active" : ""}`}
          onClick={() => setActiveTab("contacts")}
        >
          <div className="action-card-icon-wrap blue">
            <Phone size={20} />
          </div>
          <div>
            <strong>Emergency Contacts</strong>
            <small>Police, Fire, Ambulance</small>
          </div>
        </div>

        <div
          className={`emergency-action-card ${activeTab === "guide" ? "active" : ""}`}
          onClick={() => setActiveTab("guide")}
        >
          <div className="action-card-icon-wrap red">
            <HeartHandshake size={20} />
          </div>
          <div>
            <strong>First Aid Guide</strong>
            <small>Basic first aid steps</small>
          </div>
        </div>

        <div
          className={`emergency-action-card ${activeTab === "tips" ? "active" : ""}`}
          onClick={() => setActiveTab("tips")}
        >
          <div className="action-card-icon-wrap green">
            <ShieldCheck size={20} />
          </div>
          <div>
            <strong>Emergency Tips</strong>
            <small>Be prepared, stay safe</small>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Important Numbers & Quick First Aid */}
      <div className="emergency-body-grid">
        {/* Left Column: Helpline Numbers + Personal Contacts */}
        <div className="emergency-left-panel">
          <div className="card-box">
            <h2 className="section-sub-title">Important Helpline Numbers</h2>
            <div className="helpline-pills-grid">
              {QUICK_HELPLINES.map((line) => {
                const Icon = line.icon;
                return (
                  <a
                    key={line.number}
                    href={`tel:${line.number}`}
                    className={`helpline-item-pill ${line.color}`}
                  >
                    <div className="helpline-icon-wrap">
                      <Icon size={16} />
                    </div>
                    <div className="helpline-info">
                      <small>{line.name}</small>
                      <strong>{line.number}</strong>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Personal Contacts */}
          <div className="card-box" style={{ marginTop: "20px" }}>
            <div className="reminders-header-row">
              <h2 className="section-sub-title">Personal Emergency Contacts</h2>
              <button
                type="button"
                className="button button-outline btn-sm"
                onClick={() => setShowAddContact(!showAddContact)}
              >
                <Plus size={14} /> Add Contact
              </button>
            </div>

            {showAddContact && (
              <form onSubmit={handleAddContact} className="add-contact-form">
                <div className="form-row three-col">
                  <input
                    type="text"
                    placeholder="Contact name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                  >
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Neighbor">Neighbor</option>
                  </select>
                </div>
                <button type="submit" className="button button-primary btn-sm" style={{ marginTop: "10px" }}>
                  Save Contact
                </button>
              </form>
            )}

            <div className="contacts-list-styled">
              {contacts.length === 0 ? (
                <p className="no-contacts-note">No personal contacts saved yet.</p>
              ) : (
                contacts.map((c) => (
                  <div key={c.id} className="contact-item-row">
                    <div>
                      <strong>{c.name}</strong>
                      <small>{c.relationship} • {c.phone}</small>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <a href={`tel:${c.phone}`} className="button button-primary btn-sm">
                        <Phone size={13} /> Call
                      </a>
                      <button
                        type="button"
                        className="icon-button danger"
                        onClick={() => handleDeleteContact(c.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick First Aid (Matches Image 1 Screen 5) */}
        <aside className="quick-firstaid-panel">
          <div className="card-box">
            <h2 className="section-sub-title">Quick First Aid</h2>
            <div className="quick-aid-list">
              {[
                { id: "bleeding", title: "Cuts & Bleeding" },
                { id: "burns", title: "Burns" },
                { id: "heart-attack", title: "Fever & Chest Pain" },
                { id: "choking", title: "Choking" },
              ].map((item) => (
                <div
                  key={item.id}
                  className={`quick-aid-item ${selectedAidId === item.id ? "active" : ""}`}
                  onClick={() => setSelectedAidId(item.id)}
                >
                  <span>{item.title}</span>
                  <ChevronRight size={16} className="chevron" />
                </div>
              ))}
            </div>

            {/* Selected Aid Protocol Steps */}
            {activeAid && (
              <div className="aid-detail-box">
                <h3 className="aid-protocol-title">{activeAid.title}</h3>
                <ol className="aid-steps-ol">
                  {activeAid.steps.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>
                <div className="aid-dont-box">
                  <strong>Warning:</strong> {activeAid.donts}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
