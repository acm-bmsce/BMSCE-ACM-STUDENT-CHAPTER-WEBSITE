const base = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

export function IconDashboard(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

export function IconCalendar(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  );
}

export function IconLogout(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

export function IconPlus(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconEdit(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export function IconTrash(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconEye(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconUsers(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function IconTicket(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M3 9a2 2 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a2 2 0 0 1 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z" />
      <path d="M13 5v14" strokeDasharray="2 3" />
    </svg>
  );
}

export function IconRupee(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M6 4h12M6 8h12M8 4c4 0 6 1.5 6 4s-2 4-6 4l6 8" />
    </svg>
  );
}

export function IconClose(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconMenu(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function IconDownload(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
    </svg>
  );
}

export function IconGlobe(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-6-3.8-9S9.5 5.5 12 3Z" />
    </svg>
  );
}

export function IconSpark(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5Z" />
    </svg>
  );
}

export function IconFolder(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h4l2 2.5H18.5A2.5 2.5 0 0 1 21 9v8.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Z" />
    </svg>
  );
}

export function IconBook(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

