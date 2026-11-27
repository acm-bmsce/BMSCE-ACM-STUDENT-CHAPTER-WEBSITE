// Shared admin building blocks: icons, page header, status pills, toast.
import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi, previewSrc } from "../../lib/adminApi";
import { cdn } from "../../lib/data";

const P = {
  home: <><path d="M3 10.5 12 3l9 7.5V21H3z" /><path d="M9 21v-6h6v6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  check: <path d="M4 12.5 9 17.5 20 6.5" />,
  award: <><circle cx="12" cy="9" r="6" /><path d="M8.5 14 7 22l5-3 5 3-1.5-8" /></>,
  users: <><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 9M22 21a7 7 0 0 0-4-6.3" /></>,
  folder: <path d="M3 6h7l2 2h9v12H3z" />,
  book: <><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z" /><path d="M20 4h-4a2 2 0 0 0-2 2" /></>,
  layout: <><rect x="3" y="3" width="18" height="18" /><path d="M3 9h18M9 21V9" /></>,
  out: <path d="M15 4h5v16h-5M10 8l-4 4 4 4M6 12h11" />,
  ext: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v6H4V6h6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  x: <path d="M5 5l14 14M19 5 5 19" />,
  down: <path d="M12 4v12M6 10l6 6 6-6M4 20h16" />,
  scan: <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16" />,
  mail: <><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></>,
};

export const Icon = ({ name, ...rest }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...rest}>
    {P[name]}
  </svg>
);

export function PageHead({ title, sub, crumb, children }) {
  return (
    <div className="tr">
      <div style={{ minWidth: 0 }}>
        {crumb && <p className="crumb">{crumb}</p>}
        <h1 className="h1">{title}</h1>
        {sub && <p className="sub">{sub}</p>}
      </div>
      {children && <div className="acts">{children}</div>}
    </div>
  );
}

const PILL = {
  PUBLISHED: "live",
  DRAFT: "wait",
  CLOSED: "off",
  COMPLETED: "off",
  CANCELLED: "bad",
  PRESENT: "ok",
  ABSENT: "bad",
  UNMARKED: "off",
  CONFIRMED: "ok",
  PENDING: "wait",
};
export const Pill = ({ status, children }) => <span className={`pl ${PILL[status] || "off"}`}>{children || status.charAt(0) + status.slice(1).toLowerCase()}</span>;

export function useToast() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (!msg) return undefined;
    const t = setTimeout(() => setMsg(""), 3200);
    return () => clearTimeout(t);
  }, [msg]);
  const node = msg ? (
    <div className="toast" role="status">
      {msg}
    </div>
  ) : null;
  return [node, useCallback((m) => setMsg(m), [])];
}

export const shortDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-");
export const n = (v) => Number(v || 0).toLocaleString("en-IN");

/** Attended vs certificates issued, the chapter's own small chart. */
export function Funnel({ present, certified }) {
  const pct = present ? Math.min(100, (certified / present) * 100) : 0;
  return (
    <div className="fn">
      <div className="tk" role="img" aria-label={`${certified} of ${present} certificates issued`}>
        <span className="at" style={{ width: present ? "100%" : 0 }} />
        <span className="is" style={{ width: `${pct}%` }} />
      </div>
      <p>
        <b className="num">{n(certified)}</b> of <span className="num">{n(present)}</span> issued
      </p>
    </div>
  );
}

/** Save a Blob as a file. */
export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/** Tags typed into one box: Enter or comma adds, Backspace on an empty box removes the last, × removes one. */
export function ChipInput({ id, value, onChange, placeholder, label }) {
  const [draft, setDraft] = useState("");
  const add = (raw) => {
    const parts = String(raw).split(",").map((t) => t.trim()).filter(Boolean);
    if (!parts.length) return;
    onChange([...new Set([...value, ...parts])]);
    setDraft("");
  };
  return (
    <div className="chipin" onClick={(e) => e.currentTarget.querySelector("input")?.focus()}>
      {value.map((t) => (
        <span key={t}>
          {t}
          <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))}>
            ×
          </button>
        </span>
      ))}
      <input
        id={id}
        aria-label={label}
        value={draft}
        placeholder={value.length ? "" : placeholder}
        onChange={(e) => (e.target.value.includes(",") ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={() => add(draft)}
        style={{ flex: 1, minWidth: 90, border: 0, background: "none", outline: "none", height: 28, padding: 0 }}
      />
    </div>
  );
}

/**
 * An image setting: paste a link or a site path, or upload a file (checked, converted to WebP
 * and saved under /img/uploads/). Shows a thumbnail; a fresh upload previews through the API
 * until the next deploy publishes it.
 */
export function ImageField({ id, label, value, onChange, hint, size = 72, square = false }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef(null);
  const pick = async (file) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const res = await adminApi.uploadImage(file);
      onChange(res.path);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };
  return (
    <div className="drop">
      {value ? (
        <img src={previewSrc(cdn(value, 240))} alt="" style={{ width: size, height: square ? size : Math.round(size * 1.25), objectFit: "cover" }} />
      ) : (
        <span style={{ width: size, height: square ? size : Math.round(size * 1.25), flex: "none", background: "var(--raised)" }} aria-hidden="true" />
      )}
      <div className="fld" style={{ flex: 1 }}>
        <label htmlFor={id}>{label}</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input id={id} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="https://… or /img/…" style={{ flex: 1, minWidth: 0 }} aria-describedby={error ? `${id}-e` : undefined} />
          <button type="button" className="b" onClick={() => input.current?.click()} disabled={busy}>
            {busy ? "Uploading…" : "Upload"}
          </button>
          <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={(e) => pick(e.target.files?.[0])} />
        </div>
        {error ? (
          <span className="hint" id={`${id}-e`} role="alert" style={{ color: "var(--negative)" }}>
            {error}
          </span>
        ) : hint ? (
          <span className="hint">{hint}</span>
        ) : null}
      </div>
    </div>
  );
}
