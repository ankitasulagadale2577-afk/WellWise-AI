import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Leaf,
  MessageSquare,
  Mic,
  Syringe,
  Hospital,
  Phone,
  BookOpen,
  User,
} from "lucide-react";
import Brand from "../components/Brand.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage, LANGUAGES } from "../context/LanguageContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithOAuth, signUp, resetPassword } = useAuth();
  const { language, setLanguage } = useLanguage();

  const isSignUpInitial = new URLSearchParams(location.search).get("signup") === "true";
  const [mode, setMode] = useState(isSignUpInitial ? "signup" : "login"); // 'login' | 'signup' | 'forgot'
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [prefLang, setPrefLang] = useState(language);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !email.includes("@")) {
      return setError("Please provide a valid email address.");
    }

    if (mode === "forgot") {
      setSubmitting(true);
      const res = await resetPassword(email.trim());
      setSubmitting(false);
      if (res.success) {
        setSuccess("Password reset instructions have been sent to your email.");
      } else {
        setError(res.error || "Could not send reset email.");
      }
      return;
    }

    if (!password || password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    if (mode === "signup" && !fullName.trim()) {
      return setError("Please enter your full name.");
    }

    setSubmitting(true);

    if (mode === "signup") {
      const res = await signUp(email.trim(), password, fullName.trim(), prefLang);
      setSubmitting(false);
      if (res.success) {
        setLanguage(prefLang);
        navigate("/dashboard", { replace: true });
      } else {
        setError(res.error || "Failed to create account.");
      }
    } else {
      const res = await login(email.trim(), password);
      setSubmitting(false);
      if (res.success) {
        navigate("/dashboard", { replace: true });
      } else {
        setError(res.error || "Invalid email or password.");
      }
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError("");
    const res = await loginWithOAuth(provider);
    if (res?.success) {
      navigate("/dashboard", { replace: true });
    } else if (res?.error) {
      setError(res.error);
    }
  };

  return (
    <div className="login-page-container">
      {/* Top Floating Badge */}
      <div className="top-right-accent">
        <span>Better Health Together ♡</span>
      </div>

      <div className="login-content-grid">
        {/* =========================================================================
            LEFT COLUMN: Brand, 6 Features Grid & Medical Robot Illustration
            (Matches Reference Image 2)
            ========================================================================= */}
        <div className="login-left-col">
          <div className="login-brand-header">
            <Brand to="/" showTagline />
          </div>

          <div className="login-hero-titles">
            <h1>
              Your AI Companion <br />
              <span className="accent-green">for Better Health</span>
            </h1>
            <p className="login-hero-sub">
              Get instant health information, find nearby hospitals, track your vaccination,
              and more — all in one place. In your language, always.
            </p>
          </div>

          {/* 6 Feature Badges in 2-Column Grid */}
          <div className="login-features-2col">
            <div className="login-feat-item">
              <div className="login-feat-icon">
                <MessageSquare size={17} />
              </div>
              <div>
                <strong>AI Health Assistant</strong>
                <small>Ask • Learn • Get Help</small>
              </div>
            </div>

            <div className="login-feat-item">
              <div className="login-feat-icon">
                <Mic size={17} />
              </div>
              <div>
                <strong>Voice Assistant</strong>
                <small>Speak • Listen • Get Answers</small>
              </div>
            </div>

            <div className="login-feat-item">
              <div className="login-feat-icon">
                <Syringe size={17} />
              </div>
              <div>
                <strong>Vaccination Info</strong>
                <small>Stay Protected</small>
              </div>
            </div>

            <div className="login-feat-item">
              <div className="login-feat-icon">
                <Hospital size={17} />
              </div>
              <div>
                <strong>Nearby Hospitals</strong>
                <small>Find Care Near You</small>
              </div>
            </div>

            <div className="login-feat-item">
              <div className="login-feat-icon">
                <Phone size={17} />
              </div>
              <div>
                <strong>Emergency Assistance</strong>
                <small>Be Prepared</small>
              </div>
            </div>

            <div className="login-feat-item">
              <div className="login-feat-icon">
                <BookOpen size={17} />
              </div>
              <div>
                <strong>Health Library</strong>
                <small>Trusted Health Knowledge</small>
              </div>
            </div>
          </div>

          {/* Whimsical Handwritten Tagline */}
          <div className="handwritten-tagline">
            <span>Good Health Builds a Brighter Future</span>
            <svg viewBox="0 0 160 12" fill="none" className="underline-wave">
              <path
                d="M2 9C40 2 120 1 158 8"
                stroke="#079B68"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Vector Illustration: Girl with Laptop & Friendly Medical AI Robot */}
          <div className="login-illustration-stage">
            <div className="speech-bubble bubble-green">How can I help you today?</div>
            <div className="speech-bubble bubble-cyan">मराठी</div>
            <div className="speech-bubble bubble-blue">English</div>

            <svg viewBox="0 0 460 220" className="health-bot-svg" fill="none">
              {/* Desk & Plant */}
              <ellipse cx="230" cy="205" rx="210" ry="14" fill="#E8F7EF" />
              <rect x="25" y="155" width="22" height="35" rx="4" fill="#6DA28F" />
              <ellipse cx="36" cy="145" rx="14" ry="20" fill="#079B68" />
              <ellipse cx="24" cy="148" rx="12" ry="16" fill="#0AA670" />
              <ellipse cx="46" cy="148" rx="12" ry="16" fill="#104B50" />

              {/* Stack of books */}
              <rect x="58" y="175" width="45" height="8" rx="2" fill="#507B83" />
              <rect x="55" y="166" width="50" height="9" rx="2" fill="#079B68" />

              {/* Girl User with Laptop */}
              <g transform="translate(100, 45)">
                {/* Hair back */}
                <path d="M40 30 C30 10 70 0 85 20 C95 40 95 85 85 105 C70 95 50 85 40 30 Z" fill="#202A37" />
                {/* Face & Neck */}
                <ellipse cx="62" cy="46" rx="18" ry="22" fill="#FDDEC3" />
                <path d="M56 65 L56 80 L68 80 L68 65 Z" fill="#F4C7A5" />
                {/* Hair front */}
                <path d="M45 35 C55 25 78 28 80 40 C72 36 60 38 52 48 Z" fill="#202A37" />
                {/* Eyes & Smile */}
                <circle cx="68" cy="45" r="2.5" fill="#202A37" />
                <path d="M64 54 Q69 58 74 54" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                {/* Torso & Green Sweater */}
                <path d="M38 80 C48 74 76 74 86 80 L96 150 L28 150 Z" fill="#079B68" />
                {/* Arm & Hands on Laptop */}
                <path d="M80 95 L115 130 L100 135 Z" fill="#058257" />
                <ellipse cx="116" cy="132" rx="6" ry="4" fill="#FDDEC3" />
                {/* Laptop */}
                <polygon points="105,142 165,142 155,108 115,108" fill="#CBD5E1" />
                <polygon points="98,144 172,144 165,142 105,142" fill="#94A3B8" />
                <circle cx="135" cy="125" r="4" fill="#079B68" />
              </g>

              {/* Cute Medical AI Robot */}
              <g transform="translate(290, 70)">
                {/* Bot Head */}
                <rect x="25" y="10" width="70" height="52" rx="26" fill="#FFFFFF" stroke="#D1EADE" strokeWidth="3" />
                {/* Screen Face */}
                <rect x="34" y="18" width="52" height="34" rx="17" fill="#104B50" />
                {/* Glowing Blue Eyes & Smile */}
                <ellipse cx="50" cy="33" rx="4" ry="5" fill="#38BDF8" />
                <ellipse cx="70" cy="33" rx="4" ry="5" fill="#38BDF8" />
                <path d="M56 42 Q60 46 64 42" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
                {/* Bot Antenna */}
                <line x1="60" y1="10" x2="60" y2="0" stroke="#079B68" strokeWidth="3" strokeLinecap="round" />
                <circle cx="60" cy="-2" r="4" fill="#079B68" />
                {/* Bot Body */}
                <rect x="32" y="66" width="56" height="58" rx="20" fill="#FFFFFF" stroke="#D1EADE" strokeWidth="3" />
                {/* Medical Cross on Chest */}
                <circle cx="60" cy="94" r="14" fill="#E8F7EF" />
                <path d="M60 87 L60 101 M53 94 L67 94" stroke="#079B68" strokeWidth="3.5" strokeLinecap="round" />
                {/* Bot Floating Arms */}
                <ellipse cx="20" cy="85" rx="6" ry="12" fill="#E8F7EF" stroke="#C3E8D6" strokeWidth="2" />
                <ellipse cx="100" cy="85" rx="6" ry="12" fill="#E8F7EF" stroke="#C3E8D6" strokeWidth="2" />
              </g>
            </svg>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: The White Floating Card (Matches Reference Image 2)
            ========================================================================= */}
        <div className="login-right-col">
          <div className="auth-floating-card">
            {/* Center Leaf Emblem */}
            <div className="card-top-emblem">
              <span className="auth-emblem-icon">
                <Leaf size={28} className="emblem-leaf-svg" />
              </span>
            </div>

            {/* Welcome Back Headings */}
            <div className="auth-header-text">
              <h2>{mode === "signup" ? "Create Account" : mode === "forgot" ? "Reset Password" : "Welcome Back"}</h2>
              <p className="auth-sub-desc">
                {mode === "signup"
                  ? "Join WellWise AI for smarter, personalized healthcare"
                  : mode === "forgot"
                  ? "Enter your email to receive recovery instructions"
                  : "Sign in to your WellWise AI account"}
              </p>
              <span className="auth-priority-tag">Your health. Our priority.</span>
            </div>

            {error && (
              <div className="alert-box error" style={{ marginTop: "16px" }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {success && (
              <div className="alert-box success" style={{ marginTop: "16px" }}>
                <CheckCircle2 size={16} /> {success}
              </div>
            )}

            {/* Login / Signup Form */}
            <form onSubmit={handleSubmit} className="auth-form-styled">
              {mode === "signup" && (
                <div className="auth-input-group">
                  <label>Full Name</label>
                  <div className="auth-input-wrap">
                    <User size={18} className="input-icon-svg" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Address Field */}
              <div className="auth-input-group">
                <label>Email Address</label>
                <div className="auth-input-wrap">
                  <Mail size={18} className="input-icon-svg" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              {mode !== "forgot" && (
                <div className="auth-input-group">
                  <label>Password</label>
                  <div className="auth-input-wrap">
                    <Lock size={18} className="input-icon-svg" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="eye-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password Link */}
              {mode === "login" && (
                <div className="forgot-password-row">
                  <button
                    type="button"
                    className="forgot-link-btn"
                    onClick={() => {
                      setMode("forgot");
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="button button-primary auth-submit-btn"
                disabled={submitting}
              >
                <span>
                  {submitting
                    ? "Processing..."
                    : mode === "signup"
                    ? "Create Account"
                    : mode === "forgot"
                    ? "Send Reset Link"
                    : "Sign In"}
                </span>
                <ArrowRight size={17} />
              </button>
            </form>

            {/* Social Authentication */}
            {mode !== "forgot" && (
              <>
                <div className="auth-divider-row">
                  <span className="divider-line" />
                  <span className="divider-text">OR</span>
                  <span className="divider-line" />
                </div>

                <div className="social-auth-grid">
                  <button
                    type="button"
                    className="social-btn google-btn"
                    onClick={() => handleOAuthLogin("google")}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    className="social-btn github-btn"
                    onClick={() => handleOAuthLogin("github")}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>Continue with GitHub</span>
                  </button>
                </div>
              </>
            )}

            {/* Switch Mode (Sign Up / Sign In) */}
            <div className="auth-switch-mode">
              {mode === "login" ? (
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="switch-btn"
                    onClick={() => {
                      setMode("signup");
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="switch-btn"
                    onClick={() => {
                      setMode("login");
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>

            {/* Bottom Security / Trust Notice */}
            <div className="auth-trust-box">
              <ShieldCheck size={20} className="trust-shield-icon" />
              <div className="trust-text">
                <strong>Your data is safe with us</strong>
                <p>We follow strict security and privacy standards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
