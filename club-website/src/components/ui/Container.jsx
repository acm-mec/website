/**
 * Container — max-w-6xl centered wrapper with responsive horizontal padding.
 * Use this as the outermost wrapper for every page section's content.
 */
export default function Container({ children, className = "" }) {
  return (
    <div className={`max-w-6xl mx-auto px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
}
