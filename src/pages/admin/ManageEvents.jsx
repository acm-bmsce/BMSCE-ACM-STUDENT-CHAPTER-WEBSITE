import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { adminApi, LIVE, previewSrc, publishNote } from "../../lib/adminApi";
import { cdn } from "../../lib/data";
import { slugify } from "../../lib/eventLinks";
import { ImageField, PageHead, shortDate } from "./ui";
import { IconClose, IconEdit, IconPlus, IconTrash } from "./AdminIcons";

/**
 * Events on the website's calendar and archive. Published events are saved to the chapter's
 * backend; drafts and website-only details to content/events.json (see lib/adminApi.js).
 * Sign-ups happen elsewhere; prices, "ACM members only", seats and team size are shown on the
 * event as information only.
 */

const TYPES = ["Workshop", "Hackathon", "Talk", "Coding challenge", "Seminar", "Competition", "Gaming", "Summit", "Other"];

const pad = (n) => String(n).padStart(2, "0");
const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromLocalInput = (v) => (v ? new Date(v).toISOString() : "");
const numOrNull = (v) => (v === "" || v === null || v === undefined ? null : Number(v));
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`);

function emptyForm() {
  const start = new Date(Date.now() + 7 * 86400000);
  start.setHours(10, 0, 0, 0);
  return {
    _id: "",
    title: "",
    slug: "",
    slugEdited: false,
    status: "draft",
    type: "Workshop",
    description: "",
    fullDescription: "",
    date: toLocalInput(start.toISOString()),
    endDate: "",
    location: "",
    image: "",
    gallery: [],
    outcomes: "",
    attendees: "",
    is_featured: false,
    is_team_event: false,
    teamMin: "",
    teamMax: "",
    acmExclusive: false,
    memberPrice: "",
    nonMemberPrice: "",
    capacity: "",
  };
}

function fromEvent(e) {
  return {
    ...emptyForm(),
    ...e,
    slugEdited: true,
    status: e.status === "draft" ? "draft" : "published",
    type: e.type || "",
    fullDescription: e.fullDescription || "",
    date: toLocalInput(e.date),
    endDate: toLocalInput(e.endDate),
    location: e.location || "",
    image: e.image || "",
    gallery: Array.isArray(e.gallery) ? e.gallery : [],
    outcomes: Array.isArray(e.outcomes) ? e.outcomes.join("\n") : e.outcomes || "",
    attendees: e.attendees ?? "",
    teamMin: e.teamMin ?? "",
    teamMax: e.teamMax ?? "",
    memberPrice: e.memberPrice ?? "",
    nonMemberPrice: e.nonMemberPrice ?? "",
    capacity: e.capacity ?? "",
  };
}

/** The form back into the stored shape; empty optional fields are left out. */
function toEvent(form, original) {
  const out = {
    ...(original || {}),
    _id: form._id || newId(),
    slug: form.slug,
    status: form.status,
    title: form.title.trim(),
    type: form.type,
    description: form.description.trim(),
    fullDescription: form.fullDescription.trim(),
    date: fromLocalInput(form.date),
    endDate: fromLocalInput(form.endDate) || null,
    location: form.location.trim(),
    image: form.image.trim(),
    gallery: form.gallery.map((g) => g.trim()).filter(Boolean),
    outcomes: form.outcomes.split("\n").map((o) => o.trim()).filter(Boolean),
    attendees: numOrNull(form.attendees),
    is_featured: Boolean(form.is_featured),
    is_team_event: Boolean(form.is_team_event),
    teamMin: form.is_team_event ? numOrNull(form.teamMin) : null,
    teamMax: form.is_team_event ? numOrNull(form.teamMax) : null,
    acmExclusive: Boolean(form.acmExclusive),
    memberPrice: numOrNull(form.memberPrice),
    nonMemberPrice: numOrNull(form.nonMemberPrice),
    capacity: numOrNull(form.capacity),
  };
  delete out.slugEdited;
  return out;
}

const uniqueSlug = (base, events, id) => {
  let slug = base || "event";
  for (let n = 2; events.some((e) => e.slug === slug && e._id !== id); n++) slug = `${base}-${n}`;
  return slug;
};

export default function ManageEvents() {
  const [params, setParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(25);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const res = await adminApi.loadEvents();
      setEvents(res.data);
      setSha(res.sha);
    } catch (err) {
      setListError(err.message || "Could not load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setForm(emptyForm());
    setFormError("");
    setFieldErrors([]);
    setDrawerOpen(true);
  }, []);

  // Overview's "New event" button links here with ?new=1.
  useEffect(() => {
    if (params.get("new") === "1") {
      openCreate();
      setParams((p) => {
        p.delete("new");
        return p;
      }, { replace: true });
    }
  }, [params, setParams, openCreate]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const set = (key, value) =>
    setForm((f) => {
      const next = { ...f, [key]: value };
      // The link name follows the title and year until someone edits it by hand.
      if ((key === "title" || key === "date") && !f.slugEdited) {
        const year = next.date ? new Date(next.date).getFullYear() : "";
        next.slug = slugify(`${next.title}${year ? ` ${year}` : ""}`);
      }
      return next;
    });

  const openEdit = (e) => {
    setEditing(e);
    setForm(fromEvent(e));
    setFormError("");
    setFieldErrors([]);
    setDrawerOpen(true);
  };

  /** Saves a change to the list; the server refuses if someone else saved first. */
  const commit = async (next, message) => {
    try {
      const res = await adminApi.saveEvents(events, next, sha);
      setEvents(res.data);
      setSha(res.sha);
      setNotice(`${message} ${publishNote()}`);
    } catch (err) {
      // The backend took the change but the website-only details couldn't be saved.
      if (err.partial) {
        setEvents(err.data);
        load();
      }
      throw err;
    }
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setFormError("");
    setFieldErrors([]);
    if (form.title.trim().length < 2) return setFormError("Give the event a title.");
    if (form.description.trim().length < 2) return setFormError("Add a short description (shown on the event card).");
    if (!form.date) return setFormError("Pick the date and time the event starts.");
    if (form.endDate && new Date(form.endDate) < new Date(form.date)) return setFormError("The end can't be before the start.");
    if (form.is_team_event && form.teamMin && form.teamMax && Number(form.teamMin) > Number(form.teamMax)) return setFormError("Smallest team size can't be more than the largest.");
    const record = toEvent({ ...form, slug: uniqueSlug(slugify(form.slug) || "event", events, form._id) }, editing);
    const next = editing ? events.map((e) => (e._id === editing._id ? record : e)) : [record, ...events];
    setSaving(true);
    try {
      await commit(next, editing ? `“${record.title}” saved.` : `“${record.title}” added${record.status === "draft" ? " as a draft" : ""}.`);
      setDrawerOpen(false);
    } catch (err) {
      setFormError(err.message);
      setFieldErrors(err.details || []);
      if (err.code === "CONTENT_CONFLICT") load();
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (e) => {
    const status = e.status === "draft" ? "published" : "draft";
    try {
      await commit(events.map((x) => (x._id === e._id ? { ...x, status } : x)), status === "published" ? `“${e.title}” published.` : `“${e.title}” moved to drafts.`);
    } catch (err) {
      setListError(err.message);
      if (err.code === "CONTENT_CONFLICT") load();
    }
  };

  const remove = async (e) => {
    if (!window.confirm(LIVE && e.status !== "draft" ? `Delete “${e.title}”? It's removed from the website and the chapter's database. This can't be undone.` : `Delete “${e.title}”? It disappears from the website. (It stays in the repository's history.)`)) return;
    try {
      await commit(events.filter((x) => x._id !== e._id), `“${e.title}” deleted.`);
    } catch (err) {
      setListError(err.message);
      if (err.code === "CONTENT_CONFLICT") load();
    }
  };

  const [now] = useState(() => Date.now());
  const sorted = useMemo(() => [...events].sort((a, b) => new Date(b.date) - new Date(a.date)), [events]);
  const counts = useMemo(
    () => ({
      published: events.filter((e) => e.status !== "draft").length,
      draft: events.filter((e) => e.status === "draft").length,
      upcoming: events.filter((e) => e.status !== "draft" && new Date(e.date).getTime() >= now - 86400000).length,
    }),
    [events, now]
  );
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sorted.filter((e) => {
      if (filter === "draft" && e.status !== "draft") return false;
      if (filter === "published" && e.status === "draft") return false;
      if (filter === "upcoming" && (e.status === "draft" || new Date(e.date).getTime() < now - 86400000)) return false;
      return !term || `${e.title} ${e.location || ""} ${e.type || ""}`.toLowerCase().includes(term);
    });
  }, [sorted, filter, search, now]);

  return (
    <>
      <PageHead title="Events" sub="Everything on the website's calendar and archive. Drafts stay hidden until you publish them.">
        <button className="b p" onClick={openCreate} type="button">
          <IconPlus /> New event
        </button>
      </PageHead>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div className="seg" role="group" aria-label="Filter events">
          {[["", "All", events.length], ["upcoming", "Upcoming", counts.upcoming], ["published", "Published", counts.published], ["draft", "Drafts", counts.draft]].map(([k, label, c]) => (
            <button key={label} type="button" className={filter === k ? "on" : ""} aria-pressed={filter === k} onClick={() => setFilter(k)}>
              {label} <span className="c">{c || 0}</span>
            </button>
          ))}
        </div>
        <label className="srch">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m20 20-4.2-4.2" />
          </svg>
          <input type="search" placeholder="Search events" aria-label="Search events" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
      </div>

      {notice && (
        <div className="admin-alert success" style={{ marginBottom: 16 }} role="status">
          {notice}
        </div>
      )}
      {listError && (
        <div className="admin-alert error" style={{ marginBottom: 16 }} role="alert">
          {listError}
        </div>
      )}

      <section className="pn">
        {loading ? (
          <div className="admin-loading">
            <span className="admin-spinner light" />
            Loading events…
          </div>
        ) : (
          <div className="tw">
            <div className="dt" role="table" aria-label="Events" style={{ "--cols": "minmax(220px,1.6fr) 110px minmax(120px,1fr) 100px minmax(330px,auto)" }}>
              <div className="dh" role="row">
                <span role="columnheader">Event</span>
                <span role="columnheader">Date</span>
                <span role="columnheader">Venue</span>
                <span role="columnheader">Status</span>
                <span role="columnheader">
                  <span className="sr">Actions</span>
                </span>
              </div>
              {filtered.length === 0 ? (
                <div className="dr" role="row" style={{ display: "block", padding: "28px 20px" }}>
                  <div role="cell" className="empty">
                    <p>{events.length === 0 ? "No events yet." : filter === "upcoming" ? "Nothing upcoming, so the website shows “Coming soon”." : "No events match."}</p>
                    <button className="b p sm" type="button" onClick={openCreate}>
                      <IconPlus /> New event
                    </button>
                  </div>
                </div>
              ) : (
                filtered.slice(0, limit).map((e) => (
                  <div className="dr" role="row" key={e._id}>
                    <div role="cell" className="idc">
                      {e.image ? <img src={previewSrc(cdn(e.image, 120))} alt="" width="36" height="36" loading="lazy" decoding="async" /> : <span className="ph" aria-hidden="true" />}
                      <div style={{ minWidth: 0 }}>
                        <b>{e.title}</b>
                        <span>{[e.type, e.is_team_event && "Team", e.acmExclusive && "ACM only", e.is_featured && "Featured"].filter(Boolean).join(" · ") || "-"}</span>
                      </div>
                    </div>
                    <span role="cell" className="num" style={{ textAlign: "left" }}>
                      {shortDate(e.date)}
                    </span>
                    <span role="cell" style={{ color: "var(--muted)" }}>
                      {e.location || "-"}
                    </span>
                    <span role="cell">{e.status === "draft" ? <span className="pl off">Draft</span> : new Date(e.date).getTime() >= now - 86400000 ? <span className="pl live">Upcoming</span> : <span className="pl ok">Published</span>}</span>
                    <div role="cell" className="rowacts">
                      <button className="b sm q" type="button" onClick={() => openEdit(e)} aria-label={`Edit ${e.title}`}>
                        <IconEdit /> Edit
                      </button>
                      <button className="b sm q" type="button" onClick={() => togglePublish(e)}>
                        {e.status === "draft" ? "Publish" : "Unpublish"}
                      </button>
                      {e.status !== "draft" && <CopyLink slug={e.slug} title={e.title} />}
                      <button className="b sm q danger" type="button" onClick={() => remove(e)} aria-label={`Delete ${e.title}`}>
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {filtered.length > limit && (
              <div className="acts">
                <button type="button" className="b sm" onClick={() => setLimit((l) => l + 25)}>
                  Show more
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {drawerOpen && (
        <div className="admin-drawer">
          <div className="admin-drawer-scrim" onClick={() => setDrawerOpen(false)} />
          <div className="admin-drawer-panel" role="dialog" aria-modal="true" aria-label="Event form">
            <div className="admin-drawer-head">
              <h3>{editing ? "Edit event" : "New event"}</h3>
              <button className="admin-close" type="button" onClick={() => setDrawerOpen(false)} aria-label="Close">
                <IconClose />
              </button>
            </div>

            <div className="admin-drawer-body">
              {formError && (
                <div className="admin-alert error" style={{ marginBottom: 16 }} role="alert">
                  {formError}
                  {fieldErrors.length > 0 && (
                    <ul style={{ marginTop: 6 }}>
                      {fieldErrors.slice(0, 6).map((f, i) => (
                        <li key={i}>{f.message}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <form onSubmit={submit} noValidate>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label htmlFor="ev-title">Event title *</label>
                    <input id="ev-title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. ACM ROCS 2026" maxLength={200} />
                  </div>
                  <div className="admin-form-grid two">
                    <div className="admin-field">
                      <label htmlFor="ev-type">Event type</label>
                      <select id="ev-type" value={form.type} onChange={(e) => set("type", e.target.value)}>
                        <option value="">None</option>
                        {[...new Set([...TYPES, form.type].filter(Boolean))].map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-field">
                      <label htmlFor="ev-status">Visibility</label>
                      <select id="ev-status" value={form.status} onChange={(e) => set("status", e.target.value)}>
                        <option value="published">Published</option>
                        <option value="draft">Draft (hidden)</option>
                      </select>
                    </div>
                  </div>
                  <div className="admin-field">
                    <label htmlFor="ev-short">Short description *</label>
                    <textarea id="ev-short" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Shown on the event card and in the archive" maxLength={4000} style={{ minHeight: 80 }} />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="ev-full">Full description</label>
                    <textarea id="ev-full" value={form.fullDescription} onChange={(e) => set("fullDescription", e.target.value)} placeholder="Shown in the event window; leave empty to reuse the short description" maxLength={20000} />
                  </div>
                </div>

                <div className="admin-form-section">
                  <h4>When and where</h4>
                  <div className="admin-form-grid two">
                    <div className="admin-field">
                      <label htmlFor="ev-start">Starts *</label>
                      <input id="ev-start" type="datetime-local" value={form.date} onChange={(e) => set("date", e.target.value)} />
                    </div>
                    <div className="admin-field">
                      <label htmlFor="ev-end">Ends</label>
                      <input id="ev-end" type="datetime-local" min={form.date || undefined} value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
                    </div>
                  </div>
                  <div className="admin-field" style={{ marginTop: 14 }}>
                    <label htmlFor="ev-loc">Venue</label>
                    <input id="ev-loc" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Seminar Hall, PJA Block" maxLength={200} />
                  </div>
                  <div className="admin-field" style={{ marginTop: 14 }}>
                    <label htmlFor="ev-slug">Link</label>
                    <input
                      id="ev-slug"
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"), slugEdited: true }))}
                      maxLength={80}
                      aria-describedby="ev-slug-h"
                    />
                    <span className="hint" id="ev-slug-h">
                      Shareable address: {window.location.origin}/events/{form.slug || "…"}
                      {editing && editing.slug !== form.slug ? " · Changing it breaks links people already shared." : ""}
                    </span>
                  </div>
                </div>

                <div className="admin-form-section">
                  <h4>Poster and photos</h4>
                  <ImageField id="ev-image" label="Poster" value={form.image} onChange={(v) => set("image", v)} hint="Shown on the calendar, the archive card and the event window." />
                  <div className="admin-field" style={{ marginTop: 14 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>Gallery</span>
                    {form.gallery.map((g, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <ImageField id={`ev-gal-${i}`} label={`Photo ${i + 1}`} value={g} onChange={(v) => set("gallery", form.gallery.map((x, j) => (j === i ? v : x)))} size={48} square />
                        </div>
                        <button type="button" className="b sm q danger" onClick={() => set("gallery", form.gallery.filter((_, j) => j !== i))} aria-label={`Remove photo ${i + 1}`}>
                          <IconTrash />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="b sm" style={{ justifySelf: "start", marginTop: 8 }} disabled={form.gallery.length >= 40} onClick={() => set("gallery", [...form.gallery, ""])}>
                      <IconPlus /> Add photo
                    </button>
                  </div>
                </div>

                <div className="admin-form-section">
                  <h4>After the event</h4>
                  <div className="admin-form-grid two">
                    <div className="admin-field">
                      <label htmlFor="ev-att">People attended</label>
                      <input id="ev-att" type="number" min="0" value={form.attendees} onChange={(e) => set("attendees", e.target.value)} placeholder="e.g. 52" />
                    </div>
                    <label className="admin-check" style={{ alignSelf: "end", paddingBottom: 10 }}>
                      <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} /> Featured (Home “Hall of fame”)
                    </label>
                  </div>
                  <div className="admin-field" style={{ marginTop: 14 }}>
                    <label htmlFor="ev-out">Highlights</label>
                    <textarea id="ev-out" value={form.outcomes} onChange={(e) => set("outcomes", e.target.value)} placeholder="One per line" style={{ minHeight: 80 }} />
                  </div>
                </div>

                <div className="admin-form-section">
                  <h4>Shown as information</h4>
                  <p className="hint" style={{ marginBottom: 12 }}>
                    Sign-ups don't happen on this website; these just appear on the event.
                  </p>
                  <div className="admin-form-grid three">
                    <div className="admin-field">
                      <label htmlFor="ev-mp">Member price (₹)</label>
                      <input id="ev-mp" type="number" min="0" value={form.memberPrice} onChange={(e) => set("memberPrice", e.target.value)} placeholder="Free" />
                    </div>
                    <div className="admin-field">
                      <label htmlFor="ev-np">Non-member price (₹)</label>
                      <input id="ev-np" type="number" min="0" value={form.nonMemberPrice} onChange={(e) => set("nonMemberPrice", e.target.value)} placeholder="Free" disabled={form.acmExclusive} />
                    </div>
                    <div className="admin-field">
                      <label htmlFor="ev-cap">{form.is_team_event ? "Teams" : "Seats"}</label>
                      <input id="ev-cap" type="number" min="1" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} placeholder="Not shown" />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 14 }}>
                    <label className="admin-check">
                      <input type="checkbox" checked={form.acmExclusive} onChange={(e) => set("acmExclusive", e.target.checked)} /> ACM members only
                    </label>
                    <label className="admin-check">
                      <input type="checkbox" checked={form.is_team_event} onChange={(e) => set("is_team_event", e.target.checked)} /> Team event
                    </label>
                  </div>
                  {form.is_team_event && (
                    <div className="admin-form-grid two" style={{ marginTop: 14 }}>
                      <div className="admin-field">
                        <label htmlFor="ev-tmin">Smallest team</label>
                        <input id="ev-tmin" type="number" min="1" value={form.teamMin} onChange={(e) => set("teamMin", e.target.value)} placeholder="e.g. 2" />
                      </div>
                      <div className="admin-field">
                        <label htmlFor="ev-tmax">Largest team</label>
                        <input id="ev-tmax" type="number" min="1" value={form.teamMax} onChange={(e) => set("teamMax", e.target.value)} placeholder="e.g. 4" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="admin-form-actions">
                  <button className="admin-btn ghost" type="button" onClick={() => setDrawerOpen(false)}>
                    Cancel
                  </button>
                  <button className="admin-btn" type="submit" disabled={saving}>
                    {saving && <span className="spin" aria-hidden="true" />}
                    {editing ? "Save event" : form.status === "draft" ? "Save draft" : "Publish event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Copies the event's public, shareable address (/events/<slug>). */
function CopyLink({ slug, title }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/events/${encodeURIComponent(slug)}`;
  return (
    <button
      className="b sm q"
      type="button"
      title={url}
      aria-label={`Copy the public link to ${title}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          window.prompt("Copy this link", url);
        }
      }}
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
