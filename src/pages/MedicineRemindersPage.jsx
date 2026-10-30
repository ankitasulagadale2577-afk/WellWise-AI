import { useState, useEffect } from "react";
import {
  Pill,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Bell,
  Trash2,
  Calendar,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { medicineService } from "../services/supabase.js";

export default function MedicineRemindersPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [statusMsg, setStatusMsg] = useState("");

  // Form states
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [schedule, setSchedule] = useState("Daily at 8:00 PM");
  const [timeOfDay, setTimeOfDay] = useState("20:00");
  const [submitting, setSubmitting] = useState(false);

  const loadReminders = async () => {
    setLoading(true);
    const { data } = await medicineService.getReminders(user?.id);
    if (data) setReminders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReminders();
  }, [user?.id]);

  const requestNotificationAccess = async () => {
    if (typeof Notification === "undefined") {
      alert("This browser does not support desktop notifications.");
      return;
    }
    const perm = await Notification.requestPermission();
    setNotificationPermission(perm);
    if (perm === "granted") {
      new Notification("WellWise AI Reminders Active", {
        body: "You will receive visual reminders when taking your scheduled doses.",
        icon: "/favicon.ico",
      });
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!medicineName.trim() || !dosage.trim()) return;

    setSubmitting(true);
    const newRem = {
      medicine_name: medicineName.trim(),
      dosage: dosage.trim(),
      instructions: instructions.trim(),
      schedule,
      time_of_day: timeOfDay,
    };

    const { data, error } = await medicineService.addReminder(user?.id, newRem);
    setSubmitting(false);

    if (error) {
      alert("Could not save reminder. Please try again.");
    } else {
      setShowAddModal(false);
      setMedicineName("");
      setDosage("");
      setInstructions("");
      setStatusMsg(`Reminder for ${newRem.medicine_name} scheduled!`);
      setTimeout(() => setStatusMsg(""), 3500);
      if (data) setReminders((prev) => [data, ...prev]);
    }
  };

  const handleToggleTaken = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    await medicineService.toggleTaken(id, newStatus);
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, taken_today: newStatus } : r))
    );
  };

  const handleDelete = async (id) => {
    if (confirm("Remove this medicine reminder?")) {
      await medicineService.deleteReminder(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="feature-page reminders-page">
      <div className="page-header">
        <div className="page-header-content">
          <span className="section-kicker">FEATURE 5 • PRESCRIPTION SCHEDULE</span>
          <h1>Medicine Reminders 💊</h1>
          <p className="page-description">
            Track daily medications, dosage instructions, and mark completed doses.
            Never miss an essential dose again.
          </p>
        </div>
        <div className="header-actions-row">
          {notificationPermission !== "granted" ? (
            <button
              type="button"
              className="button button-outline"
              onClick={requestNotificationAccess}
            >
              <Bell size={15} /> Enable Browser Alerts
            </button>
          ) : (
            <span className="badge-pill success">
              <Bell size={13} /> Alerts Enabled
            </span>
          )}
          <button
            type="button"
            className="button button-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} /> Add Medicine
          </button>
        </div>
      </div>

      <div className="safety-banner note-banner">
        <Info size={18} className="banner-icon" />
        <div>
          <strong>Browser Notification Notice:</strong> Browser notification reminders operate
          reliably while this tab or browser is active. Always keep an official printed prescription
          or pillbox schedule as primary confirmation.
        </div>
      </div>

      {statusMsg && (
        <div className="alert-box success" style={{ marginTop: "16px" }}>
          <CheckCircle2 size={16} /> {statusMsg}
        </div>
      )}

      {/* Reminders List */}
      <div className="reminders-container" style={{ marginTop: "24px" }}>
        {loading ? (
          <div className="loading-state-box">
            <Clock size={32} className="spin" />
            <p>Loading prescription schedules...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="empty-state-box">
            <Pill size={48} className="empty-icon" />
            <h3>No medicine reminders scheduled</h3>
            <p>Add your prescribed daily or weekly medications to view and track doses.</p>
            <button
              className="button button-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} /> Add First Medicine
            </button>
          </div>
        ) : (
          <div className="reminders-grid">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className={`reminder-card ${rem.taken_today ? "is-taken" : ""}`}
              >
                <div className="reminder-card-header">
                  <div className="med-icon-wrap">
                    <Pill size={20} />
                  </div>
                  <div className="med-info">
                    <h3 className="med-name">{rem.medicine_name}</h3>
                    <span className="med-dosage">{rem.dosage}</span>
                  </div>
                  <button
                    type="button"
                    className="icon-button danger"
                    onClick={() => handleDelete(rem.id)}
                    title="Delete reminder"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="reminder-schedule-row">
                  <span className="schedule-badge">
                    <Clock size={13} /> {rem.schedule || `Daily at ${rem.time_of_day}`}
                  </span>
                  {rem.instructions && (
                    <span className="instructions-text">{rem.instructions}</span>
                  )}
                </div>

                <div className="reminder-card-footer">
                  <span className={`status-tag ${rem.taken_today ? "done" : "pending"}`}>
                    {rem.taken_today ? "Completed Today ✓" : "Pending Today"}
                  </span>
                  <button
                    type="button"
                    className={`button btn-sm ${
                      rem.taken_today ? "button-outline" : "button-primary"
                    }`}
                    onClick={() => handleToggleTaken(rem.id, rem.taken_today)}
                  >
                    {rem.taken_today ? (
                      <>
                        <XCircle size={14} /> Mark as Skipped
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} /> Mark as Taken
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule Medicine Reminder</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="modal-form">
              <div className="form-group">
                <label>Medicine Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol, Metformin, Telmisartan"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                />
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Dosage & Strength *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500mg, 1 tablet, 5ml"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Time of Day</label>
                  <input
                    type="time"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Frequency & Schedule</label>
                <select value={schedule} onChange={(e) => setSchedule(e.target.value)}>
                  <option value="Daily at 8:00 AM">Daily at 8:00 AM (Morning)</option>
                  <option value="Daily at 1:00 PM">Daily at 1:00 PM (Afternoon)</option>
                  <option value="Daily at 8:00 PM">Daily at 8:00 PM (Evening / Dinner)</option>
                  <option value="Twice Daily (Morning & Night)">Twice Daily (Morning & Night)</option>
                  <option value="Three Times Daily (With Meals)">Three Times Daily (With Meals)</option>
                  <option value="Weekly Every Monday">Weekly Every Monday</option>
                  <option value="As Needed (PRN)">As Needed (PRN)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Special Instructions (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Take with warm water after food, do not crush tablet"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Add Reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
