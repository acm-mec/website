import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  Lock,
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  Download,
  Check,
  Calendar,
  Settings,
  Users,
  X,
  ExternalLink,
  ShieldAlert,
  Info,
  Copy,
  Upload,
  Image as ImageIcon,
  Loader2,
  Globe,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  GitHubIcon,
  LinkedInIcon,
  InstagramIcon,
  WhatsAppIcon,
  TwitterIcon,
} from "../components/ui/SocialIcons";
import { uploadToImgBB } from "../services/imgbb";
import { useData } from "../context/DataContext";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import StatusMeta from "../components/ui/StatusMeta";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes inactivity auto-logout

function safeExternalUrl(value) {
  const trimmedValue = value?.trim();
  if (!trimmedValue) return null;
  try {
    const url = new URL(trimmedValue);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function formatSocialUrl(value, type) {
  if (!value) return "";
  let trimmed = value.trim();
  if (!trimmed || trimmed.includes("placeholder")) return "";

  if (type === "whatsapp" && /^\+?[\d\s-]{7,15}$/.test(trimmed)) {
    const cleanNum = trimmed.replace(/[^\d]/g, "");
    return `https://wa.me/${cleanNum}`;
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  return safeExternalUrl(trimmed) || "";
}

function timeTo24h(timeStr) {
  if (!timeStr) return "";
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return timeStr;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const meridian = match[3].toUpperCase();
  if (meridian === "PM" && hours !== 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function timeFrom24h(hhmm) {
  if (!hhmm) return "";
  const [hoursStr, minutes] = hhmm.split(":");
  let hours = parseInt(hoursStr, 10);
  const meridian = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${meridian}`;
}

function toPickerDate(date, time) {
  if (!date) return null;
  const [year, month, day] = date.split("-").map(Number);
  const hhmm = timeTo24h(time) || "09:00";
  const [hours, minutes] = hhmm.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

function fromPickerDate(value) {
  if (!value) return { date: "", time: "" };
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  return {
    date: `${year}-${month}-${day}`,
    time: timeFrom24h(`${hours}:${minutes}`),
  };
}

export default function Admin() {
  const {
    siteConfig,
    events,
    team,
    addEvent,
    updateEvent,
    deleteEvent,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    moveTeamMember,
    updateSiteConfig,
    reloadSourceData,
  } = useData();

  // Authentication & Security state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Session activity timer ref
  const lastActivityRef = useRef(Date.now());

  // Active tab: "events" | "config" | "team" | "export"
  const [activeTab, setActiveTab] = useState("events");

  // Modals & Form States
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    id: "",
    title: "",
    date: "",
    time: "5:00 PM",
    location: "CS Building, Room 204",
    status: "upcoming",
    description: "",
    longDescription: "",
    tags: "",
    registrationLink: "",
  });

  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({
    id: "",
    name: "",
    role: "",
    year: "3rd Year, CSE",
    bio: "",
    image: "",
    github: "",
    linkedin: "",
  });

  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [imgbbApiKey, setImgbbApiKey] = useState(() => {
    try {
      return localStorage.getItem("acm_imgbb_api_key") || "";
    } catch {
      return "";
    }
  });

  const [configForm, setConfigForm] = useState({ ...siteConfig });
  const [configSaved, setConfigSaved] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [formError, setFormError] = useState("");


  // Copy/export feedback
  const [copiedSection, setCopiedSection] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth", { credentials: "same-origin" });
        const result = await response.json();
        if (isMounted) setIsAuthenticated(response.ok && result.authenticated === true);
      } catch {
        if (isMounted) setAuthError("Admin authentication service is unavailable.");
      } finally {
        if (isMounted) setIsCheckingSession(false);
      }
    };
    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Inactivity Auto-Logout Timer (15 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);

    const checkInactivity = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= SESSION_TIMEOUT_MS) {
        fetch("/api/auth", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "logout" }),
        }).catch(() => {});
        setIsAuthenticated(false);
        setAuthError("Session expired due to 15 minutes of inactivity.");
      }
    }, 10000);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
      clearInterval(checkInactivity);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    setConfigForm({ ...siteConfig });
  }, [siteConfig]);

  // ── Login Handler with Salted Hash + Rate Limiting ──
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isVerifying || !passInput) return;

    setIsVerifying(true);
    setAuthError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password: passInput }),
      });
      const result = await response.json();
      setPassInput("");

      if (response.ok && result.authenticated === true) {
        setIsAuthenticated(true);
        setAuthError("");
        lastActivityRef.current = Date.now();
      } else {
        setAuthError(result.error || "Authentication failed.");
      }
    } catch {
      setAuthError("Admin authentication service is unavailable.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLock = async () => {
    try {
      await fetch("/api/auth", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } finally {
      setIsAuthenticated(false);
      setPassInput("");
    }
  };

  // ── Event Modal Handlers ──
  const openNewEventModal = () => {
    const autoId = `event-${Date.now().toString().slice(-6)}`;
    setEventForm({
      id: autoId,
      title: "",
      date: new Date().toISOString().split("T")[0],
      time: "5:00 PM",
      location: "CS Building, Room 204",
      status: "upcoming",
      description: "",
      longDescription: "",
      tags: "Workshop, Technical",
      registrationLink: "",
    });
    setEditingEvent({ isNew: true });
  };

  const openEditEventModal = (event) => {
    setEventForm({
      ...event,
      tags: Array.isArray(event.tags) ? event.tags.join(", ") : event.tags || "",
      registrationLink: event.registrationLink || "",
    });
    setEditingEvent({ isNew: false, id: event.id });
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    const registrationLink = safeExternalUrl(eventForm.registrationLink);
    if (eventForm.registrationLink.trim() && !registrationLink) {
      setFormError("Registration links must use http:// or https://.");
      return;
    }
    const formattedTags = eventForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const eventPayload = {
      ...eventForm,
      tags: formattedTags,
      registrationLink,
    };

    if (editingEvent.isNew) {
      addEvent(eventPayload);
    } else {
      updateEvent(editingEvent.id, eventPayload);
    }

    setFormError("");
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteEvent(id);
    }
  };

  // ── Team Member Modal Handlers ──
  const openNewMemberModal = () => {
    const autoId = `member-${Date.now().toString().slice(-6)}`;
    setUploadError("");
    setMemberForm({
      id: autoId,
      name: "",
      role: "",
      year: "3rd Year, CSE",
      bio: "",
      image: "",
      github: "",
      linkedin: "",
      instagram: "",
      whatsapp: "",
      twitter: "",
      website: "",
    });
    setEditingMember({ isNew: true });
  };

  const openEditMemberModal = (member) => {
    setUploadError("");
    const getClean = (val) => (val && typeof val === "string" && !val.includes("placeholder") ? val : "");
    setMemberForm({
      id: member.id,
      name: member.name,
      role: member.role,
      year: member.year,
      bio: member.bio,
      image: member.image || "",
      github: getClean(member.socials?.github),
      linkedin: getClean(member.socials?.linkedin),
      instagram: getClean(member.socials?.instagram),
      whatsapp: getClean(member.socials?.whatsapp),
      twitter: getClean(member.socials?.twitter),
      website: getClean(member.socials?.website),
    });
    setEditingMember({ isNew: false, id: member.id });
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    setUploadError("");

    try {
      const apiKeyToUse = imgbbApiKey.trim() || import.meta.env.VITE_IMGBB_API_KEY || "";
      const result = await uploadToImgBB(file, apiKeyToUse);
      setMemberForm((prev) => ({ ...prev, image: result.display_url }));
    } catch (err) {
      setUploadError(err.message || "Failed to upload image to ImgBB.");
    } finally {
      setUploadingImg(false);
      e.target.value = "";
    }
  };

  const handleSaveApiKey = (key) => {
    setImgbbApiKey(key);
    try {
      if (key) {
        localStorage.setItem("acm_imgbb_api_key", key);
      } else {
        localStorage.removeItem("acm_imgbb_api_key");
      }
    } catch (e) {
      console.error("Failed to save ImgBB API key to localStorage:", e);
    }
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    const github = formatSocialUrl(memberForm.github, "github");
    const linkedin = formatSocialUrl(memberForm.linkedin, "linkedin");
    const instagram = formatSocialUrl(memberForm.instagram, "instagram");
    const whatsapp = formatSocialUrl(memberForm.whatsapp, "whatsapp");
    const twitter = formatSocialUrl(memberForm.twitter, "twitter");
    const website = formatSocialUrl(memberForm.website, "website");

    const image = memberForm.image ? (safeExternalUrl(memberForm.image) || memberForm.image) : "";

    const socials = {};
    if (github) socials.github = github;
    if (linkedin) socials.linkedin = linkedin;
    if (instagram) socials.instagram = instagram;
    if (whatsapp) socials.whatsapp = whatsapp;
    if (twitter) socials.twitter = twitter;
    if (website) socials.website = website;

    const memberPayload = {
      id: memberForm.id,
      name: memberForm.name,
      role: memberForm.role,
      year: memberForm.year,
      bio: memberForm.bio,
      ...(image ? { image } : {}),
      socials,
    };

    if (editingMember.isNew) {
      addTeamMember(memberPayload);
    } else {
      updateTeamMember(editingMember.id, memberPayload);
    }

    setFormError("");
    setEditingMember(null);
  };

  const handleDeleteMember = (id, name) => {
    if (window.confirm(`Are you sure you want to delete member "${name}"?`)) {
      deleteTeamMember(id);
    }
  };

  // ── Site Config Handler ──
  const handleSaveConfig = (e) => {
    e.preventDefault();
    const foundingYear = Number(configForm.foundingYear);
    if (!Number.isInteger(foundingYear) || foundingYear < 1900 || foundingYear > 2100) {
      setFormError("Founding year must be a valid year.");
      return;
    }
    const socials = Object.fromEntries(
      Object.entries(configForm.socials || {}).map(([name, value]) => [name, safeExternalUrl(value)]),
    );
    if (Object.entries(configForm.socials || {}).some(([, value]) => value?.trim() && !safeExternalUrl(value))) {
      setFormError("Social links must use http:// or https://.");
      return;
    }
    updateSiteConfig({ ...configForm, foundingYear, socials });
    setFormError("");
    setConfigSaved(true);
    setShowPreviewModal(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  // ── Secure Passcode Change ──
  // ── Export Code Snippets (per file) ──
  const exportSections = [
    {
      key: "siteConfig",
      file: "src/data/siteConfig.js",
      getCode: () => `export const siteConfig = ${JSON.stringify(siteConfig, null, 2)};`,
    },
    {
      key: "events",
      file: "src/data/events.js",
      getCode: () => `export const events = ${JSON.stringify(events, null, 2)};`,
    },
    {
      key: "team",
      file: "src/data/team.js",
      getCode: () => `export const team = ${JSON.stringify(team, null, 2)};`,
    },
  ];

  const copySection = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadJSON = () => {
    const data = { siteConfig, events, team };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `acm-website-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Password Guard View ──
  if (isCheckingSession) {
    return (
      <section className="py-24 md:py-32">
        <Container>
          <p className="text-center font-mono text-sm text-ink-muted">Checking secure session…</p>
        </Container>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="py-24 md:py-32">
        <Container>
          <div className="max-w-md mx-auto bg-paper-raised border border-rule rounded-md p-8 shadow-md relative">
            <div className="w-12 h-12 rounded bg-indigo/10 flex items-center justify-center mb-6 mx-auto">
              <Lock size={24} className="text-indigo" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-display font-bold text-ink text-center mb-2">
              Admin Portal Security
            </h1>
            <p className="text-sm font-body text-ink-muted text-center mb-6">
              Enter admin passcode to authenticate your session.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="passcode-input"
                  className="block font-mono text-xs text-ink-muted uppercase mb-2"
                >
                  Passcode
                </label>
                <input
                  id="passcode-input"
                  type="password"
                  value={passInput}
                  disabled={isVerifying}
                  onChange={(e) => setPassInput(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full px-4 py-2.5 bg-paper border border-rule rounded font-mono text-ink focus:outline-none focus:ring-2 focus:ring-indigo disabled:opacity-50"
                />
                {authError && (
                  <p className="mt-2 text-xs font-mono text-red-500 flex items-center gap-1">
                    <ShieldAlert size={12} /> {authError}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isVerifying}
                className="w-full"
              >
                {isVerifying ? "Authenticating…" : "Authenticate Session"}
              </Button>
            </form>
          </div>
        </Container>
      </section>
    );
  }

  // ── Authenticated Admin Portal ──
  return (
    <section className="py-12 md:py-20">
      <Container>
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-rule">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-ink">
              Content Management System
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm("Discard browser edits and reload the current src/data files?")) {
                  reloadSourceData();
                }
              }}
              title="Reload content from src/data"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 min-h-[40px] border border-rule text-ink-muted hover:text-red-500 rounded font-mono text-xs transition-colors"
            >
              <RotateCcw size={14} />
              Reload Source Data
            </button>
            <Button variant="secondary" onClick={handleLock} className="gap-2">
              <Lock size={14} />
              Lock Session
            </Button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-rule pb-4">
          <button
            onClick={() => setActiveTab("events")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded font-body text-sm font-medium transition-all ${
              activeTab === "events"
                ? "bg-indigo text-white shadow-sm"
                : "text-ink-muted hover:text-ink bg-paper-raised border border-rule"
            }`}
          >
            <Calendar size={16} />
            Events ({events.length})
          </button>

          <button
            onClick={() => setActiveTab("config")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded font-body text-sm font-medium transition-all ${
              activeTab === "config"
                ? "bg-indigo text-white shadow-sm"
                : "text-ink-muted hover:text-ink bg-paper-raised border border-rule"
            }`}
          >
            <Settings size={16} />
            Site Configuration
          </button>

          <button
            onClick={() => setActiveTab("team")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded font-body text-sm font-medium transition-all ${
              activeTab === "team"
                ? "bg-indigo text-white shadow-sm"
                : "text-ink-muted hover:text-ink bg-paper-raised border border-rule"
            }`}
          >
            <Users size={16} />
            Team Members ({team.length})
          </button>

          <button
            onClick={() => setActiveTab("export")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded font-body text-sm font-medium transition-all ${
              activeTab === "export"
                ? "bg-indigo text-white shadow-sm"
                : "text-ink-muted hover:text-ink bg-paper-raised border border-rule"
            }`}
          >
            <Download size={16} />
            Export & Backup
          </button>
        </div>

        {/* ── TAB 1: EVENTS MANAGER ── */}
        {activeTab === "events" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-ink">
                Events List ({events.length})
              </h2>
              <Button onClick={openNewEventModal} variant="primary" className="gap-2">
                <Plus size={16} />
                Add New Event
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((ev) => (
                <Card key={ev.id} className="relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <StatusMeta id={ev.id} status={ev.status} />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditEventModal(ev)}
                          title="Edit Event"
                          className="p-2.5 text-ink-muted hover:text-indigo rounded transition-colors min-h-[40px] min-w-[40px] inline-flex items-center justify-center"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          title="Delete Event"
                          className="p-2.5 text-ink-muted hover:text-red-500 rounded transition-colors min-h-[40px] min-w-[40px] inline-flex items-center justify-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-display font-semibold text-ink mb-1">
                      {ev.title}
                    </h3>
                    <p className="font-mono text-xs text-ink-muted mb-3">
                      📅 {ev.date} · ⏰ {ev.time} · 📍 {ev.location}
                    </p>
                    <p className="text-sm font-body text-ink-muted line-clamp-2 mb-4">
                      {ev.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-rule">
                    <div className="flex flex-wrap gap-1">
                      {ev.tags?.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                    <Link
                      to={`/events/${ev.id}`}
                      target="_blank"
                      className="font-mono text-xs text-indigo flex items-center gap-1 hover:underline"
                    >
                      View Live <ExternalLink size={12} />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: SITE CONFIG & SECURITY ── */}
        {activeTab === "config" && (
          <div className="space-y-8 max-w-2xl">
            <div className="bg-paper-raised border border-rule rounded-md p-6">
              <h2 className="text-xl font-display font-semibold text-ink mb-4">
                Edit Site Configuration
              </h2>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                {formError && (
                  <p className="font-mono text-xs text-red-500 flex items-center gap-1">
                    <ShieldAlert size={14} /> {formError}
                  </p>
                )}
                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    Club Name
                  </label>
                  <input
                    type="text"
                    value={configForm.clubName || ""}
                    onChange={(e) => setConfigForm({ ...configForm, clubName: e.target.value })}
                    className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={configForm.tagline || ""}
                    onChange={(e) => setConfigForm({ ...configForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={configForm.email || ""}
                    onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    Founding Year
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={configForm.foundingYear || ""}
                    onChange={(e) => setConfigForm({ ...configForm, foundingYear: e.target.value })}
                    className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={configForm.description || ""}
                    onChange={(e) => setConfigForm({ ...configForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      value={configForm.socials?.github || ""}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          socials: { ...configForm.socials, github: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="text"
                      value={configForm.socials?.instagram || ""}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          socials: { ...configForm.socials, instagram: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={configForm.socials?.linkedin || ""}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          socials: { ...configForm.socials, linkedin: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      Discord Invite URL
                    </label>
                    <input
                      type="text"
                      value={configForm.socials?.discord || ""}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          socials: { ...configForm.socials, discord: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Button type="submit" variant="primary" className="gap-2">
                    <Save size={16} /> Save Configuration
                  </Button>
                  {configSaved && (
                    <span className="font-mono text-xs text-signal flex items-center gap-1">
                      <Check size={14} /> Saved live!
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* ImgBB Media API Key Settings Card */}
            <div className="bg-paper-raised border border-rule rounded-md p-6">
              <h2 className="text-xl font-display font-semibold text-ink mb-2">
                ImgBB Image Hosting Settings
              </h2>
              <p className="text-xs font-body text-ink-muted mb-4">
                Configure your free ImgBB API Key to enable direct team member image uploads in the Admin Panel. Get a free API key at{" "}
                <a
                  href="https://api.imgbb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo hover:underline font-mono"
                >
                  api.imgbb.com
                </a>.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    ImgBB API Key
                  </label>
                  <input
                    type="password"
                    value={imgbbApiKey}
                    onChange={(e) => handleSaveApiKey(e.target.value)}
                    placeholder={import.meta.env.VITE_IMGBB_API_KEY ? "Using key from VITE_IMGBB_API_KEY environment variable" : "Paste your ImgBB API key here..."}
                    className="w-full px-3 py-2 bg-paper border border-rule rounded font-mono text-xs text-ink"
                  />
                </div>
                {import.meta.env.VITE_IMGBB_API_KEY ? (
                  <p className="font-mono text-xs text-emerald-500 flex items-center gap-1">
                    <Check size={14} /> Environment variable <code className="bg-paper px-1 py-0.5 rounded">VITE_IMGBB_API_KEY</code> detected!
                  </p>
                ) : imgbbApiKey ? (
                  <p className="font-mono text-xs text-emerald-500 flex items-center gap-1">
                    <Check size={14} /> Custom ImgBB API key saved to browser memory.
                  </p>
                ) : (
                  <p className="font-mono text-xs text-amber-500 flex items-center gap-1">
                    <Info size={14} /> No API key set. Direct file uploads will be unavailable until a key is added.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: TEAM MANAGER ── */}
        {activeTab === "team" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-ink">
                Executive Team ({team.length})
              </h2>
              <Button onClick={openNewMemberModal} variant="primary" className="gap-2">
                <Plus size={16} />
                Add Member
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((m, index) => (
                <Card key={m.id} className="relative flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-md overflow-hidden bg-indigo/10 border border-rule flex-shrink-0 flex items-center justify-center font-display font-bold text-lg text-indigo">
                          {m.image ? (
                            <img src={m.image} alt={m.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                          ) : (
                            m.name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h3 className="text-lg font-display font-semibold text-ink leading-tight">{m.name}</h3>
                            <span className="font-mono text-[10px] text-indigo/70 font-bold px-1.5 py-0.5 rounded bg-indigo/10">#{index + 1}</span>
                          </div>
                          <p className="font-mono text-xs text-indigo font-bold mb-0.5">{m.role}</p>
                          <p className="font-mono text-xs text-ink-muted">{m.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 self-start">
                        <button
                          onClick={() => moveTeamMember(index, "up")}
                          disabled={index === 0}
                          title="Move Up"
                          className="p-1.5 text-ink-muted hover:text-indigo disabled:opacity-20 disabled:pointer-events-none rounded transition-colors"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          onClick={() => moveTeamMember(index, "down")}
                          disabled={index === team.length - 1}
                          title="Move Down"
                          className="p-1.5 text-ink-muted hover:text-indigo disabled:opacity-20 disabled:pointer-events-none rounded transition-colors"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          onClick={() => openEditMemberModal(m)}
                          title="Edit Member"
                          className="p-1.5 text-ink-muted hover:text-indigo rounded transition-colors"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m.id, m.name)}
                          title="Delete Member"
                          className="p-1.5 text-ink-muted hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Active Social Links */}
                    {(() => {
                      const activeSocials = [
                        { key: "github", label: "GitHub", Icon: GitHubIcon },
                        { key: "linkedin", label: "LinkedIn", Icon: LinkedInIcon },
                        { key: "instagram", label: "Instagram", Icon: InstagramIcon },
                        { key: "whatsapp", label: "WhatsApp", Icon: WhatsAppIcon },
                        { key: "twitter", label: "Twitter", Icon: TwitterIcon },
                        { key: "website", label: "Website", Icon: Globe },
                      ].filter(({ key }) => {
                        const val = m.socials?.[key];
                        return Boolean(val && typeof val === "string" && val.trim() !== "" && !val.includes("placeholder"));
                      });

                      if (activeSocials.length === 0) return null;

                      return (
                        <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-rule mt-2">
                          {activeSocials.map(({ key, label, Icon }) => (
                            <a
                              key={key}
                              href={m.socials[key]}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${m.name} on ${label}`}
                              title={`${label}: ${m.socials[key]}`}
                              className="p-1.5 text-ink-muted hover:text-indigo transition-colors rounded min-h-[36px] min-w-[36px] inline-flex items-center justify-center"
                            >
                              <Icon size={15} />
                            </a>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: EXPORT & BACKUP ── */}
        {activeTab === "export" && (
          <div className="max-w-3xl bg-paper-raised border border-rule rounded-md p-6 space-y-6">
            <div>
              <h2 className="text-xl font-display font-semibold text-ink mb-2">
                Data Backup & Export
              </h2>
              <p className="text-sm font-body text-ink-muted">
                All changes you make in this dashboard are saved instantly to your browser's <code className="text-indigo font-mono">localStorage</code>.
                You can download your data as a JSON file or copy formatted code snippets to update your static <code className="text-indigo font-mono">src/data/*.js</code> files in your codebase.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownloadJSON} variant="primary" className="gap-2">
                <Download size={16} /> Download JSON Backup
              </Button>
            </div>

            <div className="space-y-6">
              {exportSections.map(({ key, file, getCode }) => {
                const isCopied = copiedSection === key;
                return (
                  <div key={key} className="bg-paper border border-rule rounded-md p-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className="font-mono text-xs text-indigo font-bold">{file}</p>
                      <button
                        onClick={() => copySection(key, getCode())}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-rule rounded font-mono text-xs text-ink-muted hover:text-indigo transition-colors focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1"
                      >
                        {isCopied ? <Check size={14} className="text-signal" /> : <Save size={14} />}
                        {isCopied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <pre className="p-4 bg-paper-raised border border-rule rounded font-mono text-xs text-ink overflow-x-auto max-h-72">
                      <code>{getCode()}</code>
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── EVENT EDIT/NEW MODAL ── */}
        {editingEvent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-paper-raised border border-rule rounded-md max-w-xl w-full p-4 sm:p-6 shadow-xl my-4 sm:my-8 max-h-[85vh] sm:max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-rule flex-shrink-0">
                <h3 className="text-lg sm:text-xl font-display font-semibold text-ink">
                  {editingEvent.isNew ? "Create New Event" : "Edit Event"}
                </h3>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="p-1.5 sm:p-2 text-ink-muted hover:text-ink rounded min-h-[36px] sm:min-h-[40px] min-w-[36px] sm:min-w-[40px] inline-flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-3 sm:space-y-4 overflow-y-auto flex-1 pr-1 sm:pr-2">
                {formError && (
                  <p className="font-mono text-xs text-red-500 flex items-center gap-1">
                    <ShieldAlert size={14} /> {formError}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      Event ID (Unique)
                    </label>
                    <input
                      type="text"
                      required
                      value={eventForm.id}
                      onChange={(e) => setEventForm({ ...eventForm, id: e.target.value })}
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-mono text-xs text-ink"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      Status
                    </label>
                    <select
                      value={eventForm.status}
                      onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-mono text-xs text-ink"
                    >
                      <option value="upcoming">upcoming</option>
                      <option value="past">past</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      Date & Time
                    </label>
                    <DatePicker
                      required
                      selected={toPickerDate(eventForm.date, eventForm.time)}
                      onChange={(value) =>
                        setEventForm((form) => ({ ...form, ...fromPickerDate(value) }))
                      }
                      showTimeSelect
                      timeIntervals={15}
                      dateFormat="MMM d, yyyy h:mm aa"
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-mono text-xs text-ink focus:outline-none focus:ring-2 focus:ring-indigo"
                      calendarClassName="acm-calendar"
                      popperClassName="acm-calendar-popper"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-mono text-xs text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    Short Description (Card summary)
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    Full Description (Detail Page)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={eventForm.longDescription}
                    onChange={(e) => setEventForm({ ...eventForm, longDescription: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 bg-paper border border-rule rounded font-body text-ink sm:rows-4"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={eventForm.tags}
                    onChange={(e) => setEventForm({ ...eventForm, tags: e.target.value })}
                    placeholder="Workshop, Technical, Beginner"
                    className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    RSVP / Google Form URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={eventForm.registrationLink}
                    onChange={(e) => setEventForm({ ...eventForm, registrationLink: e.target.value })}
                    placeholder="https://forms.gle/..."
                    className="w-full px-3 py-2 bg-paper border border-rule rounded font-mono text-xs text-ink"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-rule">
                  <Button type="button" variant="secondary" onClick={() => setEditingEvent(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingEvent.isNew ? "Create Event" : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── TEAM MEMBER EDIT/NEW MODAL ── */}
        {editingMember && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-paper-raised border border-rule rounded-md max-w-xl w-full p-4 sm:p-6 shadow-xl my-4 sm:my-8 max-h-[85vh] sm:max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-rule flex-shrink-0">
                <h3 className="text-lg sm:text-xl font-display font-semibold text-ink">
                  {editingMember.isNew ? "Add Team Member" : "Edit Team Member"}
                </h3>
                <button
                  onClick={() => setEditingMember(null)}
                  className="p-1.5 sm:p-2 text-ink-muted hover:text-ink rounded min-h-[36px] sm:min-h-[40px] min-w-[36px] sm:min-w-[40px] inline-flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveMember} className="space-y-3 sm:space-y-4 overflow-y-auto flex-1 pr-1 sm:pr-2">
                {formError && (
                  <p className="font-mono text-xs text-red-500 flex items-center gap-1">
                    <ShieldAlert size={14} /> {formError}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      Member Name
                    </label>
                    <input
                      type="text"
                      required
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      required
                      value={memberForm.role}
                      onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                      placeholder="President, Vice President, Tech Lead"
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                    />
                  </div>
                </div>

                {/* Profile Photo / Avatar Upload Field (ImgBB) */}
                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    Profile Photo / Avatar (ImgBB Upload)
                  </label>
                  <div className="flex flex-row items-center gap-3 sm:gap-4 p-2.5 sm:p-3 bg-paper border border-rule rounded-md">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden bg-indigo/10 border border-rule flex-shrink-0 flex items-center justify-center relative">
                      {memberForm.image ? (
                        <img
                          src={memberForm.image}
                          alt="Avatar preview"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="text-indigo/50" size={24} />
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label
                          className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded font-medium border transition-colors ${
                            uploadingImg
                              ? "bg-indigo/20 text-indigo border-indigo/30 opacity-70 pointer-events-none"
                              : "bg-indigo text-white border-transparent hover:bg-indigo/90"
                          }`}
                        >
                          {uploadingImg ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Upload size={14} />
                          )}
                          {uploadingImg ? "Uploading to ImgBB..." : "Upload to ImgBB"}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImg}
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>

                        {memberForm.image && (
                          <button
                            type="button"
                            onClick={() => setMemberForm({ ...memberForm, image: "" })}
                            className="px-2.5 py-1.5 text-xs font-mono text-red-500 hover:text-red-600 border border-rule rounded hover:bg-red-500/10 transition-colors"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={memberForm.image}
                        onChange={(e) => setMemberForm({ ...memberForm, image: e.target.value })}
                        placeholder="Or paste direct image URL (https://i.ibb.co/...)"
                        className="w-full px-3 py-1.5 bg-paper-raised border border-rule rounded font-mono text-xs text-ink"
                      />
                    </div>
                  </div>

                  {uploadError && (
                    <p className="font-mono text-xs text-red-500 mt-1 flex items-center gap-1">
                      <ShieldAlert size={12} /> {uploadError}
                    </p>
                  )}
                  {!uploadError && !import.meta.env.VITE_IMGBB_API_KEY && !imgbbApiKey && (
                    <p className="font-mono text-[11px] text-amber-500 mt-1 flex items-center gap-1">
                      <Info size={12} /> Set VITE_IMGBB_API_KEY in .env or configure your API key in Admin Settings to enable ImgBB uploads.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    Year & Department
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.year}
                    onChange={(e) => setMemberForm({ ...memberForm, year: e.target.value })}
                    placeholder="3rd Year, CSE"
                    className="w-full px-3 py-2 bg-paper border border-rule rounded font-mono text-xs text-ink"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={memberForm.bio}
                    onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                    className="w-full px-3 py-1.5 sm:py-2 bg-paper border border-rule rounded font-body text-ink sm:rows-3"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      value={memberForm.github || ""}
                      onChange={(e) => setMemberForm({ ...memberForm, github: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-1.5 bg-paper border border-rule rounded font-mono text-xs text-ink"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={memberForm.linkedin || ""}
                      onChange={(e) => setMemberForm({ ...memberForm, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3 py-1.5 bg-paper border border-rule rounded font-mono text-xs text-ink"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="text"
                      value={memberForm.instagram || ""}
                      onChange={(e) => setMemberForm({ ...memberForm, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-1.5 bg-paper border border-rule rounded font-mono text-xs text-ink"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      WhatsApp (Number or Link)
                    </label>
                    <input
                      type="text"
                      value={memberForm.whatsapp || ""}
                      onChange={(e) => setMemberForm({ ...memberForm, whatsapp: e.target.value })}
                      placeholder="+91 9876543210 or wa.me/..."
                      className="w-full px-3 py-1.5 bg-paper border border-rule rounded font-mono text-xs text-ink"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      Twitter / X URL
                    </label>
                    <input
                      type="text"
                      value={memberForm.twitter || ""}
                      onChange={(e) => setMemberForm({ ...memberForm, twitter: e.target.value })}
                      placeholder="https://x.com/..."
                      className="w-full px-3 py-1.5 bg-paper border border-rule rounded font-mono text-xs text-ink"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      Personal Website URL
                    </label>
                    <input
                      type="text"
                      value={memberForm.website || ""}
                      onChange={(e) => setMemberForm({ ...memberForm, website: e.target.value })}
                      placeholder="https://mywebsite.com"
                      className="w-full px-3 py-1.5 bg-paper border border-rule rounded font-mono text-xs text-ink"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-rule">
                  <Button type="button" variant="secondary" onClick={() => setEditingMember(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingMember.isNew ? "Add Member" : "Save Member"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── PREVIEW NOTICE DIALOGUE ── */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-paper-raised border border-rule rounded-md max-w-lg w-full p-6 shadow-xl relative">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-rule">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-amber/10 text-amber flex items-center justify-center">
                    <Info size={18} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-ink">
                    Live Preview Saved
                  </h3>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 text-ink-muted hover:text-ink rounded min-h-[40px] min-w-[40px] inline-flex items-center justify-center"
                  aria-label="Close dialogue"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-sm font-body text-ink-muted leading-relaxed mb-6">
                <p>
                  Your configuration changes have been saved to your browser session as a <strong className="text-ink font-semibold">live preview</strong>.
                </p>
                <p className="p-3 bg-paper border border-rule rounded text-xs font-mono text-ink leading-normal">
                  ⚠️ Note: Because this website is a static single-page application, changes in the admin panel do not write back to your local files automatically.
                </p>
                <p>
                  To make your changes permanent across production deploys, please update <code className="px-1.5 py-0.5 bg-paper rounded border border-rule text-indigo font-mono text-xs">src/data/siteConfig.js</code> in your codebase manually.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-rule">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setShowPreviewModal(false);
                    setActiveTab("export");
                  }}
                  className="text-xs gap-1.5"
                >
                  <Download size={14} /> Go to Export Tab
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => {
                    const code = `export const siteConfig = ${JSON.stringify(configForm, null, 2)};`;
                    navigator.clipboard.writeText(code);
                    setShowPreviewModal(false);
                  }}
                  className="text-xs gap-1.5"
                >
                  <Copy size={14} /> Copy Code Snippet
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
