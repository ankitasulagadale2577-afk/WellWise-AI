import { NavLink } from "react-router-dom";
import {
  Home,
  Bot,
  Mic,
  FileText,
  FolderLock,
  Pill,
  Syringe,
  Hospital,
  Siren,
  BookOpen,
  MessageSquare,
  Globe,
  Settings,
  UserRound,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  X,
  ChevronDown,
} from "lucide-react";
import Brand from "./Brand.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const { t } = useLanguage();
  const { logout } = useAuth();

  const sections = [
    {
      group: "CARE",
      items: [
        { label: "AI Health Assistant", path: "/assistant", icon: Bot },
        { label: "Voice Assistant", path: "/voice", icon: Mic },
        { label: "Voice-to-Doctor Passport", path: "/doctor-passport", icon: FileText },
      ],
    },
    {
      group: "MY HEALTH",
      items: [
        { label: "Health Record Vault", path: "/health-records", icon: FolderLock },
        { label: "Medicine Reminders", path: "/medicine-reminders", icon: Pill },
        { label: "Vaccination Info", path: "/vaccination", icon: Syringe },
      ],
    },
    {
      group: "FIND HELP",
      items: [
        { label: "Nearby Hospitals", path: "/hospitals", icon: Hospital },
        { label: "Emergency Assistance", path: "/emergency", icon: Siren },
      ],
    },
    {
      group: "LEARN & CONNECT",
      items: [
        { label: "Health Library", path: "/library", icon: BookOpen },
        { label: "WhatsApp Companion", path: "/whatsapp", icon: MessageSquare },
      ],
    },
    {
      group: "ACCOUNT",
      items: [
        { label: "Multilingual Support", path: "/multilingual", icon: Globe },
        { label: "Profile & Settings", path: "/profile", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {mobileOpen && (
        <button
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <aside
        className={`dashboard-sidebar ${collapsed ? "sidebar-collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <Brand to="/dashboard" />
          <button
            className="sidebar-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* Main Dashboard Link */}
          <NavLink
            to="/dashboard"
            end
            title={collapsed ? "Dashboard" : undefined}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `sidebar-link primary-nav-link ${isActive ? "active" : ""}`
            }
          >
            <Home size={19} />
            <span>Dashboard</span>
          </NavLink>

          {/* Grouped Navigation Sections */}
          {sections.map((sec) => (
            <div key={sec.group} className="sidebar-section">
              <div className="sidebar-group-header">
                <span>{sec.group}</span>
                <ChevronDown size={14} className="group-chevron" />
              </div>
              <div className="sidebar-group-items">
                {sec.items.map(({ label, path, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    title={collapsed ? label : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer controls: Collapse & Logout */}
        <div className="sidebar-footer">
          <button
            className="sidebar-collapse"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            type="button"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            <span>{collapsed ? "Expand" : "Collapse sidebar"}</span>
          </button>

          <button
            className="sidebar-link sidebar-logout"
            onClick={logout}
            title={t("logout")}
            type="button"
          >
            <LogOut size={18} />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
