import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * ThemeToggle — Sun/Moon icon button that toggles between light and dark mode.
 * Reads from and writes to ThemeContext.
 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="relative p-2 rounded text-ink-muted hover:text-indigo transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
    >
      {/* Sun icon — visible in dark mode (clicking = go light) */}
      <span
        className={`block transition-all duration-300 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75 absolute inset-0 m-auto"
        }`}
        aria-hidden="true"
      >
        <Sun size={18} />
      </span>
      {/* Moon icon — visible in light mode (clicking = go dark) */}
      <span
        className={`block transition-all duration-300 ${
          !isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75 absolute inset-0 m-auto"
        }`}
        aria-hidden="true"
      >
        <Moon size={18} />
      </span>
    </button>
  );
}
