import { useEffect, useState } from "react";
import { cdn, formatDate } from "../lib/data";
import Dialog from "./ui/Dialog";
import { eventUrl } from "../lib/eventLinks";

const money = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

/** Event detail window: poster, facts, story, photos and registration. */
/** Shares the event's own address (system share sheet on phones, otherwise copies it). */
function ShareButton({ event }) {
  const [done, setDone] = useState("");
  const share = async () => {
    const url = eventUrl(event);
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: event.title, text: `${event.title} · BMSCE ACM`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setDone("Link copied");
    } catch (err) {
      if (err?.name === "AbortError") return;
      window.prompt("Copy this link", url);
    }
    setTimeout(() => setDone(""), 2200);
  };
  return (
    <button className="btn o" type="button" onClick={share} aria-live="polite">
      {done || "Share event"}
    </button>
  );
}

export default function EventModal({ event, onClose }) {
  const [shot, setShot] = useState(0);

  useEffect(() => {
    setShot(0);
  }, [event?.id]);

  // keyboard: left/right arrows
  useEffect(() => {
    if (!event) return;
    const total = Math.min([event.image, ...event.gallery].filter(Boolean).length, 8);
    if (total < 2) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setShot((i) => (i - 1 + total) % total);
      if (e.key === "ArrowRight") setShot((i) => (i + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [event]);

  if (!event) return null;
  const images = [event.image, ...event.gallery].filter(Boolean).slice(0, 8);
  const main = images[shot] || "/img/events-bg.webp";
  const upcoming = event.date && event.date >= new Date(new Date().toDateString());
  const paid = event.memberPrice > 0 || event.nonMemberPrice > 0;
  const teamSize = event.teamMin || event.teamMax ? [event.teamMin, event.teamMax].filter(Boolean).join("–") : "";

  const prev = () => setShot((i) => (i - 1 + images.length) % images.length);
  const next = () => setShot((i) => (i + 1) % images.length);

  return (
    <Dialog
      key={event.id}
      onClose={onClose}
      closeLabel="Close event details"
      eyebrow={
        <>
          {event.date ? formatDate(event.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Event"}
          {upcoming && <span className="tag b" style={{ marginLeft: 10 }}>Upcoming</span>}
        </>
      }
      title={event.title}
    >
      <div className="evd">
        <div className="evd-media">
          <div className="evd-art" style={{ "--bg": `url("${cdn(main, 80)}")` }}>
            <img key={main} src={cdn(main, 900)} alt={`${event.title}, photo ${shot + 1}`} decoding="async" width="900" height="1125" />
            {images.length > 1 && (
              <>
                <button type="button" className="arrow left" onClick={prev} aria-label="Previous photo">‹</button>
                <button type="button" className="arrow right" onClick={next} aria-label="Next photo">›</button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="gal">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setShot(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-pressed={i === shot}
                  style={{ padding: 0, border: i === shot ? "2px solid var(--b)" : "2px solid transparent", background: "none" }}
                >
                  <img src={cdn(src, 240)} alt="" loading="lazy" decoding="async" width="240" height="240" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="evd-info" data-lenis-prevent>
          <dl className="kv" style={{ margin: 0 }}>
            {event.location && (
              <div>
                <dt>Venue</dt>
                <dd>{event.location}</dd>
              </div>
            )}
            {event.attendees ? (
              <div>
                <dt>{upcoming ? "Registered" : "Attended"}</dt>
                <dd>{event.attendees}</dd>
              </div>
            ) : null}
            <div>
              <dt>Format</dt>
              <dd>
                {[event.type, event.teamEvent ? (teamSize ? `Teams of ${teamSize}` : "Team event") : "Individual", event.acmExclusive && "ACM members only"].filter(Boolean).join(" · ")}
              </dd>
            </div>
            {paid && (
              <div>
                <dt>Fee</dt>
                <dd>
                  {[event.memberPrice > 0 && `Members ${money(event.memberPrice)}`, !event.acmExclusive && event.nonMemberPrice > 0 && `Others ${money(event.nonMemberPrice)}`].filter(Boolean).join(" · ") || "Free"}
                </dd>
              </div>
            )}
            {event.capacity > 0 && (
              <div>
                <dt>{event.teamEvent ? "Teams" : "Seats"}</dt>
                <dd>{event.capacity}</dd>
              </div>
            )}
          </dl>
          <div style={{ display: "grid", gap: 14 }}>
            {event.fullDescription.split(/\n+/).filter(Boolean).map((p, i) => (
              <p key={i} className="mut" style={{ fontSize: 16 }}>
                {p}
              </p>
            ))}
          </div>
          {event.outcomes.length > 0 && (
            <div>
              <p className="lab" style={{ marginBottom: 6 }}>Outcomes</p>
              <ul className="bl">
                {event.outcomes.map((o, i) => (
                  <li key={i} className="sm">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {event.slug && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <ShareButton event={event} />
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
