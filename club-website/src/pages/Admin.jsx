import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  Lock,
  Unlock,
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
} from "lucide-react";
import { useData } from "../context/DataContext";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import StatusMeta from "../components/ui/StatusMeta";

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
    updateSiteConfig,
    resetToDefaults,
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
    github: "",
    linkedin: "",
  });

  const [configForm, setConfigForm] = useState({ ...siteConfig });
  const [configSaved, setConfigSaved] = useState(false);

  const [formError, setFormError] = useState("");

  // Copy/export feedback
  const [copiedCode, setCopiedCode] = useState(false);

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
    setMemberForm({
      id: autoId,
      name: "",
      role: "",
      year: "3rd Year, CSE",
      bio: "",
      github: "",
      linkedin: "",
    });
    setEditingMember({ isNew: true });
  };

  const openEditMemberModal = (member) => {
    setMemberForm({
      id: member.id,
      name: member.name,
      role: member.role,
      year: member.year,
      bio: member.bio,
      github: member.socials?.github || "",
      linkedin: member.socials?.linkedin || "",
    });
    setEditingMember({ isNew: false, id: member.id });
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    const github = safeExternalUrl(memberForm.github);
    const linkedin = safeExternalUrl(memberForm.linkedin);
    if ((memberForm.github.trim() && !github) || (memberForm.linkedin.trim() && !linkedin)) {
      setFormError("Social profile links must use http:// or https://.");
      return;
    }
    const memberPayload = {
      id: memberForm.id,
      name: memberForm.name,
      role: memberForm.role,
      year: memberForm.year,
      bio: memberForm.bio,
      socials: {
        github: github || "https://github.com/placeholder",
        linkedin: linkedin || "https://linkedin.com/in/placeholder",
      },
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
    const socials = Object.fromEntries(
      Object.entries(configForm.socials || {}).map(([name, value]) => [name, safeExternalUrl(value)]),
    );
    if (Object.entries(configForm.socials || {}).some(([, value]) => value?.trim() && !safeExternalUrl(value))) {
      setFormError("Social links must use http:// or https://.");
      return;
    }
    updateSiteConfig({ ...configForm, socials });
    setFormError("");
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  // ── Secure Passcode Change ──
  // ── Export Code Snippet ──
  const getExportCode = () => {
    return `// Copy into src/data/events.js
export const events = ${JSON.stringify(events, null, 2)};

// Copy into src/data/team.js
export const team = ${JSON.stringify(team, null, 2)};

// Copy into src/data/siteConfig.js
export const siteConfig = ${JSON.stringify(siteConfig, null, 2)};`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getExportCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm("Reset all events, team, and config to initial factory defaults?")) {
                  resetToDefaults();
                }
              }}
              title="Reset data to static defaults"
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-rule text-ink-muted hover:text-red-500 rounded font-mono text-xs transition-colors"
            >
              <RotateCcw size={14} />
              Reset Defaults
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
                          className="p-1.5 text-ink-muted hover:text-indigo rounded transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          title="Delete Event"
                          className="p-1.5 text-ink-muted hover:text-red-500 rounded transition-colors"
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
              {team.map((m) => (
                <Card key={m.id} className="relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-indigo font-bold">{m.role}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditMemberModal(m)}
                          title="Edit Member"
                          className="p-1 text-ink-muted hover:text-indigo rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m.id, m.name)}
                          title="Delete Member"
                          className="p-1 text-ink-muted hover:text-red-500 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-display font-semibold text-ink">{m.name}</h3>
                    <p className="font-mono text-xs text-ink-muted mb-2">{m.year}</p>
                    <p className="text-sm font-body text-ink-muted line-clamp-3 mb-4">{m.bio}</p>
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
              <Button onClick={handleCopyCode} variant="secondary" className="gap-2">
                {copiedCode ? <Check size={16} className="text-signal" /> : <Save size={16} />}
                {copiedCode ? "Copied to Clipboard!" : "Copy Code Snippet"}
              </Button>
            </div>

            <div className="relative">
              <pre className="p-4 bg-paper border border-rule rounded font-mono text-xs text-ink overflow-x-auto max-h-96">
                <code>{getExportCode()}</code>
              </pre>
            </div>
          </div>
        )}

        {/* ── EVENT EDIT/NEW MODAL ── */}
        {editingEvent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-paper-raised border border-rule rounded-md max-w-xl w-full p-6 shadow-xl my-8">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-rule">
                <h3 className="text-xl font-display font-semibold text-ink">
                  {editingEvent.isNew ? "Create New Event" : "Edit Event"}
                </h3>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="p-1 text-ink-muted hover:text-ink rounded"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-4">
                {formError && (
                  <p className="font-mono text-xs text-red-500 flex items-center gap-1">
                    <ShieldAlert size={14} /> {formError}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      Date (YYYY-MM-DD)
                    </label>
                    <input
                      type="date"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-mono text-xs text-ink"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      required
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-mono text-xs text-ink"
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
                    rows={4}
                    required
                    value={eventForm.longDescription}
                    onChange={(e) => setEventForm({ ...eventForm, longDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
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
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-paper-raised border border-rule rounded-md max-w-xl w-full p-6 shadow-xl my-8">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-rule">
                <h3 className="text-xl font-display font-semibold text-ink">
                  {editingMember.isNew ? "Add Team Member" : "Edit Team Member"}
                </h3>
                <button
                  onClick={() => setEditingMember(null)}
                  className="p-1 text-ink-muted hover:text-ink rounded"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveMember} className="space-y-4">
                {formError && (
                  <p className="font-mono text-xs text-red-500 flex items-center gap-1">
                    <ShieldAlert size={14} /> {formError}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    rows={3}
                    required
                    value={memberForm.bio}
                    onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                    className="w-full px-3 py-2 bg-paper border border-rule rounded font-body text-ink"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      GitHub Profile URL
                    </label>
                    <input
                      type="text"
                      value={memberForm.github}
                      onChange={(e) => setMemberForm({ ...memberForm, github: e.target.value })}
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-mono text-xs text-ink"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-ink-muted uppercase mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="text"
                      value={memberForm.linkedin}
                      onChange={(e) => setMemberForm({ ...memberForm, linkedin: e.target.value })}
                      className="w-full px-3 py-2 bg-paper border border-rule rounded font-mono text-xs text-ink"
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
      </Container>
    </section>
  );
}
