/**
 * Button — Primary and secondary variants per the Design System.
 * Ensures WCAG AAA contrast ratio in both Light and Dark modes.
 *
 * variant: "primary" | "secondary"
 * as: "button" | "a" — renders as <button> by default; pass as="a" + href for link buttons
 */
export default function Button({
  children,
  variant = "primary",
  as: Tag = "button",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 font-body font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-2 cursor-pointer";

  const variants = {
    primary:
      "bg-indigo text-white dark:text-[#070D17] font-semibold hover:bg-[--color-indigo-hover] hover:-translate-y-0.5 active:translate-y-0 shadow-sm",
    secondary:
      "border border-ink text-ink bg-transparent hover:bg-ink hover:text-paper hover:-translate-y-0.5 active:translate-y-0",
  };

  return (
    <Tag className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
