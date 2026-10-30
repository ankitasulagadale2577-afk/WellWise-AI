import { useState, useEffect } from "react";
import {
  Hospital,
  MapPin,
  Navigation,
  Search,
  Phone,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import LeafletMap from "../components/LeafletMap.jsx";
import {
  geocodeLocation,
  fetchNearbyHospitals,
} from "../services/placesService.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const DEFAULT_HOSPITALS = [
  {
    id: "hosp-1",
    name: "Civil Hospital Solapur",
    type: "Government",
    distance: "2.1 km • 5 min",
    address: "Mangalwar Peth, Solapur 413003",
    features: "24x7 Emergency",
    lat: 17.6599,
    lon: 75.9064,
    phone: "0217-2740001",
  },
  {
    id: "hosp-2",
    name: "Siddheshwar Hospital",
    type: "Private",
    distance: "2.8 km • 7 min",
    address: "Bhavani Peth, Solapur",
    features: "24x7 OPD",
    lat: 17.6685,
    lon: 75.9125,
    phone: "0217-2311234",
  },
  {
    id: "hosp-3",
    name: "Apex Multispeciality Hospital",
    type: "Private",
    distance: "3.5 km • 10 min",
    address: "North Solapur, Solapur",
    features: "24x7 ICU",
    lat: 17.6755,
    lon: 75.9189,
    phone: "0217-2601999",
  },
];

export default function HospitalsPage() {
  const { t } = useLanguage();

  const [center, setCenter] = useState([17.6599, 75.9064]); // Solapur center
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState("5.0 km");
  const [facilityType, setFacilityType] = useState("All");
  const [filterGov, setFilterGov] = useState(true);
  const [filterPrivate, setFilterPrivate] = useState(true);
  const [filter24x7, setFilter24x7] = useState(false);

  const [hospitals, setHospitals] = useState(DEFAULT_HOSPITALS);
  const [selectedHospital, setSelectedHospital] = useState(DEFAULT_HOSPITALS[0]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    const coords = await geocodeLocation(searchQuery);
    if (coords) {
      setCenter([coords.lat, coords.lon]);
      const { hospitals: results } = await fetchNearbyHospitals(
        coords.lat,
        coords.lon,
        5000,
        "all"
      );
      if (results && results.length > 0) {
        setHospitals(
          results.map((h, i) => ({
            id: "hosp-" + i,
            name: h.name,
            type: h.type === "hospital" ? "Government" : "Private",
            distance: `${(h.distance / 1000).toFixed(1)} km`,
            address: h.address || searchQuery,
            features: "24x7 Care",
            lat: h.lat,
            lon: h.lon,
            phone: h.phone || "+91 98220 00000",
          }))
        );
        setSelectedHospital(results[0]);
      }
    }
    setLoading(false);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setCenter([lat, lon]);
      setLoading(true);
      const { hospitals: results } = await fetchNearbyHospitals(lat, lon, 5000, "all");
      if (results && results.length > 0) {
        setHospitals(
          results.map((h, i) => ({
            id: "hosp-" + i,
            name: h.name,
            type: h.type === "hospital" ? "Government" : "Private",
            distance: `${(h.distance / 1000).toFixed(1)} km`,
            address: h.address || "Local Area",
            features: "24x7 Care",
            lat: h.lat,
            lon: h.lon,
            phone: h.phone || "+91 98220 00000",
          }))
        );
        setSelectedHospital(results[0]);
      }
      setLoading(false);
    });
  };

  const filteredHospitals = hospitals.filter((h) => {
    if (facilityType !== "All" && h.type !== facilityType) return false;
    if (!filterGov && h.type === "Government") return false;
    if (!filterPrivate && h.type === "Private") return false;
    if (filter24x7 && !h.features.includes("24x7")) return false;
    return true;
  });

  return (
    <div className="hospitals-page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="hospitals-page-title">Nearby Hospitals</h1>
          <p className="hospitals-page-subtitle">
            Find hospitals, clinics and healthcare facilities near you.
          </p>
        </div>
      </div>

      {/* Search Bar & Advanced Filter Row (Matches Image 1 Screen 6) */}
      <div className="hospitals-toolbar-box">
        <form onSubmit={handleSearch} className="hospitals-search-row">
          <div className="search-field-input">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search hospital, area or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="button button-primary btn-sm">
            Search
          </button>
          <button
            type="button"
            className="button button-outline btn-sm"
            onClick={handleLocateMe}
          >
            <Navigation size={14} /> Near Me
          </button>
        </form>

        <div className="hospitals-filter-row">
          <div className="filter-select-group">
            <label>Search Radius:</label>
            <select value={radius} onChange={(e) => setRadius(e.target.value)}>
              <option value="2.0 km">2.0 km</option>
              <option value="5.0 km">5.0 km</option>
              <option value="10.0 km">10.0 km</option>
              <option value="25.0 km">25.0 km</option>
            </select>
          </div>

          <div className="filter-select-group">
            <label>Facility Type:</label>
            <select
              value={facilityType}
              onChange={(e) => setFacilityType(e.target.value)}
            >
              <option value="All">All Facilities</option>
              <option value="Government">Government Hospitals</option>
              <option value="Private">Private Clinics</option>
            </select>
          </div>

          <div className="filter-checkboxes-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filterGov}
                onChange={(e) => setFilterGov(e.target.checked)}
              />
              Government
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filterPrivate}
                onChange={(e) => setFilterPrivate(e.target.checked)}
              />
              Private
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filter24x7}
                onChange={(e) => setFilter24x7(e.target.checked)}
              />
              24x7
            </label>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Hospital List & Leaflet Map */}
      <div className="hospitals-content-grid">
        {/* Left: List of results */}
        <div className="hospitals-list-column">
          <div className="results-count-header">
            <strong>Results ({filteredHospitals.length} hospitals found)</strong>
          </div>

          <div className="hospitals-cards-stack">
            {filteredHospitals.map((hosp) => {
              const isSelected = selectedHospital?.id === hosp.id;
              return (
                <div
                  key={hosp.id}
                  className={`hospital-card-item ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedHospital(hosp);
                    setCenter([hosp.lat, hosp.lon]);
                  }}
                >
                  <div className="hosp-card-top">
                    <h3 className="hosp-name">{hosp.name}</h3>
                    <span
                      className={`hosp-type-badge ${
                        hosp.type === "Government" ? "gov" : "private"
                      }`}
                    >
                      {hosp.type}
                    </span>
                  </div>

                  <p className="hosp-distance-text">
                    📍 {hosp.distance} • {hosp.address}
                  </p>

                  <div className="hosp-features-row">
                    <span className="hosp-feature-tag">{hosp.features}</span>
                    {hosp.phone && (
                      <a
                        href={`tel:${hosp.phone}`}
                        className="hosp-phone-tag"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone size={12} /> {hosp.phone}
                      </a>
                    )}
                  </div>

                  <div className="hosp-action-row">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.lat},${hosp.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-primary btn-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Navigation size={13} /> Get Directions
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Leaflet Interactive Map */}
        <div className="hospitals-map-column">
          <div className="map-container-frame">
            <LeafletMap
              center={center}
              hospitals={filteredHospitals}
              selectedHospital={selectedHospital}
              onSelectHospital={setSelectedHospital}
            />

            {/* Floating Info Popup on Map (Matches Image 1 Screen 6) */}
            {selectedHospital && (
              <div className="map-floating-hosp-card">
                <div className="map-float-header">
                  <div className="map-float-icon">🏥</div>
                  <div>
                    <strong>{selectedHospital.name}</strong>
                    <small>📍 {selectedHospital.distance}</small>
                  </div>
                </div>
                <p className="map-float-address">{selectedHospital.address}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-primary btn-sm full-width"
                  style={{ marginTop: "8px" }}
                >
                  <Navigation size={13} /> Get Directions
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
