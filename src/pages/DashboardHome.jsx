import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Pill,
  Siren,
  Bot,
  Mic,
  FolderLock,
  Syringe,
  Hospital,
  BookOpen,
  MessageSquare,
  Globe,
  Settings,
  ChevronRight,
  ChevronDown,
  Calendar,
  CheckCircle2,
  Heart,
  Clock,
  Sparkles,
  Phone,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import {
  healthRecordService,
  medicineService,
  vaccinationService,
  appointmentService,
} from "../services/supabase.js";

export default function DashboardHome() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Dynamic user data from Supabase
  const [recordCount, setRecordCount] = useState(2);
  const [medReminders, setMedReminders] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName =
    profile?.full_name?.trim()?.split(/\s+/)[0] ||
    user?.user_metadata?.full_name?.trim()?.split(/\s+/)[0] ||
    user?.email?.split("@")[0] ||
    "there";

  // Formatted date for "Today's health"
  const todayFormatted = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.id) return;
      try {
        const [recsRes, medsRes, vacsRes, aptsRes] = await Promise.all([
          healthRecordService.getRecords(user.id),
          medicineService.getReminders(user.id),
          vaccinationService.getVaccinations(user.id),
          appointmentService.getAppointments(user.id),
        ]);

        if (recsRes.data) setRecordCount(recsRes.data.length);
        if (medsRes.data) setMedReminders(medsRes.data);
        if (vacsRes.data) setVaccinations(vacsRes.data);
        if (aptsRes.data) setAppointments(aptsRes.data);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user?.id]);

  // Grouped 12 Healthcare Features into Foldable Categories (Matching Sidebar)
  const featureGroups = [
    {
      group: "CARE",
      tagline: "AI assistant, voice triage & doctor visit summary",
      cards: [
        {
          title: "AI Health Assistant",
          desc: "Ask general health questions in your language.",
          path: "/assistant",
          icon: Bot,
          color: "teal",
        },
        {
          title: "Voice Assistant",
          desc: "Speak instead of typing and listen to answers.",
          path: "/voice",
          icon: Mic,
          color: "teal",
        },
        {
          title: "Voice-to-Doctor Passport",
          desc: "Describe symptoms, confirm and get a visit summary.",
          path: "/doctor-passport",
          icon: FileText,
          color: "teal",
        },
      ],
    },
    {
      group: "MY HEALTH",
      tagline: "Health records, daily medicine & vaccination alerts",
      cards: [
        {
          title: "Health Record Vault",
          desc: "Save BP, heart rate and allergies. See your history.",
          path: "/health-records",
          icon: FolderLock,
          color: "teal",
        },
        {
          title: "Medicine Reminders",
          desc: "Enter your prescribed schedule. See what is next.",
          path: "/medicine-reminders",
          icon: Pill,
          color: "teal",
        },
        {
          title: "Vaccination Info",
          desc: "General information plus your own records.",
          path: "/vaccination",
          icon: Syringe,
          color: "teal",
        },
      ],
    },
    {
      group: "FIND HELP",
      tagline: "Nearby hospitals map & emergency helplines",
      cards: [
        {
          title: "Nearby Hospitals",
          desc: "Find care near you and get directions.",
          path: "/hospitals",
          icon: Hospital,
          color: "teal",
        },
        {
          title: "Emergency Assistance",
          desc: "Call 112 and read first-aid guidance.",
          path: "/emergency",
          icon: Siren,
          color: "coral",
        },
      ],
    },
    {
      group: "LEARN & CONNECT",
      tagline: "Educational health library & WhatsApp chatbot",
      cards: [
        {
          title: "Health Library",
          desc: "Search articles and bookmark your favourites.",
          path: "/library",
          icon: BookOpen,
          color: "teal",
        },
        {
          title: "WhatsApp Companion",
          desc: "Continue your chat on WhatsApp.",
          path: "/whatsapp",
          icon: MessageSquare,
          color: "teal",
        },
      ],
    },
    {
      group: "ACCOUNT",
      tagline: "Language customization & account settings",
      cards: [
        {
          title: "Multilingual Support",
          desc: "English, मराठी, हिन्दी and ಕನ್ನಡ.",
          path: "/multilingual",
          icon: Globe,
          color: "teal",
        },
        {
          title: "Profile & Settings",
          desc: "Your name, language and preferences.",
          path: "/profile",
          icon: Settings,
          color: "teal",
        },
      ],
    },
  ];

  // Accordion state to fold/unfold categories in main dashboard
  const [openSections, setOpenSections] = useState({
    CARE: true,
    "MY HEALTH": true,
    "FIND HELP": true,
    "LEARN & CONNECT": true,
    ACCOUNT: true,
  });

  const toggleSection = (group) => {
    setOpenSections((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const collapseAll = () => {
    setOpenSections({
      CARE: false,
      "MY HEALTH": false,
      "FIND HELP": false,
      "LEARN & CONNECT": false,
      ACCOUNT: false,
    });
  };

  const expandAll = () => {
    setOpenSections({
      CARE: true,
      "MY HEALTH": true,
      "FIND HELP": true,
      "LEARN & CONNECT": true,
      ACCOUNT: true,
    });
  };

  const allCollapsed = Object.values(openSections).every((v) => !v);

  return (
    <div className="dashboard-content-layout">
      {/* =========================================================================
          LEFT / MAIN COLUMN
          ========================================================================= */}
      <div className="dashboard-main-col">
        {/* Welcome Section with Botanical Leaf Decoration */}
        <section className="welcome-banner-card">
          <div className="welcome-text-col">
            <h1 className="welcome-heading">Hello, welcome back!</h1>
            <p className="welcome-subheading">Your health, all in one place.</p>
          </div>
          <div className="welcome-leaves-art" aria-hidden="true">
            <svg viewBox="0 0 160 120" fill="none" className="botanical-svg">
              <path
                d="M40 90C45 60 70 40 110 30C105 60 80 80 40 90Z"
                fill="#2E7D32"
                fillOpacity="0.18"
              />
              <path
                d="M100 20C110 40 120 70 90 95C85 70 75 40 100 20Z"
                fill="#079B68"
                fillOpacity="0.22"
              />
              <path
                d="M60 45C80 35 110 50 125 75C100 80 75 65 60 45Z"
                fill="#104B50"
                fillOpacity="0.15"
              />
            </svg>
          </div>
        </section>

        {/* Top 3 Summary Action Cards */}
        <div className="quick-summary-grid">
          {/* Health Records */}
          <Link to="/health-records" className="summary-pill-card">
            <div className="summary-pill-icon mint-bg">
              <FolderLock size={20} className="icon-green" />
            </div>
            <div className="summary-pill-info">
              <strong>Health records</strong>
              <small>{recordCount} records saved</small>
            </div>
            <ChevronRight size={18} className="summary-pill-chevron" />
          </Link>

          {/* Upcoming Reminders */}
          <Link to="/medicine-reminders" className="summary-pill-card">
            <div className="summary-pill-icon mint-bg">
              <Pill size={20} className="icon-green" />
            </div>
            <div className="summary-pill-info">
              <strong>Upcoming reminders</strong>
              <small>
                {medReminders.length || 1} medicine • {vaccinations.length || 1} vaccination
              </small>
            </div>
            <ChevronRight size={18} className="summary-pill-chevron" />
          </Link>

          {/* Emergency Access */}
          <Link to="/emergency" className="summary-pill-card emergency-pill-card">
            <div className="summary-pill-icon coral-bg">
              <Siren size={20} className="icon-coral" />
            </div>
            <div className="summary-pill-info">
              <strong>Emergency access</strong>
              <small>Call 112 • Quick help</small>
            </div>
            <ChevronRight size={18} className="summary-pill-chevron" />
          </Link>
        </div>

        {/* Healthcare Features Area with Foldable Controls */}
        <div className="dashboard-features-header-row">
          <div className="features-header-title">
            <h2>Healthcare Features</h2>
            <span className="features-badge-count">12 tools in 5 foldable sections</span>
          </div>
          <button
            type="button"
            className="fold-all-toggle-btn"
            onClick={allCollapsed ? expandAll : collapseAll}
          >
            {allCollapsed ? "Expand All ⌵" : "Fold All ⌃"}
          </button>
        </div>

        {/* Foldable Feature Categories (Like Sidebar) */}
        <div className="foldable-categories-container">
          {featureGroups.map((group) => {
            const isOpen = openSections[group.group] !== false;
            return (
              <div key={group.group} className="foldable-category-section">
                <button
                  type="button"
                  className="category-foldable-header"
                  onClick={() => toggleSection(group.group)}
                  aria-expanded={isOpen}
                  title={isOpen ? `Fold ${group.group} section` : `Expand ${group.group} section`}
                >
                  <div className="category-header-left">
                    <span className="category-indicator-dot" />
                    <div>
                      <h3 className="category-group-name">{group.group}</h3>
                      <p className="category-tagline">{group.tagline}</p>
                    </div>
                  </div>
                  <div className="category-header-right">
                    <span className="category-count-pill">{group.cards.length} features</span>
                    <span className={`category-chevron-icon ${isOpen ? "open" : "folded"}`}>
                      <ChevronDown size={18} />
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="features-card-grid">
                    {group.cards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <Link key={card.title} to={card.path} className="feature-grid-card">
                          <div
                            className={`feature-icon-box ${
                              card.color === "coral" ? "coral-box" : "mint-box"
                            }`}
                          >
                            <Icon
                              size={22}
                              className={card.color === "coral" ? "icon-coral" : "icon-green"}
                            />
                          </div>
                          <div className="feature-text-box">
                            <h4 className="feature-card-title">{card.title}</h4>
                            <p className="feature-card-desc">{card.desc}</p>
                          </div>
                          <ChevronRight size={18} className="feature-card-chevron" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          RIGHT-SIDE "TODAY'S HEALTH" PANEL (Matches reference image 2)
          ========================================================================= */}
      <aside className="dashboard-right-panel">
        {/* Date Header */}
        <div className="panel-header-row">
          <div className="today-label-wrap">
            <span className="panel-leaf-dot">🌿</span>
            <div>
              <h2 className="panel-title">Today's health</h2>
              <span className="panel-date-str">{todayFormatted}</span>
            </div>
          </div>
          <Calendar size={18} className="calendar-header-icon" />
        </div>

        {/* Health Status Card: All Good */}
        <div className="status-all-good-card">
          <div className="status-all-good-inner">
            <div className="status-check-circle">
              <CheckCircle2 size={24} className="check-svg" />
            </div>
            <div className="status-good-text">
              <strong>All good!</strong>
              <p>No urgent health alerts today.</p>
            </div>
          </div>
          <div className="status-leaf-decor" aria-hidden="true">
            <svg viewBox="0 0 60 50" fill="none">
              <path
                d="M10 40C20 20 40 10 55 5C45 25 30 40 10 40Z"
                fill="#079B68"
                fillOpacity="0.2"
              />
            </svg>
          </div>
        </div>

        {/* Upcoming Reminders Section */}
        <div className="upcoming-reminders-section">
          <div className="reminders-section-top">
            <div className="reminders-title-wrap">
              <span className="bell-badge-icon">🔔</span>
              <h3>Upcoming reminders</h3>
            </div>
            <Link to="/medicine-reminders" className="view-all-link">
              View all
            </Link>
          </div>

          <div className="upcoming-items-list">
            {/* Paracetamol / Medicine Item */}
            <Link to="/medicine-reminders" className="upcoming-item-row">
              <div className="upcoming-item-icon-circle coral-soft-bg">
                <Pill size={16} className="item-icon-coral" />
              </div>
              <div className="upcoming-item-details">
                <strong>{medReminders[0]?.medicine_name || "Paracetamol 500mg"}</strong>
                <small>{medReminders[0]?.schedule || "Today • 8:00 PM"}</small>
              </div>
              <ChevronRight size={16} className="upcoming-chevron" />
            </Link>

            {/* HPV / Vaccine Item */}
            <Link to="/vaccination" className="upcoming-item-row">
              <div className="upcoming-item-icon-circle mint-soft-bg">
                <Syringe size={16} className="item-icon-green" />
              </div>
              <div className="upcoming-item-details">
                <strong>{vaccinations[0]?.vaccine_name || "HPV Vaccine"}</strong>
                <small>{vaccinations[0]?.next_due_date ? `${vaccinations[0].next_due_date} • 10:00 AM` : "12 May 2026 • 10:00 AM"}</small>
              </div>
              <ChevronRight size={16} className="upcoming-chevron" />
            </Link>

            {/* Doctor Appointment Item */}
            <Link to="/hospitals" className="upcoming-item-row">
              <div className="upcoming-item-icon-circle mint-soft-bg">
                <Calendar size={16} className="item-icon-green" />
              </div>
              <div className="upcoming-item-details">
                <strong>{appointments[0]?.doctor_name || "Doctor Appointment"}</strong>
                <small>{appointments[0]?.appointment_date ? new Date(appointments[0].appointment_date).toLocaleDateString() : "20 May 2026 • 4:00 PM"}</small>
              </div>
              <ChevronRight size={16} className="upcoming-chevron" />
            </Link>
          </div>
        </div>

        {/* Bottom Attractive Wellness Card */}
        <div className="wellness-promo-card">
          <div className="wellness-card-content">
            <h4 className="wellness-title">Small steps to a healthier you</h4>
            <p className="wellness-sub">Stay informed. Stay healthy.</p>
            <div className="wellness-card-heart">
              <Heart size={20} className="wellness-heart-icon" />
            </div>
          </div>
          <div className="wellness-botanical-bg" aria-hidden="true">
            <svg viewBox="0 0 100 90" fill="none">
              <path
                d="M20 80C30 40 60 20 95 10C80 50 50 80 20 80Z"
                fill="#079B68"
                fillOpacity="0.25"
              />
              <path
                d="M50 85C65 55 85 40 98 30C90 60 70 85 50 85Z"
                fill="#104B50"
                fillOpacity="0.2"
              />
            </svg>
          </div>
        </div>
      </aside>
    </div>
  );
}
