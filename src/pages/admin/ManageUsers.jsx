import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../../lib/adminApi";
import { PageHead } from "./ui";

/**
 * Admin accounts on the chapter's backend (master admins only): approve people who asked for an
 * account, and set a new password for anyone who asked for a reset.
 */
export default function ManageUsers() {
  const [pending, setPending] = useState(null);
  const [resets, setResets] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [passwords, setPasswords] = useState({});

  const load = useCallback(async () => {
    setError("");
    try {
      const [p, r] = await Promise.all([adminApi.pendingUsers(), adminApi.resetRequests()]);
      setPending(p || []);
      setResets(r || []);
    } catch (err) {
      setError(err.message);
      setPending([]);
      setResets([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (u) => {
    setBusy(u._id);
    setNotice("");
    setError("");
    try {
      await adminApi.approveUser(u._id);
      setNotice(`${u.username} can now sign in.`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  const reset = async (u) => {
    const pw = passwords[u._id] || "";
    if (pw.length < 8) return setError(`Give ${u.username} a new password of at least 8 characters.`);
    setBusy(u._id);
    setNotice("");
    setError("");
    try {
      await adminApi.resetPassword(u._id, pw);
      setPasswords((p) => ({ ...p, [u._id]: "" }));
      setNotice(`${u.username}'s password was changed. Tell them the new one in person or by a private message.`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  const table = (rows, empty, action) =>
    rows === null ? (
      <div className="admin-loading">
        <span className="admin-spinner light" />
        Loading…
      </div>
    ) : rows.length === 0 ? (
      <div className="pn-b empty">
        <p>{empty}</p>
      </div>
    ) : (
      <div className="tw">
        <div className="dt" role="table" style={{ "--cols": "minmax(160px,1fr) minmax(200px,1.4fr) minmax(280px,auto)" }}>
          <div className="dh" role="row">
            <span role="columnheader">Username</span>
            <span role="columnheader">Email</span>
            <span role="columnheader">
              <span className="sr">Actions</span>
            </span>
          </div>
          {rows.map((u) => (
            <div className="dr" role="row" key={u._id}>
              <span role="cell">
                <b>{u.username}</b>
              </span>
              <span role="cell">{u.email}</span>
              <span role="cell" style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                {action(u)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <>
      <PageHead title="Accounts" sub="People who asked for an admin account, and password resets waiting for you." />
      {notice && (
        <div className="admin-alert success" style={{ marginBottom: 16 }} role="status">
          {notice}
        </div>
      )}
      {error && (
        <div className="admin-alert error" style={{ marginBottom: 16 }} role="alert">
          {error}
        </div>
      )}
      <section className="pn" aria-labelledby="us-p" style={{ marginBottom: 20 }}>
        <div className="pn-h">
          <h2 id="us-p">Waiting for approval</h2>
        </div>
        {table(pending, "No one is waiting for approval.", (u) => (
          <button type="button" className="b p sm" disabled={busy === u._id} onClick={() => approve(u)}>
            Approve
          </button>
        ))}
      </section>
      <section className="pn" aria-labelledby="us-r">
        <div className="pn-h">
          <h2 id="us-r">Password resets</h2>
        </div>
        {table(resets, "No password resets requested.", (u) => (
          <>
            <input
              type="password"
              autoComplete="new-password"
              aria-label={`New password for ${u.username}`}
              placeholder="New password"
              value={passwords[u._id] || ""}
              onChange={(e) => setPasswords((p) => ({ ...p, [u._id]: e.target.value }))}
              style={{ width: 180 }}
            />
            <button type="button" className="b p sm" disabled={busy === u._id} onClick={() => reset(u)}>
              Set password
            </button>
          </>
        ))}
      </section>
    </>
  );
}
