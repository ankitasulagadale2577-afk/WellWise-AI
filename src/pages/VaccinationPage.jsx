import { useState, useEffect } from "react";
import {
  Syringe,
  CalendarDays,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Bell,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Info,
} from "lucide-react";
import { VACCINES_DATA } from "../data/initialData.js";
import { vaccinationService } from "../services/supabase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const RECOMMENDED_CARDS = [
  {
    id: "bcg",
    name: "BCG",
    disease: "Tuberculosis",
    schedule: "At Birth (or as early as possible)",
    purpose: "Protects against TB",
    iconBg: "mint",
  },
  {
    id: "hepb",
    name: "Hepatitis B",
    disease: "Liver disease",
    schedule: "Within 24 hours",
    purpose: "Prevents Hepatitis B",
    iconBg: "mint",
  },
  {
    id: "mmr",
    name: "MMR",
    disease: "Measles, Mumps, Rubella",
    schedule: "9-12 months",
    purpose: "Protects from 3 viral diseases",
    iconBg: "purple",
  },
  {
    id: "dpt",
    name: "DPT",
    disease: "Diphtheria, Tetanus, Pertussis",
    schedule: "2, 4, 6, 15-18 months",
    purpose: "Builds strong immunity",
    iconBg: "orange",
  },
];

export default function VaccinationPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All"); // 'All' | 'Child (0-12)' | 'Adult (19-59)' | 'Senior (60+)'
  const [reminders, setReminders] = useState([
    {
      id: "rem-hpv",
      vaccine_name: "HPV (Female)",
      recipient_name: "Self",
      dose: "2nd Dose",
      planned_date: "2026-11-12",
      status: "Upcoming",
    },
  ]);

  const [selectedVaccineDetail, setSelectedVaccineDetail] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVaccine, setNewVaccine] = useState("");
  const [newDose, setNewDose] = useState("1st Dose");
  const [newDate, setNewDate] = useState("");
  const [newRecipient, setNewRecipient] = useState("Self");

  useEffect(() => {
    async function loadUserVaccines() {
      if (user?.id) {
        const { data } = await vaccinationService.getVaccinations(user.id);
        if (data && data.length > 0) {
          setReminders(
            data.map((v) => ({
              id: v.id,
              vaccine_name: v.vaccine_name,
              recipient_name: v.recipient_name,
              dose: v.dose || "Dose 1",
              planned_date: v.next_due_date || v.vaccination_date || "2026-11-12",
              status: v.status === "completed" ? "Completed" : "Upcoming",
            }))
          );
        }
      }
    }
    loadUserVaccines();
  }, [user?.id]);

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!newVaccine.trim() || !newDate) return;

    const newEntry = {
      id: "rem-" + Date.now(),
      vaccine_name: newVaccine.trim(),
      recipient_name: newRecipient.trim(),
      dose: newDose,
      planned_date: newDate,
      status: "Upcoming",
    };

    setReminders([newEntry, ...reminders]);
    setShowAddModal(false);
    setNewVaccine("");
    setNewDate("");

    if (user?.id) {
      await vaccinationService.addVaccination(user.id, {
        vaccine_name: newEntry.vaccine_name,
        recipient_name: newEntry.recipient_name,
        dose: newEntry.dose,
        next_due_date: newEntry.planned_date,
        status: "upcoming",
      });
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Completed" ? "Upcoming" : "Completed";
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );
    if (user?.id && !id.startsWith("rem-hpv")) {
      await vaccinationService.updateStatus(id, nextStatus.toLowerCase());
    }
  };

  const filteredRecommended = RECOMMENDED_CARDS.filter((v) => {
    const q = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.disease.toLowerCase().includes(q) ||
      v.purpose.toLowerCase().includes(q)
    );
  });

  return (
    <div className="vaccine-page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="vaccine-page-title">Vaccination Information</h1>
          <p className="vaccine-page-subtitle">
            Stay protected. Check vaccine details, schedules and set reminders.
          </p>
        </div>
      </div>

      {/* Search Bar & Age Filters */}
      <div className="vaccine-toolbar">
        <div className="vaccine-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search vaccine, disease or age..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" className="button button-primary btn-sm">
            Search
          </button>
        </div>

        <div className="vaccine-filter-pills">
          {["All", "Child (0-12)", "Adult (19-59)", "Senior (60+)"].map((filter) => (
            <button
              key={filter}
              type="button"
              className={`vac-filter-pill ${selectedFilter === filter ? "active" : ""}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Vaccines 4-Grid */}
      <section className="recommended-vaccines-section">
        <h2 className="section-sub-title">Recommended Vaccines</h2>
        <div className="recommended-grid-4">
          {filteredRecommended.map((vac) => (
            <div key={vac.id} className="vaccine-rec-card">
              <div className="rec-card-top">
                <div className="rec-icon-wrap mint">
                  <Syringe size={18} />
                </div>
                <div className="rec-names">
                  <strong>{vac.name}</strong>
                  <small>{vac.disease}</small>
                </div>
              </div>

              <div className="rec-timing-row">
                <span className="timing-label">{vac.schedule}</span>
                <p className="purpose-text">{vac.purpose}</p>
              </div>

              <button
                type="button"
                className="button button-primary btn-sm view-details-btn"
                onClick={() =>
                  setSelectedVaccineDetail(
                    VACCINES_DATA.find((v) => v.id === vac.id) || vac
                  )
                }
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* My Reminders Table Section */}
      <section className="my-reminders-section">
        <div className="reminders-header-row">
          <h2 className="section-sub-title">My Reminders</h2>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              type="button"
              className="button button-primary btn-sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={14} /> Set Reminder
            </button>
            <span className="view-all-text">View All</span>
          </div>
        </div>

        <div className="reminders-table-wrapper">
          <table className="reminders-table">
            <thead>
              <tr>
                <th>Vaccine</th>
                <th>Next Dose</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((rem) => (
                <tr key={rem.id}>
                  <td>
                    <strong>{rem.vaccine_name}</strong>
                    {rem.recipient_name && <small className="recipient-tag"> • {rem.recipient_name}</small>}
                  </td>
                  <td>{rem.dose}</td>
                  <td>{rem.planned_date}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        rem.status === "Completed" ? "completed" : "upcoming"
                      }`}
                    >
                      {rem.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="table-action-btn"
                      onClick={() => handleToggleStatus(rem.id, rem.status)}
                    >
                      {rem.status === "Completed" ? "Mark Pending" : "Mark Done"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Vaccine Detail Modal */}
      {selectedVaccineDetail && (
        <div className="modal-backdrop" onClick={() => setSelectedVaccineDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedVaccineDetail.name}</h2>
              <button className="close-btn" onClick={() => setSelectedVaccineDetail(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body-detail">
              <p>
                <strong>Schedule:</strong> {selectedVaccineDetail.schedule}
              </p>
              <p style={{ marginTop: "10px" }}>
                <strong>Protection Purpose:</strong> {selectedVaccineDetail.purpose}
              </p>
              {selectedVaccineDetail.precautions && (
                <p style={{ marginTop: "10px" }}>
                  <strong>Precautions:</strong> {selectedVaccineDetail.precautions}
                </p>
              )}
              {selectedVaccineDetail.source && (
                <small className="source-note" style={{ display: "block", marginTop: "16px", color: "#799F98" }}>
                  Source: {selectedVaccineDetail.source}
                </small>
              )}
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  setNewVaccine(selectedVaccineDetail.name);
                  setSelectedVaccineDetail(null);
                  setShowAddModal(true);
                }}
              >
                Schedule This Vaccine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Vaccination Reminder</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleAddReminder} className="modal-form">
              <div className="form-group">
                <label>Vaccine Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HPV, Hepatitis B, Influenza"
                  value={newVaccine}
                  onChange={(e) => setNewVaccine(e.target.value)}
                />
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Recipient Name</label>
                  <input
                    type="text"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Dose</label>
                  <select value={newDose} onChange={(e) => setNewDose(e.target.value)}>
                    <option value="1st Dose">1st Dose</option>
                    <option value="2nd Dose">2nd Dose</option>
                    <option value="Booster Dose">Booster Dose</option>
                    <option value="Annual">Annual Dose</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Scheduled Due Date *</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
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
                <button type="submit" className="button button-primary">
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
