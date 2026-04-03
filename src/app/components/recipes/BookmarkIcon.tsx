export default function BookmarkIcon({ saved }: { saved: boolean }) {
  const fill = saved ? "currentColor" : "transparent";

  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M17 3H7a2 2 0 0 0-2 2v16l7-4 7 4V5a2 2 0 0 0-2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
