import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  ArrowRight,
  Heart,
  Calendar,
  FolderLock,
  MapPin,
  Bot,
  Mic,
  FileText,
  Pill,
  Syringe,
  Hospital,
  Siren,
  BookOpen,
  MessageSquare,
  Globe,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Plus,
  MessageCircle,
} from "lucide-react";
import Brand from "../components/Brand.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function LandingPage() {
  const { t, language, setLanguage, languages } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const all12Features = [
    {
      title: "AI Health Assistant",
      desc: "Multilingual chat for symptom education and preliminary triage without replacement of licensed doctors.",
      path: "/assistant",
      icon: Bot,
      category: "Care",
    },
    {
      title: "Voice Assistant",
      desc: "Hands-free speech-to-text and text-to-speech interaction in your regional Indian mother tongue.",
      path: "/voice",
      icon: Mic,
      category: "Care",
    },
    {
      title: "Voice-to-Doctor Passport",
      desc: "Dictate symptoms into a printable, structured clinical visit passport to empower physician conversations.",
      path: "/doctor-passport",
      icon: FileText,
      category: "Care",
    },
    {
      title: "Health Record Vault",
      desc: "Encrypted personal vault for blood pressure, glucose logs, prescriptions, and lab report documents.",
      path: "/health-records",
      icon: FolderLock,
      category: "My Health",
    },
    {
      title: "Medicine Reminders",
      desc: "Daily dosage schedules, taken/skipped logs, and browser notifications to ensure medication adherence.",
      path: "/medicine-reminders",
      icon: Pill,
      category: "My Health",
    },
    {
      title: "Vaccination Information",
      desc: "Universal Immunisation Programme (UIP) schedules and personal vaccine dose reminders for family.",
      path: "/vaccination",
      icon: Syringe,
      category: "My Health",
    },
    {
      title: "Nearby Hospitals & Clinics",
      desc: "Interactive OpenStreetMap locator for verified hospitals, pharmacies, and clinics with direct routes.",
      path: "/hospitals",
      icon: Hospital,
      category: "Find Help",
    },
    {
      title: "Emergency Assistance",
      desc: "Rapid one-tap 112 dialing, ambulance 108, life-saving first-aid protocols, and emergency contacts.",
      path: "/emergency",
      icon: Siren,
      category: "Find Help",
    },
    {
      title: "Health Education Library",
      desc: "Medically verified health articles from WHO, MoHFW, and ICMR with bookmarks and search.",
      path: "/library",
      icon: BookOpen,
      category: "Learn",
    },
    {
      title: "WhatsApp Companion",
      desc: "Encrypted click-to-chat messaging to log symptoms and receive reminder updates on WhatsApp.",
      path: "/whatsapp",
      icon: MessageSquare,
      category: "Connect",
    },
    {
      title: "Multilingual Support",
      desc: "Full native support for English, Marathi (मराठी), Hindi (हिन्दी), and Kannada (ಕನ್ನಡ).",
      path: "/multilingual",
      icon: Globe,
      category: "Account",
    },
    {
      title: "Profile & Privacy Controls",
      desc: "Manage health preferences, account security, notification permissions, and complete data privacy.",
      path: "/profile",
      icon: ShieldCheck,
      category: "Account",
    },
  ];

  return (
    <div className="landing-page-wrap">
      {/* =========================================================================
          LANDING HEADER (Matches reference image 1)
          ========================================================================= */}
      <header className="landing-top-nav">
        <div className="landing-nav-inner">
          <Brand to="/" />

          <nav className="landing-menu-links">
            <Link to="/doctor-passport" className="nav-menu-link">
              Doctor Passport
            </Link>
            <a href="#features" className="nav-menu-link">
              Features
            </a>
            <Link to="/library" className="nav-menu-link">
              Health topics
            </Link>
            <Link to="/multilingual" className="nav-menu-link">
              Languages
            </Link>
          </nav>

          <div className="landing-header-cta-group">
            {!user && (
              <Link to="/login" className="nav-menu-link header-signin-link">
                Sign In
              </Link>
            )}
            <Link
              to={user ? "/dashboard" : "/login"}
              className="button button-dashboard-pill"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION (Matches reference image 1)
          ========================================================================= */}
      <section className="landing-hero-section">
        <div className="hero-grid-container">
          {/* Left Column: Copy & Actions */}
          <div className="hero-copy-col">
            <div className="hero-lang-badge">
              <Leaf size={14} className="badge-leaf-icon" />
              <span>Health help in English, मराठी, हिन्दी and ಕನ್ನಡ</span>
            </div>

            <h1 className="hero-main-headline">
              Smarter healthcare <br />
              <span className="green-accent">for everyone.</span>
            </h1>

            <p className="hero-subtext">
              Ask questions, get trusted guidance, prepare for doctor visits, keep track of your
              health records and find care nearby — all in one friendly place.
            </p>

            <div className="hero-buttons-row">
              <Link
                to={user ? "/dashboard" : "/login"}
                className="button hero-btn-primary"
              >
                <span>Get started free</span>
                <ArrowRight size={17} />
              </Link>

              <a href="#features" className="button hero-btn-outline">
                Explore 12 features
              </a>
            </div>
          </div>

          {/* Right Column: Stethoscope + 3D Green Heart Visual + 4 Floating Interactive Cards */}
          <div className="hero-visual-col">
            <div className="hero-art-stage">
              {/* Background ambient medical glows */}
              <div className="art-ambient-glow" />
              <div className="medical-cross-decor" aria-hidden="true">+</div>

              {/* Central Stethoscope & Emerald Heart Graphic */}
              <div className="central-hero-graphic">
                <svg viewBox="0 0 540 380" className="stethoscope-svg-art" fill="none">
                  <defs>
                    <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E4D48" />
                      <stop offset="50%" stopColor="#0E7852" />
                      <stop offset="100%" stopColor="#2A6F62" />
                    </linearGradient>
                    <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0AA670" />
                      <stop offset="60%" stopColor="#079B68" />
                      <stop offset="100%" stopColor="#046845" />
                    </linearGradient>
                    <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#079B68" floodOpacity="0.35" />
                    </filter>
                  </defs>

                  {/* Stethoscope Rubber Tubes */}
                  <path
                    d="M 120 280 C 120 180, 240 120, 320 140 C 400 160, 480 240, 420 300 C 370 350, 260 320, 240 260 C 220 200, 300 170, 360 210"
                    stroke="url(#metalGrad)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 360 210 L 460 260"
                    stroke="#104B50"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />

                  {/* Stethoscope Chest Piece / Bell */}
                  <circle cx="430" cy="275" r="32" fill="#E8F7EF" stroke="#104B50" strokeWidth="6" />
                  <circle cx="430" cy="275" r="22" fill="#D2ECE0" stroke="#079B68" strokeWidth="3" />
                  <circle cx="430" cy="275" r="10" fill="#079B68" />

                  {/* 3D Glossy Emerald Green Heart */}
                  <g filter="url(#heartGlow)" transform="translate(180, 140)">
                    <path
                      d="M60 20 C60 0, 30 -5, 10 15 C-15 40, -10 70, 60 120 C130 70, 135 40, 110 15 C90 -5, 60 0, 60 20 Z"
                      fill="url(#heartGrad)"
                    />
                    {/* ECG Heartbeat line inside heart */}
                    <path
                      d="M 20 62 L 40 62 L 48 45 L 56 80 L 66 38 L 74 70 L 82 62 L 100 62"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </g>
                </svg>

                {/* Botanical Leaves accents on sides */}
                <div className="leaf-branch-left" aria-hidden="true">
                  <svg viewBox="0 0 120 140" fill="none">
                    <path
                      d="M10 120 C40 100 60 60 70 10 C50 30 30 70 10 120 Z"
                      fill="#079B68"
                      fillOpacity="0.45"
                    />
                    <path
                      d="M45 80 C70 70 95 45 105 15 C85 30 65 55 45 80 Z"
                      fill="#104B50"
                      fillOpacity="0.35"
                    />
                  </svg>
                </div>
                <div className="leaf-branch-right" aria-hidden="true">
                  <svg viewBox="0 0 120 140" fill="none">
                    <path
                      d="M110 120 C80 100 60 60 50 10 C70 30 90 70 110 120 Z"
                      fill="#079B68"
                      fillOpacity="0.4"
                    />
                    <path
                      d="M75 80 C50 70 25 45 15 15 C35 30 55 55 75 80 Z"
                      fill="#104B50"
                      fillOpacity="0.3"
                    />
                  </svg>
                </div>
              </div>

              {/* 4 Floating Interactive Cards Matching Reference Image 1 */}
              {/* Card 1: Track Health */}
              <Link to="/assistant" className="float-hero-card float-track-health">
                <div className="float-card-icon-wrap mint-bg">
                  <Heart size={18} className="icon-green" />
                </div>
                <div className="float-card-text">
                  <strong>Track health</strong>
                  <small>Check symptoms and get guidance</small>
                </div>
              </Link>

              {/* Card 2: Book Appointments */}
              <Link to="/hospitals" className="float-hero-card float-book-appointments">
                <div className="float-card-icon-wrap mint-bg">
                  <Calendar size={18} className="icon-green" />
                </div>
                <div className="float-card-text">
                  <strong>Book appointments</strong>
                  <small>Find nearby doctors and clinics</small>
                </div>
              </Link>

              {/* Card 3: Health Records */}
              <Link to="/health-records" className="float-hero-card float-health-records">
                <div className="float-card-icon-wrap mint-bg">
                  <FolderLock size={18} className="icon-green" />
                </div>
                <div className="float-card-text">
                  <strong>Health records</strong>
                  <small>Keep your reports safe and organized</small>
                </div>
              </Link>

              {/* Card 4: Find Nearby Care */}
              <Link to="/hospitals" className="float-hero-card float-nearby-care">
                <div className="float-card-icon-wrap mint-bg">
                  <MapPin size={18} className="icon-green" />
                </div>
                <div className="float-card-text">
                  <strong>Find nearby care</strong>
                  <small>Hospitals, pharmacies and more</small>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4 KEY STATISTIC / HIGHLIGHT CARDS (Matches reference image 1)
            ========================================================================= */}
        <div className="landing-stats-container">
          <div className="stats-four-grid">
            {/* 12 Features */}
            <div className="stat-pill-card">
              <div className="stat-circle-icon">
                <Plus size={22} className="stat-icon-svg" />
              </div>
              <div className="stat-card-details">
                <strong className="stat-number">12</strong>
                <span className="stat-label">health features</span>
              </div>
            </div>

            {/* 4 Languages */}
            <div className="stat-pill-card">
              <div className="stat-circle-icon">
                <MessageCircle size={22} className="stat-icon-svg" />
              </div>
              <div className="stat-card-details">
                <strong className="stat-number">4</strong>
                <span className="stat-label">languages</span>
              </div>
            </div>

            {/* 112 Emergency */}
            <a href="tel:112" className="stat-pill-card emergency-stat-card">
              <div className="stat-circle-icon">
                <Siren size={22} className="stat-icon-svg" />
              </div>
              <div className="stat-card-details">
                <strong className="stat-number">112</strong>
                <span className="stat-label">emergency in one tap</span>
              </div>
            </a>

            {/* Voice */}
            <Link to="/voice" className="stat-pill-card">
              <div className="stat-circle-icon">
                <Mic size={22} className="stat-icon-svg" />
              </div>
              <div className="stat-card-details">
                <strong className="stat-number">Voice</strong>
                <span className="stat-label">speak or type</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ALL 12 HEALTHCARE FEATURES SECTION
          ========================================================================= */}
      <section id="features" className="landing-features-showcase">
        <div className="section-header-block">
          <span className="section-kicker">COMPREHENSIVE ECOSYSTEM</span>
          <h2 className="section-title">All 12 Healthcare Capabilities</h2>
          <p className="section-subtitle">
            Engineered to empower patients and families across India with verified, accessible medical guidance.
          </p>
        </div>

        <div className="all-features-grid">
          {all12Features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link key={feat.title} to={feat.path} className="landing-feature-item-card">
                <div className="landing-feature-top">
                  <div className="feat-icon-badge">
                    <Icon size={22} />
                  </div>
                  <span className="feat-cat-pill">{feat.category}</span>
                </div>
                <h3 className="feat-card-heading">{feat.title}</h3>
                <p className="feat-card-text">{feat.desc}</p>
                <div className="feat-card-action">
                  <span>Explore tool</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS SECTION
          ========================================================================= */}
      <section className="how-it-works-section">
        <div className="section-header-block">
          <span className="section-kicker">STREAMLINED HEALTHCARE</span>
          <h2 className="section-title">How WellWise AI Works For You</h2>
        </div>

        <div className="steps-three-grid">
          <div className="step-card">
            <span className="step-badge">01</span>
            <h3>Ask or Speak</h3>
            <p>
              Type or speak your symptoms in English, Marathi, Hindi, or Kannada to receive immediate
              educational triage.
            </p>
          </div>
          <div className="step-card">
            <span className="step-badge">02</span>
            <h3>Prepare Doctor Passport</h3>
            <p>
              Consolidate symptoms, current prescriptions, and questions into a structured clinical
              summary ready for your doctor.
            </p>
          </div>
          <div className="step-card">
            <span className="step-badge">03</span>
            <h3>Track & Locate Care</h3>
            <p>
              Securely store lab reports in your private vault, set medicine alarms, and map nearby
              hospitals.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PRIVACY & SECURITY SECTION
          ========================================================================= */}
      <section className="security-notice-section">
        <div className="security-card-box">
          <ShieldCheck size={36} className="security-shield-icon" />
          <div className="security-text-box">
            <h3>Strict Healthcare Privacy & Row-Level Security</h3>
            <p>
              Your health records, reminders, and clinical summaries are protected by PostgreSQL
              Row-Level Security (RLS). You hold exclusive encryption access to your private vault.
              WellWise AI does not sell or share personal health data.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand-col">
            <Brand to="/" showTagline />
            <p className="footer-bio">
              Smarter healthcare for everyone. Accessible in 4 Indian languages with verified public
              health guidance.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Healthcare Tools</h4>
            <ul>
              <li><Link to="/assistant">AI Health Assistant</Link></li>
              <li><Link to="/doctor-passport">Doctor Passport</Link></li>
              <li><Link to="/health-records">Health Record Vault</Link></li>
              <li><Link to="/medicine-reminders">Medicine Reminders</Link></li>
              <li><Link to="/hospitals">Nearby Hospitals</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Languages & Emergency</h4>
            <ul>
              <li><Link to="/multilingual">English, मराठी, हिन्दी, ಕನ್ನಡ</Link></li>
              <li><a href="tel:112">National Emergency: 112</a></li>
              <li><a href="tel:108">Ambulance: 108</a></li>
              <li><Link to="/library">WHO & MoHFW Library</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} WellWise AI. Built for equitable, accessible healthcare in India.</p>
          <div className="legal-links">
            <span>Notice: General educational guidance only. Not clinical diagnosis.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
