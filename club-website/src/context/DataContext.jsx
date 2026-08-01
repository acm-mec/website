import { createContext, useContext, useState, useEffect } from "react";
import { siteConfig as initialSiteConfig } from "../data/siteConfig";
import { events as initialEvents } from "../data/events";
import { team as initialTeam } from "../data/team";

const DataContext = createContext(null);

const STORAGE_KEYS = {
  SITE_CONFIG: "acm_site_config_v1",
  EVENTS: "acm_events_v1",
  TEAM: "acm_team_v1",
};

function getStoredOrDefault(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

export function DataProvider({ children }) {
  const [siteConfig, setSiteConfig] = useState(() =>
    getStoredOrDefault(STORAGE_KEYS.SITE_CONFIG, initialSiteConfig)
  );
  const [events, setEvents] = useState(() =>
    getStoredOrDefault(STORAGE_KEYS.EVENTS, initialEvents)
  );
  const [team, setTeam] = useState(() =>
    getStoredOrDefault(STORAGE_KEYS.TEAM, initialTeam)
  );

  // Sync state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(siteConfig));
    } catch (e) {
      console.error("Failed to save siteConfig to localStorage:", e);
    }
  }, [siteConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error("Failed to save events to localStorage:", e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
    } catch (e) {
      console.error("Failed to save team to localStorage:", e);
    }
  }, [team]);

  // ── Events CRUD ──
  const addEvent = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const updateEvent = (id, updatedEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedEvent } : e))
    );
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // ── Team CRUD ──
  const addTeamMember = (newMember) => {
    setTeam((prev) => [...prev, newMember]);
  };

  const updateTeamMember = (id, updatedMember) => {
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedMember } : m))
    );
  };

  const deleteTeamMember = (id) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  // ── Site Config Update ──
  const updateSiteConfig = (newConfig) => {
    setSiteConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // ── Reset to Initial Static Data ──
  const resetToDefaults = () => {
    setSiteConfig(initialSiteConfig);
    setEvents(initialEvents);
    setTeam(initialTeam);
    try {
      localStorage.removeItem(STORAGE_KEYS.SITE_CONFIG);
      localStorage.removeItem(STORAGE_KEYS.EVENTS);
      localStorage.removeItem(STORAGE_KEYS.TEAM);
    } catch (e) {
      console.error("Error clearing localStorage:", e);
    }
  };

  return (
    <DataContext.Provider
      value={{
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
