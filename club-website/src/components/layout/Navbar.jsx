import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const linkClass = ({ isActive }) =>
    `font-body text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded ${
      isActive
        ? "text-indigo underline underline-offset-4"
        : "text-ink hover:text-indigo"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-rule">
      <nav
        aria-label="Main navigation"
        className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between"
      >
        {/* Logo / Club name */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display font-semibold text-lg text-ink hover:text-indigo transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 rounded group"
        >
          <span className="w-8 h-8 rounded bg-indigo/10 border border-indigo/20 flex items-center justify-center font-mono text-xs font-bold text-indigo group-hover:bg-indigo group-hover:text-paper transition-all duration-150">
            &gt;_
          </span>
          <span>{siteConfig.clubName}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === "/"} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Desktop: theme toggle + Join Us CTA */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button as={Link} to="/contact" variant="primary">
            Join Us
          </Button>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 rounded text-ink hover:text-indigo focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-1 transition-colors duration-150"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-rule bg-paper-raised"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-rule">
              <Button
                as={Link}
                to="/contact"
                variant="primary"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Join Us
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
