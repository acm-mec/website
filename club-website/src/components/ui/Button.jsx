/**
 * Button — Primary and secondary variants per the Design System.
 * Uses --color-indigo-hover CSS variable for automatic dark mode adaptation.
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
      // bg-indigo switches to cyan in dark mode via CSS variable
      // text-ink switches to near-white in dark mode — ensures contrast on both indigo AND cyan
      // hover uses --color-indigo-hover which is #312e81 (light) or #66EAFF (dark)
      "bg-indigo text-paper hover:bg-[--color-indigo-hover] hover:-translate-y-0.5 active:translate-y-0",
    secondary:
      "border border-ink text-ink bg-transparent hover:bg-ink hover:text-paper hover:-translate-y-0.5 active:translate-y-0",
  };

  return (
    <Tag className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
