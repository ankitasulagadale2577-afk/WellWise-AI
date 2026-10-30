import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  Globe,
  Check,
  CheckCheck,
  ExternalLink,
  X,
  FileText,
  Pill,
  BookOpen,
  Navigation,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { notificationService, searchService, profileService } from "../services/supabase.js";

export default function TopBar({ setMobileOpen }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { language, setLanguage, languages, t } = useLanguage();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const initial = displayName.trim()[0]?.toUpperCase() || "A";

  // Load real notifications
  useEffect(() => {
    async function fetchNotifs() {
      if (user?.id) {
        const { data } = await notificationService.getNotifications(user.id);
        if (data) {
          setNotifications(data);
          const unread = data.filter((n) => !n.read_status).length;
          setUnreadCount(unread);
        }
      }
    }
    fetchNotifs();
  }, [user?.id]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchService.searchAll(user?.id, query);
      setSearchResults(results);
      setSearching(false);
      setShowSearchDropdown(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, user?.id]);

  const handleSearchResultClick = (path) => {
    setShowSearchDropdown(false);
    setQuery("");
    navigate(path);
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_status: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead(user?.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read_status: true })));
    setUnreadCount(0);
  };

  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    if (user?.id) {
      await profileService.updateProfile(user.id, { preferred_language: newLang });
    }
  };

  return (
    <header className="dashboard-topbar">
      {/* Mobile drawer toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        type="button"
      >
        <Menu size={22} />
      </button>

      {/* Page Title */}
      <div className="topbar-title-section">
        <h1 className="topbar-title">Your Health Dashboard</h1>
      </div>

      {/* Global Search with debouncing and instant dropdown */}
      <div className="topbar-search-wrapper" ref={searchRef}>
        <div className="search-pill-box">
          <Search size={17} className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowSearchDropdown(true)}
            placeholder="Search for symptoms, doctors, medicines..."
            aria-label="Global Search"
          />
          {query && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setQuery("");
                setSearchResults([]);
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchDropdown && (
          <div className="search-dropdown-menu">
            {searching ? (
              <div className="search-dropdown-empty">Searching health database...</div>
            ) : searchResults.length === 0 ? (
              <div className="search-dropdown-empty">
                No matching symptoms, medicines, or records found for "{query}".
              </div>
            ) : (
              <div className="search-results-list">
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="search-result-item"
                    onClick={() => handleSearchResultClick(item.path)}
                  >
                    <div className="result-icon-col">
                      {item.type === "Navigation" && <Navigation size={15} />}
                      {item.type === "Record" && <FileText size={15} />}
                      {item.type === "Reminder" && <Pill size={15} />}
                      {item.type === "Library" && <BookOpen size={15} />}
                    </div>
                    <div className="result-text-col">
                      <span className="result-item-title">{item.title}</span>
                      <small className="result-item-snippet">{item.snippet}</small>
                    </div>
                    <span className="result-category-tag">{item.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Language Selector */}
      <div className="topbar-lang-wrapper">
        <Globe size={16} className="lang-icon" />
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="topbar-language-select"
          aria-label="Choose platform language"
        >
          {languages.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Notifications Bell & Dropdown */}
      <div className="topbar-notifications-wrapper" ref={notifRef}>
        <button
          type="button"
          className="notifications-bell-btn"
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="View notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && <span className="notification-dot" />}
        </button>

        {showNotifications && (
          <div className="notifications-dropdown">
            <div className="notif-dropdown-header">
              <div className="notif-header-title">
                <strong>Notifications</strong>
                {unreadCount > 0 && <span className="unread-pill">{unreadCount} new</span>}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="mark-all-read-btn"
                  onClick={handleMarkAllRead}
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>

            <div className="notif-list">
              {notifications.length === 0 ? (
                <div className="empty-notif-state">No new notifications</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read_status ? "unread" : ""}`}
                    onClick={() => {
                      if (n.link) navigate(n.link);
                      setShowNotifications(false);
                    }}
                  >
                    <div className="notif-item-body">
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                      <small>{new Date(n.created_at).toLocaleDateString()}</small>
                    </div>
                    {!n.read_status && (
                      <button
                        type="button"
                        className="mark-read-single-btn"
                        onClick={(e) => handleMarkAsRead(n.id, e)}
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Avatar */}
      <div
        className="topbar-user-avatar"
        onClick={() => navigate("/profile")}
        title="View profile & settings"
      >
        <span className="avatar-circle">{initial}</span>
      </div>
    </header>
  );
}
