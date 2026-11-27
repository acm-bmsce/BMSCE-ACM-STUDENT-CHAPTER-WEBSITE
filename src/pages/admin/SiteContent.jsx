import { useEffect, useState } from "react";
import { loadContent, previewSrc, publishNote, saveContent } from "../../lib/adminApi";
import { Icon, ImageField, PageHead, useToast } from "./ui";

// Everything here is content/site.json; "Publish changes" saves the whole file.
const SECTIONS = [
  { key: "team", label: "Team", sub: "Faculty, core team, student advisors and the team photo on the Team page", page: "/team" },
  { key: "previousCore", label: "Previous cores", sub: "Past core teams on the Team page, newest first", page: "/team" },
  { key: "stats", label: "Stats", sub: "The numbers in “Our community in a nutshell” on the home page", page: "/" },
  { key: "highlights", label: "Highlights", sub: "The event sections on the home page, newest first. With no photos, placeholder tiles show", page: "/" },
  { key: "recognition", label: "Recognition", sub: "Awards on the home page; the first one is the headline", page: "/" },
  { key: "links", label: "Contact & links", sub: "Contact email, the Join page's membership forms, and the social links in the footer", page: "/join" },
  { key: "journey", label: "Journey", sub: "The timeline on the About page, oldest first", page: "/about" },
];

const blank = {
  person: { name: "", role: "", detail: "", img: "", linkedin: "" },
  stat: { value: 0, suffix: "", label: "" },
  award: { year: String(new Date().getFullYear()), title: "", text: "" },
  social: { label: "", href: "https://" },
  milestone: { year: String(new Date().getFullYear()), title: "", text: "" },
  highlight: { year: String(new Date().getFullYear()), title: "", when: "", text: "", stats: [], photos: [], link: "" },
  core: { year: String(new Date().getFullYear()), img: "", members: [["", ""]] },
};

function move(list, i, d) {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function RowTools({ i, len, onMove, onRemove, label }) {
  return (
    <div className="rm">
      <button type="button" className="b sm q" onClick={() => onMove(i, -1)} disabled={i === 0} aria-label={`Move ${label} up`}>
        ↑
      </button>
      <button type="button" className="b sm q" onClick={() => onMove(i, 1)} disabled={i === len - 1} aria-label={`Move ${label} down`}>
        ↓
      </button>
      <button type="button" className="b sm neg" onClick={() => onRemove(i)} aria-label={`Remove ${label}`}>
        <Icon name="x" />
      </button>
    </div>
  );
}

function People({ title, list, onChange, withDetail }) {
  // One compact row per person, as on the Team page; Edit opens that person's fields in place.
  const [open, setOpen] = useState(null);
  const set = (i, k, v) => onChange(list.map((p, j) => (j === i ? { ...p, [k]: v } : p)));
  const slug = title.toLowerCase().replace(/[^a-z]+/g, "-");
  const moveRow = (i, d) => {
    onChange(move(list, i, d));
    if (open === i) setOpen(i + d);
  };
  return (
    <section className="pn" style={{ marginBottom: 16 }}>
      <div className="pn-h">
        <h2>
          {title} <span style={{ color: "var(--faint)", fontWeight: 500 }}>{list.length}</span>
        </h2>
        <button
          type="button"
          className="b sm"
          onClick={() => {
            onChange([...list, { ...blank.person }]);
            setOpen(list.length);
          }}
        >
          <Icon name="plus" />
          Add person
        </button>
      </div>
      <ul className="tm-list">
        {list.map((p, i) => (
          <li key={i} className={open === i ? "on" : ""}>
            <div className="tm-row">
              {p.img ? <img src={previewSrc(p.img)} alt="" /> : <span className="tm-ph" aria-hidden="true" />}
              <b>{p.name || <span style={{ color: "var(--faint)" }}>New person</span>}</b>
              <span className="tm-role">{p.role}</span>
              <div className="rowacts">
                <button type="button" className="b sm q" onClick={() => moveRow(i, -1)} disabled={i === 0} aria-label={`Move ${p.name || "person"} up`}>
                  ↑
                </button>
                <button type="button" className="b sm q" onClick={() => moveRow(i, 1)} disabled={i === list.length - 1} aria-label={`Move ${p.name || "person"} down`}>
                  ↓
                </button>
                <button type="button" className="b sm q" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                  {open === i ? "Done" : "Edit"}
                </button>
                <button
                  type="button"
                  className="b sm q danger"
                  onClick={() => {
                    onChange(list.filter((_, j) => j !== i));
                    setOpen(null);
                  }}
                  aria-label={`Remove ${p.name || "person"}`}
                >
                  Remove
                </button>
              </div>
            </div>
            {open === i && (
              <div className="tm-ed">
                <div className="fld">
                  <label htmlFor={`${slug}-n-${i}`}>Name</label>
                  <input id={`${slug}-n-${i}`} value={p.name} onChange={(e) => set(i, "name", e.target.value)} maxLength={80} autoFocus={!p.name} />
                </div>
                <div className="fld">
                  <label htmlFor={`${slug}-r-${i}`}>Role</label>
                  <input id={`${slug}-r-${i}`} value={p.role} onChange={(e) => set(i, "role", e.target.value)} maxLength={80} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <ImageField id={`${slug}-i-${i}`} label="Photo" value={p.img || ""} onChange={(v) => set(i, "img", v)} size={56} />
                </div>
                <div className="fld">
                  <label htmlFor={`${slug}-l-${i}`}>LinkedIn</label>
                  <input id={`${slug}-l-${i}`} value={p.linkedin || ""} onChange={(e) => set(i, "linkedin", e.target.value)} placeholder="https://www.linkedin.com/in/…" maxLength={300} />
                </div>
                {withDetail && (
                  <div className="fld">
                    <label htmlFor={`${slug}-e-${i}`}>Email</label>
                    <input id={`${slug}-e-${i}`} type="email" value={p.email || ""} onChange={(e) => set(i, "email", e.target.value)} placeholder="name@bmsce.ac.in" maxLength={120} />
                  </div>
                )}
                {withDetail && (
                  <div className="fld" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor={`${slug}-d-${i}`}>Detail</label>
                    <input id={`${slug}-d-${i}`} value={p.detail || ""} onChange={(e) => set(i, "detail", e.target.value)} placeholder="e.g. Associate Professor & HOD, Dept. of …" maxLength={200} />
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
        {!list.length && <li className="tm-empty">Nobody here yet.</li>}
      </ul>
    </section>
  );
}

// Drop empty optional fields so the saved file stays tidy.
const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined && v !== null));

const Field = ({ id, label, children }) => (
  <div className="fld">
    <label htmlFor={id}>{label}</label>
    {children}
  </div>
);

export default function SiteContent() {
  const [section, setSection] = useState("team");
  const [draft, setDraft] = useState(null);
  const [sha, setSha] = useState("");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState([]);
  const [toast, say] = useToast();

  const load = () =>
    loadContent("site")
      .then((res) => {
        setDraft(res.data);
        setSha(res.sha);
        setDirty(false);
      })
      .catch((err) => say(err.message));

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Warn before leaving with unpublished edits.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const meta = SECTIONS.find((s) => s.key === section);
  const update = (patch) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
  };

  const payload = () => ({
    ...draft,
    team: { faculty: draft.team.faculty.map(clean), core: draft.team.core.map(clean), advisors: draft.team.advisors.map(clean) },
    stats: draft.stats.map((s) => clean({ ...s, value: Number(s.value), decimals: s.decimals ? Number(s.decimals) : undefined })),
    socials: draft.socials.filter((x) => x.label || x.href !== "https://"),
    teamPhoto: clean(draft.teamPhoto),
    highlights: (draft.highlights || []).map((h) => ({ ...h, stats: h.stats.filter((x) => x.value.trim() && x.label.trim()), photos: h.photos.filter((x) => x.src).map(clean) })),
    previousCore: draft.previousCore.map((c) => clean({ ...c, members: c.members.filter(([name]) => name.trim()) })),
  });

  const save = async () => {
    setBusy(true);
    setErrors([]);
    try {
      const res = await saveContent("site", payload(), sha);
      setDraft(res.data);
      setSha(res.sha);
      setDirty(false);
      say(`Saved. ${publishNote()}`);
    } catch (err) {
      setErrors(err.details?.length ? err.details : [{ field: "", message: err.message }]);
      if (err.code === "CONTENT_CONFLICT") load();
    } finally {
      setBusy(false);
    }
  };

  if (!draft) {
    return (
      <>
        <PageHead title="Pages & team" sub="Loading…" />
        {toast}
      </>
    );
  }

  const setList = (key, v) => update({ [key]: v });
  const edit = (key, i, patch) => setList(key, draft[key].map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <>
      <PageHead title="Pages & team" sub="The parts of the website that change every year. Publishing saves every section at once.">
        <a className="b" href={meta.page} target="_blank" rel="noopener noreferrer">
          <Icon name="ext" />
          View page
        </a>
      </PageHead>

      <div className="grid c-sub">
        <nav className="subnav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <button key={s.key} type="button" className={section === s.key ? "on" : ""} aria-current={section === s.key ? "true" : undefined} onClick={() => setSection(s.key)}>
              {s.label}
            </button>
          ))}
        </nav>

        <div style={{ minWidth: 0 }}>
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>{meta.sub}.</p>

          {errors.length > 0 && (
            <div className="note bad" role="alert" style={{ marginBottom: 16 }}>
              <b>Couldn’t publish.</b>
              <ul style={{ marginTop: 6 }}>
                {errors.slice(0, 8).map((e, i) => (
                  <li key={i}>
                    {e.field ? `${e.field}: ` : ""}
                    {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section === "team" && (
            <>
              <section className="pn" style={{ marginBottom: 16 }}>
                <div className="pn-h">
                  <h2>Team photo</h2>
                </div>
                <div className="pn-b" style={{ display: "grid", gap: 12 }}>
                  <ImageField id="tp-img" label="Photo at the top of the Team page" value={draft.teamPhoto.img} onChange={(v) => update({ teamPhoto: { ...draft.teamPhoto, img: v } })} size={120} />
                  <Field id="tp-alt" label="Description for screen readers">
                    <input id="tp-alt" value={draft.teamPhoto.alt || ""} onChange={(e) => update({ teamPhoto: { ...draft.teamPhoto, alt: e.target.value } })} placeholder="e.g. The BMSCE ACM core team 2026–27" maxLength={200} />
                  </Field>
                </div>
              </section>
              <People title="Faculty" list={draft.team.faculty} withDetail onChange={(v) => update({ team: { ...draft.team, faculty: v } })} />
              <People title="Core team" list={draft.team.core} onChange={(v) => update({ team: { ...draft.team, core: v } })} />
              <People title="Student advisors" list={draft.team.advisors} onChange={(v) => update({ team: { ...draft.team, advisors: v } })} />
            </>
          )}

          {section === "previousCore" && (
            <>
              {draft.previousCore.map((c, i) => (
                <section className="pn" key={i} style={{ marginBottom: 16 }}>
                  <div className="pn-h">
                    <h2>{c.year || "New year"}</h2>
                    <RowTools i={i} len={draft.previousCore.length} label={`${c.year} core`} onMove={(a, d) => setList("previousCore", move(draft.previousCore, a, d))} onRemove={(a) => setList("previousCore", draft.previousCore.filter((_, j) => j !== a))} />
                  </div>
                  <div className="pn-b" style={{ display: "grid", gap: 12 }}>
                    <Field id={`pc-y-${i}`} label="Year">
                      <input id={`pc-y-${i}`} value={c.year} onChange={(e) => edit("previousCore", i, { year: e.target.value })} maxLength={12} style={{ maxWidth: 160 }} />
                    </Field>
                    <ImageField id={`pc-i-${i}`} label="Group photo" value={c.img} onChange={(v) => edit("previousCore", i, { img: v, w: undefined, h: undefined })} size={96} />
                    <div className="ed-list">
                      {c.members.map(([name, role], k) => (
                        <div className="ed-row" key={k} style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) auto" }}>
                          <Field id={`pc-${i}-n-${k}`} label="Name">
                            <input id={`pc-${i}-n-${k}`} value={name} onChange={(e) => edit("previousCore", i, { members: c.members.map((m, j) => (j === k ? [e.target.value, m[1]] : m)) })} maxLength={80} />
                          </Field>
                          <Field id={`pc-${i}-r-${k}`} label="Role">
                            <input id={`pc-${i}-r-${k}`} value={role} onChange={(e) => edit("previousCore", i, { members: c.members.map((m, j) => (j === k ? [m[0], e.target.value] : m)) })} maxLength={80} />
                          </Field>
                          <RowTools i={k} len={c.members.length} label={name || "member"} onMove={(a, d) => edit("previousCore", i, { members: move(c.members, a, d) })} onRemove={(a) => edit("previousCore", i, { members: c.members.filter((_, j) => j !== a) })} />
                        </div>
                      ))}
                      <button type="button" className="b sm" style={{ justifySelf: "start" }} onClick={() => edit("previousCore", i, { members: [...c.members, ["", ""]] })}>
                        <Icon name="plus" />
                        Add member
                      </button>
                    </div>
                  </div>
                </section>
              ))}
              <button type="button" className="b sm" onClick={() => setList("previousCore", [{ ...blank.core, members: [["", ""]] }, ...draft.previousCore])}>
                <Icon name="plus" />
                Add a year
              </button>
            </>
          )}

          {section === "stats" && (
            <div className="ed-list">
              {draft.stats.map((s, i) => (
                <div className="ed-row" key={i} style={{ gridTemplateColumns: "120px 90px minmax(0,1fr) auto" }}>
                  <Field id={`st-v-${i}`} label="Number">
                    <input id={`st-v-${i}`} type="number" min="0" step="any" inputMode="decimal" value={s.value} onChange={(e) => edit("stats", i, { value: e.target.value === "" ? "" : Number(e.target.value), decimals: String(e.target.value).includes(".") ? 1 : undefined })} />
                  </Field>
                  <Field id={`st-s-${i}`} label="Suffix">
                    <input id={`st-s-${i}`} value={s.suffix || ""} onChange={(e) => edit("stats", i, { suffix: e.target.value })} placeholder="+" maxLength={8} />
                  </Field>
                  <Field id={`st-l-${i}`} label="Label">
                    <input id={`st-l-${i}`} value={s.label} onChange={(e) => edit("stats", i, { label: e.target.value })} maxLength={60} />
                  </Field>
                  <RowTools i={i} len={draft.stats.length} label={s.label || "stat"} onMove={(a, d) => setList("stats", move(draft.stats, a, d))} onRemove={(a) => setList("stats", draft.stats.filter((_, j) => j !== a))} />
                </div>
              ))}
              <button type="button" className="b sm" style={{ justifySelf: "start" }} disabled={draft.stats.length >= 12} onClick={() => setList("stats", [...draft.stats, { ...blank.stat }])}>
                <Icon name="plus" />
                Add stat
              </button>
            </div>
          )}

          {section === "highlights" && (
            <>
              {(draft.highlights || []).map((h, i) => {
                const list = draft.highlights;
                const put = (patch) => setList("highlights", list.map((x, j) => (j === i ? { ...x, ...patch } : x)));
                return (
                  <section className="pn" key={i} style={{ marginBottom: 16 }}>
                    <div className="pn-h">
                      <h2>{h.title || "New highlight"}</h2>
                      <RowTools i={i} len={list.length} label={h.title || "highlight"} onMove={(a, d) => setList("highlights", move(list, a, d))} onRemove={(a) => setList("highlights", list.filter((_, j) => j !== a))} />
                    </div>
                    <div className="pn-b" style={{ display: "grid", gap: 12 }}>
                      <div className="ed-row" style={{ gridTemplateColumns: "110px minmax(0,1fr)" }}>
                        <Field id={`hl-y-${i}`} label="Year">
                          <input id={`hl-y-${i}`} value={h.year} onChange={(e) => put({ year: e.target.value })} maxLength={12} />
                        </Field>
                        <Field id={`hl-t-${i}`} label="Title">
                          <input id={`hl-t-${i}`} value={h.title} onChange={(e) => put({ title: e.target.value })} maxLength={120} />
                        </Field>
                      </div>
                      <Field id={`hl-w-${i}`} label="When and where">
                        <input id={`hl-w-${i}`} value={h.when || ""} onChange={(e) => put({ when: e.target.value })} placeholder="e.g. 26 & 27 September 2025 · BMSCE" maxLength={160} />
                      </Field>
                      <Field id={`hl-x-${i}`} label="Short description">
                        <textarea id={`hl-x-${i}`} value={h.text || ""} onChange={(e) => put({ text: e.target.value })} maxLength={400} style={{ minHeight: 64 }} />
                      </Field>
                      <Field id={`hl-l-${i}`} label="Link (optional)">
                        <input id={`hl-l-${i}`} value={h.link || ""} onChange={(e) => put({ link: e.target.value })} placeholder="/events/… or https://…" maxLength={300} />
                      </Field>
                      <div className="ed-list">
                        {h.stats.map((x, k) => (
                          <div className="ed-row" key={k} style={{ gridTemplateColumns: "120px minmax(0,1fr) auto" }}>
                            <Field id={`hl-${i}-sv-${k}`} label="Number">
                              <input id={`hl-${i}-sv-${k}`} value={x.value} onChange={(e) => put({ stats: h.stats.map((y, j) => (j === k ? { ...y, value: e.target.value } : y)) })} placeholder="180+" maxLength={12} />
                            </Field>
                            <Field id={`hl-${i}-sl-${k}`} label="Label">
                              <input id={`hl-${i}-sl-${k}`} value={x.label} onChange={(e) => put({ stats: h.stats.map((y, j) => (j === k ? { ...y, label: e.target.value } : y)) })} placeholder="Attendees" maxLength={40} />
                            </Field>
                            <RowTools i={k} len={h.stats.length} label={x.label || "number"} onMove={(a, d) => put({ stats: move(h.stats, a, d) })} onRemove={(a) => put({ stats: h.stats.filter((_, j) => j !== a) })} />
                          </div>
                        ))}
                        <button type="button" className="b sm" style={{ justifySelf: "start" }} disabled={h.stats.length >= 4} onClick={() => put({ stats: [...h.stats, { value: "", label: "" }] })}>
                          <Icon name="plus" />
                          Add number
                        </button>
                      </div>
                      <div className="ed-list">
                        {h.photos.map((x, k) => (
                          <div className="ed-row" key={k} style={{ gridTemplateColumns: "minmax(0,1fr) auto" }}>
                            <div style={{ display: "grid", gap: 8 }}>
                              <ImageField id={`hl-${i}-p-${k}`} label={k === 0 ? "Main photo" : `Photo ${k + 1}`} value={x.src} onChange={(v) => put({ photos: h.photos.map((y, j) => (j === k ? { ...y, src: v } : y)) })} size={72} />
                              <Field id={`hl-${i}-pa-${k}`} label="Description for screen readers">
                                <input id={`hl-${i}-pa-${k}`} value={x.alt || ""} onChange={(e) => put({ photos: h.photos.map((y, j) => (j === k ? { ...y, alt: e.target.value } : y)) })} maxLength={200} />
                              </Field>
                            </div>
                            <RowTools i={k} len={h.photos.length} label={`photo ${k + 1}`} onMove={(a, d) => put({ photos: move(h.photos, a, d) })} onRemove={(a) => put({ photos: h.photos.filter((_, j) => j !== a) })} />
                          </div>
                        ))}
                        <button type="button" className="b sm" style={{ justifySelf: "start" }} disabled={h.photos.length >= 3} onClick={() => put({ photos: [...h.photos, { src: "", alt: "" }] })}>
                          <Icon name="plus" />
                          Add photo
                        </button>
                      </div>
                    </div>
                  </section>
                );
              })}
              <button type="button" className="b sm" onClick={() => setList("highlights", [{ ...blank.highlight }, ...(draft.highlights || [])])}>
                <Icon name="plus" />
                Add a highlight
              </button>
            </>
          )}

          {section === "recognition" && (
            <div className="ed-list">
              {draft.recognition.map((a, i) => (
                <div className="ed-row" key={i} style={{ gridTemplateColumns: "110px minmax(0,1fr) minmax(0,1.6fr) auto" }}>
                  <Field id={`rc-y-${i}`} label="Year">
                    <input id={`rc-y-${i}`} value={a.year} onChange={(e) => edit("recognition", i, { year: e.target.value })} maxLength={12} />
                  </Field>
                  <Field id={`rc-t-${i}`} label="Title">
                    <input id={`rc-t-${i}`} value={a.title} onChange={(e) => edit("recognition", i, { title: e.target.value })} maxLength={100} />
                  </Field>
                  <Field id={`rc-x-${i}`} label="Description">
                    <textarea id={`rc-x-${i}`} value={a.text} onChange={(e) => edit("recognition", i, { text: e.target.value })} maxLength={500} style={{ minHeight: 64 }} />
                  </Field>
                  <RowTools i={i} len={draft.recognition.length} label={a.title || "award"} onMove={(x, d) => setList("recognition", move(draft.recognition, x, d))} onRemove={(x) => setList("recognition", draft.recognition.filter((_, j) => j !== x))} />
                </div>
              ))}
              <button type="button" className="b sm" style={{ justifySelf: "start" }} onClick={() => setList("recognition", [...draft.recognition, { ...blank.award }])}>
                <Icon name="plus" />
                Add award
              </button>
            </div>
          )}

          {section === "links" && (
            <>
              <section className="pn" style={{ marginBottom: 16 }}>
                <div className="pn-h">
                  <h2>Contact and membership</h2>
                </div>
                <div className="pn-b" style={{ display: "grid", gap: 12 }}>
                  <Field id="ln-email" label="Contact email">
                    <input id="ln-email" type="email" value={draft.chapter.email} onChange={(e) => update({ chapter: { ...draft.chapter, email: e.target.value } })} maxLength={120} />
                  </Field>
                  <Field id="ln-chapter" label="Chapter membership form (Join page)">
                    <input id="ln-chapter" value={draft.chapter.forms.chapter} onChange={(e) => update({ chapter: { ...draft.chapter, forms: { ...draft.chapter.forms, chapter: e.target.value } } })} placeholder="https://" />
                  </Field>
                  <Field id="ln-global" label="ACM global membership form (Join page)">
                    <input id="ln-global" value={draft.chapter.forms.global} onChange={(e) => update({ chapter: { ...draft.chapter, forms: { ...draft.chapter.forms, global: e.target.value } } })} placeholder="https://" />
                  </Field>
                </div>
              </section>
              <div className="ed-list">
                {draft.socials.map((x, i) => (
                  <div className="ed-row" key={i} style={{ gridTemplateColumns: "160px minmax(0,1fr) auto" }}>
                    <Field id={`so-l-${i}`} label="Network">
                      <input id={`so-l-${i}`} value={x.label} onChange={(e) => edit("socials", i, { label: e.target.value })} placeholder="Instagram" maxLength={40} />
                    </Field>
                    <Field id={`so-h-${i}`} label="Link">
                      <input id={`so-h-${i}`} value={x.href} onChange={(e) => edit("socials", i, { href: e.target.value })} placeholder="https://" />
                    </Field>
                    <RowTools i={i} len={draft.socials.length} label={x.label || "link"} onMove={(a, d) => setList("socials", move(draft.socials, a, d))} onRemove={(a) => setList("socials", draft.socials.filter((_, j) => j !== a))} />
                  </div>
                ))}
                <button type="button" className="b sm" style={{ justifySelf: "start" }} onClick={() => setList("socials", [...draft.socials, { ...blank.social }])}>
                  <Icon name="plus" />
                  Add social link
                </button>
              </div>
            </>
          )}

          {section === "journey" && (
            <div className="ed-list">
              {draft.journey.map((m, i) => (
                <div className="ed-row" key={i} style={{ gridTemplateColumns: "110px minmax(0,1fr) minmax(0,1.6fr) auto" }}>
                  <Field id={`jy-y-${i}`} label="Year">
                    <input id={`jy-y-${i}`} value={m.year} onChange={(e) => edit("journey", i, { year: e.target.value })} maxLength={16} />
                  </Field>
                  <Field id={`jy-t-${i}`} label="Milestone">
                    <input id={`jy-t-${i}`} value={m.title} onChange={(e) => edit("journey", i, { title: e.target.value })} maxLength={160} />
                  </Field>
                  <Field id={`jy-x-${i}`} label="Description">
                    <textarea id={`jy-x-${i}`} value={m.text} onChange={(e) => edit("journey", i, { text: e.target.value })} maxLength={600} style={{ minHeight: 64 }} />
                  </Field>
                  <RowTools i={i} len={draft.journey.length} label={m.title || "milestone"} onMove={(a, d) => setList("journey", move(draft.journey, a, d))} onRemove={(a) => setList("journey", draft.journey.filter((_, j) => j !== a))} />
                </div>
              ))}
              <button type="button" className="b sm" style={{ justifySelf: "start" }} onClick={() => setList("journey", [...draft.journey, { ...blank.milestone }])}>
                <Icon name="plus" />
                Add milestone
              </button>
            </div>
          )}

          <div className="savebar">
            {dirty && <span className="hint" style={{ marginRight: "auto", alignSelf: "center" }}>Unpublished changes</span>}
            <button type="button" className="b p" onClick={save} disabled={busy || !dirty}>
              {busy && <span className="spin" aria-hidden="true" />}
              Publish changes
            </button>
          </div>
        </div>
      </div>
      {toast}
    </>
  );
}
