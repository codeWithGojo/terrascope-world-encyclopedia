import type { SVGProps } from "react";

/** Code-drawn arrow: stays monochrome on iOS instead of becoming an emoji. */
export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="inline-icon"
      {...props}
    >
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  );
}
