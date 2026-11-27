import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { clearSession, getStoredUser, isAuthenticated, isMaster, LIVE } from "../../lib/adminApi";
import { Icon } from "./ui";
import "../../styles/admin.css";

const MANAGE = [
  { to: "/admin/dashboard", label: "Overview", icon: "home" },
  { to: "/admin/events", label: "Events", icon: "calendar" },
];
const WEBSITE = [
  { to: "/admin/projects", label: "Projects", icon: "folder" },
  { to: "/admin/insights", label: "Insight Series", icon: "book" },
  { to: "/admin/content", label: "Pages & team", icon: "layout" },
];
// Accounts live on the chapter's backend; only master admins manage them.
const ACCOUNTS = { to: "/admin/users", label: "Accounts", icon: "users" };

const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("") || "A";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = getStoredUser();

  useEffect(() => {
    document.title = "Chapter admin · BMSCE ACM";
    window.scrollTo(0, 0);
  }, [pathname]);

  // The API clears the token on a 401; send the admin back to sign in.
  useEffect(() => {
    const check = () => !isAuthenticated() && navigate("/admin/login", { replace: true });
    window.addEventListener("focus", check);
    return () => window.removeEventListener("focus", check);
  }, [navigate]);

  if (!isAuthenticated()) return <Navigate to="/admin/login" replace />;

  const logout = () => {
    clearSession();
    navigate("/admin/login", { replace: true });
  };

  const link = (item) => (
    <NavLink key={item.to} to={item.to} className={({ isActive }) => `ni${isActive ? " on" : ""}`}>
      <Icon name={item.icon} />
      <span>{item.label}</span>
    </NavLink>
  );

  return (
    <div className="admin">
      <div className="adm">
        <aside className="side">
          <NavLink className="brand" to="/admin/dashboard">
            <img src="/img/logo-mark.webp" alt="" />
            <span>
              <b>Chapter admin</b>
              <span>BMSCE ACM Student Chapter</span>
            </span>
          </NavLink>
          <nav className="grp" aria-label="Manage">
            <p>Manage</p>
            {MANAGE.map(link)}
          </nav>
          <nav className="grp" aria-label="Website">
            <p>Website</p>
            {WEBSITE.filter((item) => isMaster() || item.to === "/admin/insights").map(link)}
          </nav>
          {LIVE && isMaster() && (
            <nav className="grp" aria-label="People">
              <p>People</p>
              {link(ACCOUNTS)}
            </nav>
          )}
          <nav className="grp" aria-label="Elsewhere">
            <a className="ni" href="/" target="_blank" rel="noopener noreferrer">
              <Icon name="ext" />
              <span>View the website</span>
            </a>
          </nav>
          <div className="me">
            <span className="av">{initials(user?.name)}</span>
            <p style={{ flex: 1 }}>
              {user?.name || "Admin"}
              <br />
              <span>{LIVE ? (user?.role === "master" ? "Master admin" : "Coordinator") : "Admin"}</span>
            </p>
            <button type="button" className="b q sm" onClick={logout} aria-label="Sign out" title="Sign out">
              <Icon name="out" />
            </button>
          </div>
        </aside>
        <main className="main">
          <div className="page" key={pathname}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
