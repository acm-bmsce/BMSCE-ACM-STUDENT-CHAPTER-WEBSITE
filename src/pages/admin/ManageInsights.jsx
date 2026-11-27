import { useCallback, useEffect, useMemo, useState } from "react";
import { ImageField, PageHead } from "./ui";
import { adminApi, previewSrc, publishNote } from "../../lib/adminApi";
import { cdn } from "../../lib/data";
import { IconClose, IconGlobe, IconPlus, IconTrash } from "./AdminIcons";
import { safeHref } from "../../lib/safeUrl";

function emptyForm() {
  return {
    personName: "",
    role: "",
    company: "",
    year: String(new Date().getFullYear()),
    image: "",
    insta_link: "",
  };
}

function fromInsight(item) {
  const rawDesc = String(item.description || "").trim();
  const [rolePart, ...companyParts] = rawDesc.split(",");
  return {
    personName: item.personName || "",
    role: (rolePart || "").trim(),
    company: companyParts.join(",").trim(),
    year: String(item.year || new Date().getFullYear()),
    image: item.image || "",
    insta_link: item.insta_link || "",
  };
}

function toPayload(form) {
  const role = form.role.trim();
  const company = form.company.trim();
  const description = company ? `${role}, ${company}` : role;
  return {
    personName: form.personName.trim(),
    description,
    year: String(form.year).trim(),
    image: form.image.trim(),
    insta_link: form.insta_link.trim(),
    title: "Insight Series",
  };
}

export default function ManageInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [limit, setLimit] = useState(20);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const res = await adminApi.listInsights();
      setInsights(res.data || []);
    } catch (err) {
      setListError(err.message || "Failed to load Insight Series entries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);


  const years = useMemo(
    () =>
      [...new Set(insights.map((i) => String(i.year || "").trim()).filter(Boolean))].sort(
        (a, b) => Number(b) - Number(a)
      ),
    [insights]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return insights.filter((item) => {
      if (yearFilter && String(item.year || "") !== yearFilter) return false;
      if (!q) return true;
      const hay = [item.personName, item.description, item.year]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [insights, search, yearFilter]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const editing = editingId ? insights.find((x) => (x._id || x.id) === editingId) : null;

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFormError("");
    setDrawerOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id || item.id);
    setForm(fromInsight(item));
    setFormError("");
    setDrawerOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (form.personName.trim().length < 2) return setFormError("Alumni name must be at least 2 characters.");
    if (form.role.trim().length < 2) return setFormError("Role or degree title is required.");
    if (!/^\d{4}$/.test(String(form.year).trim())) return setFormError("Year must be a 4-digit batch year (e.g. 2026).");
    if (!form.image.trim() || (!/^https?:\/\//i.test(form.image.trim()) && !form.image.trim().startsWith("/"))) {
      return setFormError("Image must be a valid URL or a site path starting with /.");
    }
    if (!form.insta_link.trim() || !/^https?:\/\//i.test(form.insta_link.trim())) {
      return setFormError("Valid Instagram post URL is required.");
    }

    setSubmitting(true);
    try {
      const payload = toPayload(form);
      if (editingId) {
        await adminApi.updateInsight(editingId, payload);
        setNotice(`Insight Series story updated. ${publishNote()}`);
      } else {
        await adminApi.createInsight(payload);
        setNotice(`Insight Series story added. ${publishNote()}`);
      }
      setDrawerOpen(false);
      await load();
    } catch (err) {
      if (err.partial) {
        // The story itself was saved; only the batch year wasn't.
        setDrawerOpen(false);
        setNotice("");
        setListError(err.message);
        await load();
        return;
      }
      const detail = err.details?.map((d) => d.message).filter(Boolean).join(" ");
      setFormError(detail || err.message || "Failed to save Insight Series entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (item) => {
    const id = item._id || item.id;
    if (!window.confirm(`Permanently delete Insight Series entry for "${item.personName}"?`)) return;
    try {
      await adminApi.deleteInsight(id);
      setInsights((curr) => curr.filter((x) => (x._id || x.id) !== id));
      setNotice(`Insight Series entry deleted. ${publishNote()}`);
      if (id === editingId) setDrawerOpen(false);
    } catch (err) {
      setListError(err.message || "Failed to delete entry.");
    }
  };

  return (
    <>
      <PageHead title="Insight Series" sub={`${insights.length} alumni stor${insights.length === 1 ? "y" : "ies"} on the Placements page.`}>
        <button type="button" className="b p" onClick={openCreate}>
          <IconPlus /> Add story
        </button>
      </PageHead>

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

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div className="seg" role="group" aria-label="Filter by batch">
          {[["", "All", insights.length], ...years.map((y) => [y, y, insights.filter((i) => String(i.year || "") === y).length])].map(([k, l, c]) => (
            <button key={l} type="button" className={yearFilter === k ? "on" : ""} aria-pressed={yearFilter === k} onClick={() => setYearFilter(k)}>
              {l} <span className="c">{c}</span>
            </button>
          ))}
        </div>
        <label className="srch">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m20 20-4.2-4.2" />
          </svg>
          <input type="search" placeholder="Search name, role, company" aria-label="Search stories" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
      </div>

      <div className="grid c-ed">
        <section className="pn">
          {loading ? (
            <div className="admin-loading">
              <span className="admin-spinner light" />
              Loading stories…
            </div>
          ) : (
            <div className="tw">
              <div className="dt" role="table" aria-label="Insight Series stories" style={{ "--cols": "minmax(200px,1.5fr) minmax(120px,1fr) 70px 130px" }}>
                <div className="dh" role="row">
                  <span role="columnheader">Person</span>
                  <span role="columnheader">Company or university</span>
                  <span role="columnheader">Batch</span>
                  <span role="columnheader">
                    <span className="sr">Actions</span>
                  </span>
                </div>
                {filtered.length === 0 ? (
                  <div className="dr" role="row" style={{ display: "block", padding: "28px 20px" }}>
                    <div role="cell" className="empty">
                      <p>{insights.length === 0 ? "No stories yet. Add the first alumni story." : "No stories match your filters."}</p>
                    </div>
                  </div>
                ) : (
                  filtered.slice(0, limit).map((item) => {
                    const id = item._id || item.id;
                    const f = fromInsight(item);
                    return (
                      <div className={`dr${id === editingId ? " sel" : ""}`} role="row" key={id}>
                        <div role="cell" className="idc">
                          {item.image ? <img className="sq" src={previewSrc(cdn(item.image, 120))} alt="" width="40" height="40" loading="lazy" decoding="async" /> : <span className="ph" aria-hidden="true" />}
                          <div style={{ minWidth: 0 }}>
                            <b>{item.personName}</b>
                            <span>{f.role || "-"}</span>
                          </div>
                        </div>
                        <span role="cell" style={{ color: "var(--muted)" }}>
                          {f.company || "-"}
                        </span>
                        <span role="cell" className="num">
                          {item.year || "-"}
                        </span>
                        <div role="cell" className="rowacts">
                          <button type="button" className="b sm q" onClick={() => openEdit(item)} aria-label={`Edit ${item.personName}`}>
                            Edit
                          </button>
                          {item.insta_link && (
                            <a className="b sm q" href={safeHref(item.insta_link)} target="_blank" rel="noopener noreferrer" aria-label={`${item.personName} on Instagram`}>
                              <IconGlobe />
                            </a>
                          )}
                          <button type="button" className="b sm q danger" onClick={() => remove(item)} aria-label={`Delete ${item.personName}`}>
                            <IconTrash />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
          {!loading && filtered.length > 0 && (
            <div className="pn-f">
              <span className="num">
                {Math.min(limit, filtered.length)} of {filtered.length}
              </span>
              {filtered.length > limit && (
                <div className="acts">
                  <button type="button" className="b sm" onClick={() => setLimit((l) => l + 20)}>
                    Show more
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {drawerOpen ? (
          <form className="drawer" onSubmit={submit} noValidate aria-label={editingId ? "Edit story" : "Add story"}>
            <div className="pn-h">
              <h2>{editingId ? form.personName || "Edit story" : "New story"}</h2>
              <button className="b sm q" type="button" onClick={() => setDrawerOpen(false)} aria-label="Close editor">
                <IconClose />
              </button>
            </div>
            <div className="pn-b" style={{ display: "grid", gap: 16 }}>
              {formError && (
                <div className="admin-alert error" role="alert">
                  {formError}
                </div>
              )}
              <ImageField id="ins-image" label="Story poster" value={form.image} onChange={(v) => set("image", v)} square />
              <div className="fld">
                <label htmlFor="ins-name">Name</label>
                <input id="ins-name" value={form.personName} onChange={(e) => set("personName", e.target.value)} placeholder="e.g. K Karthik" required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="fld">
                  <label htmlFor="ins-year">Batch</label>
                  <input id="ins-year" inputMode="numeric" maxLength={4} value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2026" required />
                </div>
                <div className="fld">
                  <label htmlFor="ins-company">Company or university</label>
                  <input id="ins-company" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="e.g. Eightfold AI" />
                </div>
              </div>
              <div className="fld">
                <label htmlFor="ins-role">Role or programme</label>
                <input id="ins-role" value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Engineering Intern" required />
              </div>
              <div className="fld">
                <label htmlFor="ins-insta">Instagram post</label>
                <input id="ins-insta" type="url" value={form.insta_link} onChange={(e) => set("insta_link", e.target.value)} placeholder="https://www.instagram.com/p/…" required />
                <span className="hint">“Read on Instagram” opens this link.</span>
              </div>
              <div className="acts" style={{ justifyContent: "space-between" }}>
                {editing ? (
                  <button type="button" className="b neg" onClick={() => remove(editing)}>
                    Remove
                  </button>
                ) : (
                  <span />
                )}
                <div className="acts">
                  <button type="button" className="b" onClick={() => setDrawerOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="b p" disabled={submitting}>
                    {submitting ? <span className="admin-spinner" /> : editingId ? "Save" : "Add story"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <aside className="drawer" aria-label="Story editor">
            <div className="pn-b empty" style={{ padding: "40px 24px" }}>
              <p>Pick a story to edit it here, or add a new one.</p>
              <button type="button" className="b p sm" onClick={openCreate}>
                <IconPlus /> Add story
              </button>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
