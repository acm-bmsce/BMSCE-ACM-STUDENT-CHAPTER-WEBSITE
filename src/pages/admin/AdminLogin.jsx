import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { adminApi, isAuthenticated, LIVE, setSession } from "../../lib/adminApi";
import "../../styles/admin.css";

// With the chapter's backend connected, people can also ask for an account or a password reset
// here; a master admin approves both under Accounts.
const TITLES = { signin: "Sign in", access: "Request access", reset: "Reset your password" };

export default function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  useEffect(() => {
    document.title = "Sign in · Chapter admin";
  }, []);

  if (isAuthenticated()) return <Navigate to="/admin/dashboard" replace />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const go = (next) => {
    setMode(next);
    setError("");
    setDone("");
  };

  const submit = async (e) => {
    e.preventDefault();
    const username = form.username.trim();
    setError("");
    setDone("");
    if (!username) return setError("Enter your username.");
    if (mode === "signin" && !form.password) return setError("Enter your username and password.");
    if (mode === "access") {
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Enter a valid email address.");
      if (form.password.length < 8) return setError("Choose a password of at least 8 characters.");
    }
    setLoading(true);
    try {
      if (mode === "signin") {
        const res = await adminApi.login(username, form.password);
        setSession(res.data.token, res.data.user);
        navigate("/admin/dashboard", { replace: true });
        return;
      }
      if (mode === "access") {
        await adminApi.requestAccess({ username, email: form.email.trim(), password: form.password });
        setDone("Request sent. You can sign in once a master admin approves your account.");
      } else {
        await adminApi.requestReset(username);
        setDone("Request sent. A master admin will set a new password and tell you what it is.");
      }
      setForm((f) => ({ ...f, password: "" }));
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="admin">
      <div className="auth" style={{ minHeight: "100dvh" }}>
        <section className="auth-l">
          <img src="/img/logo-mark.webp" alt="BMSCE ACM Student Chapter" style={{ height: 44, width: "auto", alignSelf: "flex-start" }} />
          <div>
            <p style={{ fontSize: 13, color: "#949494" }}>BMSCE ACM Student Chapter</p>
            <h1 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontWeight: 400, fontSize: "clamp(44px, 7vw, 104px)", lineHeight: 0.9, letterSpacing: ".01em", textTransform: "uppercase", marginTop: 14 }}>
              Chapter
              <br />
              <span style={{ color: "#3ddcff" }}>admin</span>
            </h1>
            <p style={{ fontSize: 17, color: "#b4b4b4", marginTop: 22, maxWidth: "40ch" }}>
              Events, projects, Insight Series stories and every page of the website, managed from one place.
            </p>
          </div>
          <p style={{ fontSize: 13, color: "#949494" }}>For chapter office-bearers only.</p>
        </section>
        <section className="auth-r">
          <form className="auth-f" onSubmit={submit} noValidate aria-labelledby="adm-t">
            <h2 id="adm-t" style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>
              {TITLES[mode]}
            </h2>
            {error && (
              <p className="note bad" role="alert">
                {error}
              </p>
            )}
            {done && (
              <p className="note ok" role="status">
                {done}
              </p>
            )}
            <div className="fld">
              <label htmlFor="a-user">Username</label>
              <input id="a-user" type="text" autoComplete="username" autoCapitalize="none" spellCheck="false" value={form.username} onChange={set("username")} autoFocus />
            </div>
            {mode === "access" && (
              <div className="fld">
                <label htmlFor="a-mail">Email</label>
                <input id="a-mail" type="email" autoComplete="email" value={form.email} onChange={set("email")} />
              </div>
            )}
            {mode !== "reset" && (
              <div className="fld">
                <label htmlFor="a-pw">{mode === "access" ? "Choose a password" : "Password"}</label>
                <input id="a-pw" type="password" autoComplete={mode === "access" ? "new-password" : "current-password"} value={form.password} onChange={set("password")} />
              </div>
            )}
            <button className="b p" type="submit" style={{ height: 44 }} disabled={loading}>
              {loading && <span className="spin" aria-hidden="true" />}
              {mode === "signin" ? "Sign in" : "Send request"}
            </button>
            {LIVE ? (
              <p style={{ fontSize: 13, color: "#949494", display: "flex", gap: 16, flexWrap: "wrap" }}>
                {mode !== "signin" && (
                  <button type="button" className="lnk-b" onClick={() => go("signin")}>
                    Back to sign in
                  </button>
                )}
                {mode !== "reset" && (
                  <button type="button" className="lnk-b" onClick={() => go("reset")}>
                    Forgot your password?
                  </button>
                )}
                {mode !== "access" && (
                  <button type="button" className="lnk-b" onClick={() => go("access")}>
                    Request access
                  </button>
                )}
              </p>
            ) : (
              <p style={{ fontSize: 13, color: "#949494" }}>Forgot your password? Ask the chapter’s superadmin to reset it.</p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
