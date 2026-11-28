import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, loadContent, previewSrc } from "../../lib/adminApi";
import { cdn } from "../../lib/data";
import { Icon, n, PageHead, shortDate } from "./ui";

/** Overview: what's coming up and how much is on the site. */
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    // Each part loads on its own, so one the account can't see (or a slow backend) doesn't blank the rest.
    const part = (p) => p.then((r) => r.data).catch((err) => ({ error: err }));
    Promise.all([part(adminApi.loadEvents()), part(adminApi.listProjects()), part(adminApi.listInsights()), part(loadContent("site"))]).then(([events, projects, insights, site]) => {
      if (!alive) return;
      const failed = [events, projects, insights, site].find((x) => x?.error);
      if (events?.error) setError(failed.error.message || "Could not load the overview.");
      const list = (x) => (Array.isArray(x) ? x : null);
      setData({ events: list(events) || [], projects: list(projects), insights: list(insights), site: site?.error ? null : site });
    });
    return () => {
      alive = false;
    };
  }, []);

  const [now] = useState(() => Date.now());
  const live = (data?.events || []).filter((e) => e.status !== "draft");
  const upcoming = live.filter((e) => new Date(e.date).getTime() >= now - 86400000).sort((a, b) => new Date(a.date) - new Date(b.date));
  const drafts = (data?.events || []).filter((e) => e.status === "draft");
  const team = data?.site?.team;
  return (
    <>
      <PageHead
        title="Overview"
        sub={!data ? "Loading…" : upcoming.length ? `Next up: ${upcoming[0].title}, ${shortDate(upcoming[0].date)}.` : "Nothing upcoming, so the Events page shows “Coming soon”."}
      >
        <Link className="b p" to="/admin/events?new=1">
          <Icon name="plus" />
          New event
        </Link>
      </PageHead>

      {error && (
        <p className="note bad" role="alert" style={{ marginBottom: 16 }}>
          {error}
        </p>
      )}

      <dl className="kpis">
        <div>
          <dt>Events on the site</dt>
          <dd className="num">{data ? n(live.length) : "–"}</dd>
        </div>
        <div>
          <dt>Upcoming</dt>
          <dd className={`num${upcoming.length ? " lead" : ""}`}>{data ? n(upcoming.length) : "–"}</dd>
        </div>
        <div>
          <dt>Drafts</dt>
          <dd className="num">{data ? n(drafts.length) : "–"}</dd>
        </div>
        <div>
          <dt>Team members</dt>
          <dd className="num">{team ? n(team.faculty.length + team.core.length + team.advisors.length) : "–"}</dd>
        </div>
      </dl>

      <div className="grid c-2-1">
        <section className="pn" aria-labelledby="ov-up">
          <div className="pn-h">
            <h2 id="ov-up">Upcoming events</h2>
            <Link className="b sm" to="/admin/events">
              All events
            </Link>
          </div>
          {upcoming.length ? (
            <div>
              {upcoming.slice(0, 6).map((e) => (
                <Link key={e._id} className="sublink" to="/admin/events">
                  <span style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                    {e.image ? <img src={previewSrc(cdn(e.image, 120))} alt="" width="36" height="36" style={{ objectFit: "cover", flex: "none" }} /> : null}
                    <b style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</b>
                  </span>
                  <span className="num">{shortDate(e.date)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="pn-b empty">
              <p>No upcoming events. The website shows “Coming soon” until one is published.</p>
              <Link className="b p sm" to="/admin/events?new=1">
                <Icon name="plus" />
                Create event
              </Link>
            </div>
          )}
        </section>
        <section className="pn" aria-labelledby="ov-site">
          <div className="pn-h">
            <h2 id="ov-site">Website content</h2>
          </div>
          <div>
            <Link className="sublink" to="/admin/content">
              <b>Team, stats and links</b>
              <span>Edit</span>
            </Link>
            <Link className="sublink" to="/admin/projects">
              <b>Projects</b>
              <span className="num">{data?.projects ? `${n(data.projects.length)} total` : "–"}</span>
            </Link>
            <Link className="sublink" to="/admin/insights">
              <b>Insight Series</b>
              <span className="num">{data?.insights ? `${n(data.insights.length)} stories` : "–"}</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
