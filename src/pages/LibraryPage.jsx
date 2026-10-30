import { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  Clock,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { articleService } from "../services/supabase.js";

const LIBRARY_ARTICLES = [
  {
    id: "art-pcos",
    slug: "pcos-symptoms-causes-management",
    title: "PCOS: Symptoms, Causes and Management",
    category: "Women's Health",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    summary: "Polycystic Ovary Syndrome (PCOS) is a common hormonal condition. Early lifestyle changes, balanced nutrition, and clinical guidance help regulate menstrual cycles and improve metabolic health.",
    source: "World Health Organization (WHO)",
  },
  {
    id: "art-immunity",
    slug: "foods-to-boost-immunity",
    title: "Foods to Boost Immunity",
    category: "Nutrition",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80",
    summary: "A colorful, nutrient-dense diet rich in citrus fruits, turmeric, ginger, amla, and leafy greens delivers antioxidants that fortify the immune response naturally.",
    source: "National Institute of Nutrition (ICMR-NIN)",
  },
  {
    id: "art-anxiety",
    slug: "managing-anxiety-in-college",
    title: "Managing Anxiety in College",
    category: "Mental Health",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80",
    summary: "Academic and social transitions often heighten stress. Box breathing, structured time blocking, and confidential tele-mental counseling (Tele-MANAS) build long-term emotional resilience.",
    source: "Ministry of Health & Family Welfare (India)",
  },
  {
    id: "art-seasonal",
    slug: "how-to-prevent-seasonal-infections",
    title: "How to Prevent Seasonal Infections",
    category: "Disease Info",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
    summary: "Weather shifts create ideal conditions for viral spread. Frequent hand hygiene, mosquito management, staying hydrated, and seasonal vaccines reduce infection risks.",
    source: "National Centre for Disease Control (NCDC)",
  },
  {
    id: "art-skincare",
    slug: "skin-care-for-acne-prone-skin",
    title: "Skin Care for Acne Prone Skin",
    category: "Lifestyle",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1512290900672-1f02333a046d?w=600&auto=format&fit=crop&q=80",
    summary: "Gentle salicylic acid cleansers, non-comedogenic moisturizers, and avoiding physical scrubbing prevent follicular clogging and protect skin barrier integrity.",
    source: "Indian Association of Dermatologists",
  },
  {
    id: "art-menstrual",
    slug: "menstrual-health-basics",
    title: "Menstrual Health Basics",
    category: "Women's Health",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80",
    summary: "Tracking cycle length, staying hydrated, iron-rich meals, and understanding standard menstrual variation provide foundational reproductive wellness insights.",
    source: "WHO Reproductive Health",
  },
  {
    id: "art-sleep",
    slug: "importance-of-good-sleep",
    title: "Importance of Good Sleep",
    category: "Lifestyle",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80",
    summary: "Restorative deep sleep allows cellular repair, hormone balance, and memory consolidation. Maintaining consistent bedtime schedules enhances immune function.",
    source: "National Sleep Foundation",
  },
  {
    id: "art-firstaid",
    slug: "first-aid-at-home",
    title: "First Aid at Home",
    category: "Disease Info",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80",
    summary: "Essential supplies for handling burns, minor cuts, insect stings, and sprains at home before professional clinical evaluation.",
    source: "Red Cross & St. John Ambulance",
  },
];

const CATEGORIES = [
  "All",
  "Women's Health",
  "Mental Health",
  "Nutrition",
  "Disease Info",
  "Lifestyle",
];

export default function LibraryPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [savedArticleIds, setSavedArticleIds] = useState([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    async function loadBookmarks() {
      if (user?.id) {
        const { data } = await articleService.getSavedArticleIds(user.id);
        if (data) setSavedArticleIds(data);
      }
    }
    loadBookmarks();
  }, [user?.id]);

  const toggleBookmark = async (id, e) => {
    e.stopPropagation();
    const isSaved = savedArticleIds.includes(id);
    let nextSaved;
    if (isSaved) {
      nextSaved = savedArticleIds.filter((item) => item !== id);
    } else {
      nextSaved = [...savedArticleIds, id];
    }
    setSavedArticleIds(nextSaved);

    if (user?.id) {
      await articleService.toggleSaveArticle(user.id, id, !isSaved);
    }
  };

  const filteredArticles = LIBRARY_ARTICLES.filter((art) => {
    const matchesCat = selectedCat === "All" || art.category === selectedCat;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBookmark = !showBookmarksOnly || savedArticleIds.includes(art.id);
    return matchesCat && matchesSearch && matchesBookmark;
  });

  return (
    <div className="library-page-wrapper">
      {/* Top Header */}
      <div className="page-header">
        <div>
          <h1 className="library-page-title">Health Library</h1>
          <p className="library-page-subtitle">
            Trusted health articles, easy to understand.
          </p>
        </div>

        <button
          type="button"
          className={`button ${showBookmarksOnly ? "button-primary" : "button-outline"} btn-sm`}
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
        >
          <Bookmark size={15} /> Bookmark
        </button>
      </div>

      {/* Search Bar & Category Chips */}
      <div className="library-toolbar">
        <div className="library-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search symptoms, conditions, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-chips-row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-pill-btn ${selectedCat === cat ? "active" : ""}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid (8 Cards Matching Image 1 Screen 4) */}
      <div className="articles-card-grid">
        {filteredArticles.map((art) => {
          const isSaved = savedArticleIds.includes(art.id);
          return (
            <div
              key={art.id}
              className="article-card"
              onClick={() => setSelectedArticle(art)}
            >
              <div className="article-image-wrap">
                <img src={art.imageUrl} alt={art.title} loading="lazy" />
                <span className="category-tag-badge">{art.category}</span>
                <button
                  type="button"
                  className={`card-bookmark-btn ${isSaved ? "saved" : ""}`}
                  onClick={(e) => toggleBookmark(art.id, e)}
                  title={isSaved ? "Remove bookmark" : "Save bookmark"}
                >
                  {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </button>
              </div>

              <div className="article-body">
                <h3 className="article-card-title">{art.title}</h3>
                <p className="article-card-summary">{art.summary}</p>
                <div className="article-footer-row">
                  <span className="read-time-tag">
                    <Clock size={12} /> {art.readTime}
                  </span>
                  <span className="read-more-link">Read full →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="modal-backdrop" onClick={() => setSelectedArticle(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedArticle.title}</h2>
              <button className="close-btn" onClick={() => setSelectedArticle(null)}>
                &times;
              </button>
            </div>
            <img
              src={selectedArticle.imageUrl}
              alt={selectedArticle.title}
              style={{ width: "100%", maxHeight: "240px", objectFit: "cover", borderRadius: "12px", marginBottom: "16px" }}
            />
            <span className="category-tag-badge" style={{ display: "inline-block", marginBottom: "12px" }}>
              {selectedArticle.category} • {selectedArticle.readTime}
            </span>
            <p style={{ fontSize: "14px", lineHeight: "1.7", color: "var(--dark-teal)" }}>
              {selectedArticle.summary}
            </p>
            <div className="safety-banner note-banner" style={{ marginTop: "20px" }}>
              <ShieldCheck size={18} className="banner-icon" />
              <div>
                <strong>Verified Health Guidance:</strong> Sourced from {selectedArticle.source}.
                Reviewed for general educational purposes.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
