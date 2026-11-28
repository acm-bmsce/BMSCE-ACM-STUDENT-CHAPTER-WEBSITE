import { Link } from "react-router-dom";
import useTitle from "../lib/useTitle";
import Split from "../components/Split";
import { Rings } from "../components/ui";

export default function NotFound() {
  useTitle("Page not found");
  return (
    <section className="ph" style={{ minHeight: "70vh", display: "grid", alignItems: "center" }}>
      <Rings />
      <div className="wrap" style={{ position: "relative", padding: "96px 0" }}>
        <p className="lab" style={{ marginBottom: 24 }}>
          <span className="dia" />
          Error 404
        </p>
        <Split as="h1" className="d1">
          Off the <span className="blue">map</span>
        </Split>
        <p className="lede mut" style={{ marginTop: 28 }}>This page doesn’t exist, or it moved when we rebuilt the site.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 32 }}>
          <Link className="btn" to="/">
            Back home <span className="ar">→</span>
          </Link>
          <Link className="btn o" to="/events">
            Browse events
          </Link>
        </div>
      </div>
    </section>
  );
}
