import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { eventPath } from "../lib/eventLinks";
import EventModal from "../components/EventModal";
import { SOCIALS } from "../data/site";
import { cdn, formatDate, useEvents } from "../lib/data";
import useTitle from "../lib/useTitle";
import { Count } from "../lib/motion";
import { eventMeta } from "../data/seo";
import Split from "../components/Split";
import { PageHero, PosterCard, SectionHead } from "../components/ui";

const PAGE = 12;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const startOfToday = () => new Date(new Date().toDateString());

function Calendar({ events, onOpen, idle }) {
  const byDay = useMemo(() => {
    const map = new Map();
    events.forEach((e) => {
      if (!e.date) return;
      const k = dayKey(e.date);
      map.set(k, [...(map.get(k) || []), e]);
    });
    return map;
  }, [events]);

  // Always opens on the current month; the arrows move from there. Nothing is selected until
  // someone picks a day, so the side panel shows what's next (or "Coming soon").
  const [view, setView] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [selected, setSelected] = useState(null);

  const first = new Date(view.y, view.m, 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const today = dayKey(new Date());

  const move = (delta) =>
    setView(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const label = first.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const monthEvents = events.filter((e) => e.date && e.date.getFullYear() === view.y && e.date.getMonth() === view.m);

  return (
    <div className="g2" style={{ gap: 48, alignItems: "start" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button type="button" className="btn o" aria-label="Previous month" style={{ minWidth: 48, padding: 0 }} onClick={() => move(-1)}>
            ←
          </button>
          <p className="d3" aria-live="polite">
            {label}
          </p>
          <button type="button" className="btn o" aria-label="Next month" style={{ minWidth: 48, padding: 0 }} onClick={() => move(1)}>
            →
          </button>
        </div>
        <div className="cells cal page-in" key={`${view.y}-${view.m}`} style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }} role="group" aria-label={`${label} calendar`}>
          {WEEKDAYS.map((d) => (
            <div key={d} className="lab mut" style={{ padding: 10 }}>
              {d}
            </div>
          ))}
          {cells.map((n, i) => {
            if (!n) return <div key={`b${i}`} style={{ padding: 10, minHeight: 64 }} />;
            const k = `${view.y}-${view.m}-${n}`;
            const list = byDay.get(k);
            if (!list) {
              return (
                <div key={k} className="sm" style={{ padding: 10, minHeight: "clamp(48px, 6.2vh, 64px)", color: k === today ? "var(--b)" : undefined, fontWeight: k === today ? 700 : undefined }}>
                  {n}
                </div>
              );
            }
            const isSel = selected && selected.date && dayKey(selected.date) === k;
            return (
              <button
                key={k}
                type="button"
                className="sm"
                onClick={() => setSelected(list[0])}
                aria-label={`${n} ${label}: ${list.map((e) => e.title).join(", ")}`}
                aria-pressed={Boolean(isSel)}
                style={{ padding: 10, minHeight: "clamp(48px, 6.2vh, 64px)", textAlign: "left", border: 0, background: isSel ? "#fff" : "var(--b)", color: "#000", fontWeight: 700, borderRight: "1px solid var(--ln-d)", borderBottom: "1px solid var(--ln-d)", display: "block", width: "100%", overflow: "hidden" }}
              >
                {n}
                <span className="hide-m" style={{ display: "block", fontSize: 11, fontWeight: 600, lineHeight: 1.25, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {list[0].title}
                </span>
              </button>
            );
          })}
        </div>
        <p className="sm mut" style={{ marginTop: 14 }}>
          {monthEvents.length ? `${monthEvents.length} event${monthEvents.length > 1 ? "s" : ""} this month.` : "No events this month."}
        </p>
      </div>
      {selected ? (
        <div style={{ background: "var(--raise)", padding: "clamp(18px, 3vh, 28px)" }} key={selected.id} className="page-in">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
            <p className="lab mut">{formatDate(selected.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            <button type="button" className="lnk sm" onClick={() => setSelected(null)}>
              ← Next up
            </button>
          </div>
          {selected.image && <img src={cdn(selected.image, 700)} alt={`${selected.title} poster`} className="ph4" style={{ height: "clamp(130px, 22vh, 260px)", marginTop: 14, objectFit: "contain", background: "#0a0a0a" }} loading="lazy" />}
          <h3 className="d3" style={{ marginTop: 18 }}>
            {selected.title}
          </h3>
          <p className="sm mut" style={{ marginTop: 8 }}>
            {[selected.location, selected.attendees && `${selected.attendees} ${selected.date >= startOfToday() ? "registered" : "attended"}`].filter(Boolean).join(" · ")}
          </p>
          <button type="button" className="btn" style={{ marginTop: 20 }} onClick={() => onOpen(selected)}>
            Event details <span className="ar">→</span>
          </button>
        </div>
      ) : (
        idle
      )}
    </div>
  );
}

export default function Events() {
  const events = useEvents();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const [year, setYear] = useState("all");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);

  // Each event lives at /events/<slug>, so its address can be shared. Old ?event=<id> links
  // still open it and are rewritten to the new address.
  const legacyId = params.get("event");
  const key = slug ? decodeURIComponent(slug) : legacyId;
  const open = useMemo(() => (key ? events.find((e) => e.slug === key || String(e.id) === key) || null : null), [events, key]);
  useEffect(() => {
    if (legacyId && open) {
      setParams((p) => { p.delete("event"); return p; }, { replace: true });
      navigate(eventPath(open), { replace: true, preventScrollReset: true });
    }
  }, [legacyId, open, navigate, setParams]);
  useTitle(open ? open.title : "Events", false, open ? eventMeta(open).description : undefined);
  const openEvent = useCallback((e) => navigate(eventPath(e), { preventScrollReset: true }), [navigate]);
  const close = useCallback(() => navigate("/events", { replace: true, preventScrollReset: true }), [navigate]);

  const today = startOfToday();
  const upcoming = useMemo(() => events.filter((e) => e.date && e.date >= today).sort((a, b) => a.date - b.date), [events]); // eslint-disable-line react-hooks/exhaustive-deps
  const past = useMemo(() => events.filter((e) => !e.date || e.date < today), [events]); // eslint-disable-line react-hooks/exhaustive-deps
  const years = useMemo(() => [...new Set(events.map((e) => e.year).filter(Boolean))].sort((a, b) => b - a), [events]);
  const attendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0);
  const earliest = years[years.length - 1];

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return past.filter(
      (e) =>
        (year === "all" || e.year === Number(year)) &&
        (!term || `${e.title} ${e.description} ${e.location}`.toLowerCase().includes(term))
    );
  }, [past, year, q]);

  useEffect(() => setShown(PAGE), [year, q]);
  const ig = SOCIALS.find((s) => s.label === "Instagram");
  const li = SOCIALS.find((s) => s.label === "LinkedIn");

  return (
    <>
      <PageHero
        title={
          <>
            On the <span className="blue">calendar</span>
          </>
        }
        lede={<>Hackathons, research talks, coding marathons, workshops and games: everything the chapter has run, in one place.</>}
        img="/img/events-collage.webp"
        imgAlt="Collage of BMSCE ACM events"
      >
        <dl className="facts rv" style={{ margin: "40px 0 0", "--i": 3 }}>
          <div>
            <dt className="lab mut">Events</dt>
            <dd style={{ margin: "6px 0 0" }}>
              <Count value={events.length} />
            </dd>
          </div>
          {earliest && (
            <div>
              <dt className="lab mut">Archive from</dt>
              <dd style={{ margin: "6px 0 0" }}>
                <b>{earliest}</b>
              </dd>
            </div>
          )}
          {attendees > 0 && (
            <div>
              <dt className="lab mut">Recorded attendees</dt>
              <dd style={{ margin: "6px 0 0" }}>
                <Count value={attendees} suffix="+" />
              </dd>
            </div>
          )}
        </dl>
      </PageHero>

      <section className="sec grey ev-cal">
        <div className="wrap">
          <div className="ev-cal-head">
            <div>
              <Split className="d2" style={{ fontSize: "clamp(30px, 4vw, 60px)" }}>Chapter calendar</Split>
              <p className="sm mut rv" style={{ marginTop: 14, maxWidth: "44ch" }}>
                Browse dates with scheduled events and open a day to see what’s happening.
              </p>
            </div>
          </div>
          <Calendar
            events={events}
            onOpen={openEvent}
            idle={
            <div className="nextup">
              <p className="lab blue">Next up</p>
              {upcoming.length ? (
                <div>
                  {upcoming.slice(0, 3).map((e) => (
                    <button key={e.id} type="button" onClick={() => openEvent(e)} className="ev-row" style={{ background: "none", border: 0, borderTop: "1px solid var(--ln-d)", textAlign: "left", width: "100%", gridTemplateColumns: "56px minmax(0,1fr) auto" }}>
                      {e.image ? <img src={cdn(e.image, 160)} alt="" loading="lazy" /> : <span />}
                      <span style={{ minWidth: 0 }}>
                        <span className="lab blue" style={{ display: "block" }}>{formatDate(e.date, { weekday: "short", day: "numeric", month: "short" })}</span>
                        <b className="d3" style={{ display: "block", fontSize: 20 }}>{e.title}</b>
                        <span className="sm mut">{e.location}</span>
                      </span>
                      <span className="lab">Details →</span>
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <p className="d3">
                    Coming <span className="hl">soon</span>
                  </p>
                  <p className="sm mut">Nothing on the calendar right now. The next event is being planned; follow us so you don’t miss the announcement.</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a className="btn w sm" href={ig.href} target="_blank" rel="noopener noreferrer">
                      Instagram <span className="ar">→</span>
                    </a>
                    <a className="btn o sm" href={li.href} target="_blank" rel="noopener noreferrer">
                      LinkedIn <span className="ar">→</span>
                    </a>
                  </div>
                </>
              )}
            </div>
            }
          />
        </div>
      </section>

      <section className="sec light" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap", marginBottom: 40, paddingTop: 64 }}>
            <h2 className="d2">
              Archive <span className="mut thin">/ {filtered.length}</span>
            </h2>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <div className="chips" role="group" aria-label="Filter by year">
                {["all", ...years].map((y) => (
                  <button key={y} type="button" className={`chip${String(year) === String(y) ? " on" : ""}`} aria-pressed={String(year) === String(y)} onClick={() => setYear(String(y))}>
                    {y === "all" ? "All" : y}
                  </button>
                ))}
              </div>
              <div className="fld" style={{ width: 220, maxWidth: "100%" }}>
                <label htmlFor="q" className="sr-only">
                  Search events
                </label>
                <input id="q" type="search" placeholder="Search events" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
            </div>
          </div>
          {filtered.length ? (
            <div className="g4" style={{ rowGap: 56 }} key={year}>
              {filtered.slice(0, shown).map((e, n) => (
                <PosterCard
                  key={e.id}
                  image={e.image}
                  title={e.title}
                  date={e.date}
                  meta={e.description}
                  href={eventPath(e)}
                  onOpen={() => openEvent(e)}
                  index={n % 4}
                />
              ))}
            </div>
          ) : (
            <div className="empty">
              <p className="d3">No events match “{q}”</p>
              <button type="button" className="btn o sm" onClick={() => { setQ(""); setYear("all"); }}>
                Clear filters
              </button>
            </div>
          )}
          {shown < filtered.length && (
            <div style={{ textAlign: "center", marginTop: 64 }}>
              <button type="button" className="btn o" onClick={() => setShown((s) => s + PAGE)}>
                Show more events
              </button>
            </div>
          )}
        </div>
      </section>

      <EventModal event={open} onClose={close} />
    </>
  );
}
