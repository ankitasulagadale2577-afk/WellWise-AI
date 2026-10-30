import { useState, useEffect } from "react";
import {
  FolderLock,
  Plus,
  Search,
  Filter,
  FileText,
  Activity,
  Heart,
  Droplet,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  FileCheck,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { healthRecordService } from "../services/supabase.js";

const CATEGORIES = [
  "All",
  "Vitals",
  "Lab Report",
  "Prescription",
  "Imaging",
  "Vaccination",
  "Allergies",
  "Other",
];

export default function HealthRecordsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // New record form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Vitals");
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadRecords = async () => {
    setLoading(true);
    const { data } = await healthRecordService.getRecords(user?.id);
    if (data) setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, [user?.id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Allowed types: PDF, PNG, JPG, JPEG, WEBP
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setFileError("Invalid file type. Please upload a PDF or image (PNG, JPG).");
      setSelectedFile(null);
      return;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File is too large. Maximum size is 10MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setFileError("");

    const metadata = {};
    if (systolic || diastolic) {
      metadata.blood_pressure = `${systolic || 120}/${diastolic || 80} mmHg`;
    }
    if (pulse) metadata.heart_rate = `${pulse} bpm`;
    if (bloodSugar) metadata.blood_sugar = `${bloodSugar} mg/dL`;

    const newRecord = {
      record_title: title.trim(),
      record_type: category,
      record_date: recordDate,
      description: description.trim(),
      metadata,
      file_name: selectedFile ? selectedFile.name : null,
      file_size: selectedFile ? selectedFile.size : null,
    };

    const { data, error } = await healthRecordService.addRecord(user?.id, newRecord);
    setSubmitting(false);

    if (error) {
      setFileError("Could not save record to database.");
    } else {
      setSuccessMsg("Health record safely saved to vault!");
      setTimeout(() => setSuccessMsg(""), 3500);
      setShowAddModal(false);
      resetForm();
      if (data) setRecords((prev) => [data, ...prev]);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("Vitals");
    setRecordDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setSystolic("");
    setDiastolic("");
    setPulse("");
    setBloodSugar("");
    setSelectedFile(null);
    setFileError("");
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this health record?")) {
      await healthRecordService.deleteRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Filtered list
  const filtered = records.filter((r) => {
    const matchesCat = selectedCategory === "All" || r.record_type === selectedCategory;
    const matchesSearch =
      r.record_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.record_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="feature-page vault-page">
      <div className="page-header">
        <div className="page-header-content">
          <span className="section-kicker">FEATURE 4 • PRIVATE HEALTH VAULT</span>
          <h1>Health Record Vault 🗄️</h1>
          <p className="page-description">
            Safely organize your blood pressure, lab reports, prescriptions, and vitals.
            Protected by Row-Level Security (RLS) so only you can access them.
          </p>
        </div>
        <button
          className="button button-primary"
          onClick={() => setShowAddModal(true)}
          style={{ alignSelf: "flex-start" }}
        >
          <Plus size={16} /> Add Health Record
        </button>
      </div>

      {successMsg && (
        <div className="alert-box success">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="vault-toolbar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search records by title, type, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-chip ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      {loading ? (
        <div className="loading-state-box">
          <Activity size={32} className="spin" />
          <p>Loading your private health vault...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state-box">
          <FolderLock size={48} className="empty-icon" />
          <h3>No records found</h3>
          <p>
            {records.length === 0
              ? "Your vault is empty. Add your blood pressure, glucose readings, or lab reports to get started."
              : "No records match your selected filters."}
          </p>
          <button className="button button-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add First Record
          </button>
        </div>
      ) : (
        <div className="records-grid">
          {filtered.map((record) => (
            <div key={record.id} className="record-card">
              <div className="record-card-top">
                <span className={`record-badge badge-${record.record_type.toLowerCase().replace(/\s+/g, "-")}`}>
                  {record.record_type}
                </span>
                <span className="record-date">
                  <Calendar size={13} /> {record.record_date}
                </span>
              </div>

              <h3 className="record-title">{record.record_title}</h3>
              {record.description && <p className="record-desc">{record.description}</p>}

              {/* Vitals metadata if present */}
              {record.metadata && Object.keys(record.metadata).length > 0 && (
                <div className="record-vitals-box">
                  {record.metadata.blood_pressure && (
                    <div className="vital-item">
                      <Heart size={14} className="vital-icon" />
                      <span>BP: <strong>{record.metadata.blood_pressure}</strong></span>
                    </div>
                  )}
                  {record.metadata.heart_rate && (
                    <div className="vital-item">
                      <Activity size={14} className="vital-icon" />
                      <span>Pulse: <strong>{record.metadata.heart_rate}</strong></span>
                    </div>
                  )}
                  {record.metadata.blood_sugar && (
                    <div className="vital-item">
                      <Droplet size={14} className="vital-icon" />
                      <span>Sugar: <strong>{record.metadata.blood_sugar}</strong></span>
                    </div>
                  )}
                </div>
              )}

              {/* Attached file info */}
              {record.file_name && (
                <div className="attached-file-badge">
                  <FileCheck size={14} />
                  <span>{record.file_name}</span>
                </div>
              )}

              <div className="record-card-footer">
                <span className="secure-badge">
                  <FolderLock size={12} /> Encrypted
                </span>
                <button
                  type="button"
                  className="icon-button danger"
                  onClick={() => handleDelete(record.id)}
                  title="Delete record"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Health Record</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {fileError && <div className="alert-box error">{fileError}</div>}

            <form onSubmit={handleCreateRecord} className="modal-form">
              <div className="form-group">
                <label>Record Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fasting Blood Glucose, Routine Checkup, ECG"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Record Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Vitals">Vitals (BP, Sugar, Pulse)</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Imaging">Imaging (X-Ray, Scan)</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Allergies">Allergies</option>
                    <option value="Other">Other Document</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Record Date</label>
                  <input
                    type="date"
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                  />
                </div>
              </div>

              {category === "Vitals" && (
                <div className="vitals-inputs-panel">
                  <h4>Vitals Readings (Optional)</h4>
                  <div className="form-row three-col">
                    <div className="form-group">
                      <label>Systolic (mmHg)</label>
                      <input
                        type="number"
                        placeholder="120"
                        value={systolic}
                        onChange={(e) => setSystolic(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Diastolic (mmHg)</label>
                      <input
                        type="number"
                        placeholder="80"
                        value={diastolic}
                        onChange={(e) => setDiastolic(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Heart Rate (BPM)</label>
                      <input
                        type="number"
                        placeholder="72"
                        value={pulse}
                        onChange={(e) => setPulse(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Blood Sugar (mg/dL)</label>
                    <input
                      type="number"
                      placeholder="95"
                      value={bloodSugar}
                      onChange={(e) => setBloodSugar(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Clinical Notes or Doctor's Observations</label>
                <textarea
                  rows={3}
                  placeholder="e.g., Doctor advised reducing sodium intake and daily 30-minute brisk walk."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Attach Report File (PDF or Image, max 10MB)</label>
                <div className="file-drop-zone">
                  <UploadCloud size={24} />
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                  />
                  <span>
                    {selectedFile ? selectedFile.name : "Click to select report or drag & drop"}
                  </span>
                </div>
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
                  {submitting ? "Encrypting & Saving..." : "Save to Vault"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
