/**
 * Card — bg-paper-raised with rule border, hover-lift transition.
 * Elevation comes from border-first, then shadow-sm → shadow-md on hover.
 */
export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-paper-raised border border-rule rounded-md p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
