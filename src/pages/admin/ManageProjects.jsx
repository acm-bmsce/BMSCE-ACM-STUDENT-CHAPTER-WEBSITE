import { useCallback, useEffect, useMemo, useState } from "react";
import { ChipInput, ImageField, PageHead } from "./ui";
import { adminApi, previewSrc, publishNote } from "../../lib/adminApi";
import { cdn } from "../../lib/data";
import { IconClose, IconGlobe, IconPlus, IconTrash } from "./AdminIcons";
import { safeHref } from "../../lib/safeUrl";

const PROJECT_STATUSES = ["APPROVED", "PENDING", "HIDDEN"];

function emptyForm() {
  return {
    title: "",
    author: "",
    description: "",
    githubUrl: "",
    imageUrl: "",
    categoriesInput: "Web, AI",
    techStackInput: "React, Node.js",
    status: "APPROVED",
  };
}

function fromProject(p) {
  return {
    title: p.title || "",
    author: p.author || "",
    description: p.description || "",
    githubUrl: p.githubUrl || "",
    imageUrl: p.imageUrl || "",
    categoriesInput: Array.isArray(p.categories) ? p.categories.join(", ") : "",
    techStackInput: Array.isArray(p.techStack) ? p.techStack.join(", ") : "",
    status: p.status || "APPROVED",
  };
}

function splitTags(raw) {
  return [
    ...new Set(
      String(raw || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  ];
}

function toPayload(form) {
  return {
    title: form.title.trim(),
    author: form.author.trim(),
    description: form.description.trim(),
    githubUrl: form.githubUrl.trim(),
    imageUrl: form.imageUrl.trim(),
    categories: splitTags(form.categoriesInput),
    techStack: splitTags(form.techStackInput),
    status: form.status || "APPROVED",
  };
}


export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const res = await adminApi.listProjects();
      setProjects(res.data || []);
    } catch (err) {
      setListError(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);


  const allCategories = useMemo(
    () => [...new Set(projects.flatMap((p) => p.categories || []).filter(Boolean))],
    [projects]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const pStatus = p.status || "APPROVED";
      if (statusFilter && pStatus !== statusFilter) return false;
      if (categoryFilter && !(p.categories || []).includes(categoryFilter)) return false;
      if (!q) return true;
      const hay = [
        p.title,
        p.author,
        p.description,
        ...(p.categories || []),
        ...(p.techStack || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [projects, search, statusFilter, categoryFilter]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFormError("");
    setDrawerOpen(true);
  };

  const openEdit = (project) => {
    setEditingId(project._id || project.id);
    setForm(fromProject(project));
    setFormError("");
    setDrawerOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (form.title.trim().length < 2) return setFormError("Title must be at least 2 characters.");
    if (form.author.trim().length < 2) return setFormError("Author name is required.");
    if (form.description.trim().length < 10) return setFormError("Description must be at least 10 characters.");
    if (form.githubUrl.trim() && !/^https?:\/\//i.test(form.githubUrl.trim())) {
      return setFormError("Valid GitHub URL is required.");
    }
    if (
      form.imageUrl.trim() &&
      !/^https?:\/\//i.test(form.imageUrl.trim()) &&
      !form.imageUrl.trim().startsWith("/")
    ) {
      return setFormError("Image must be a full URL or a site path starting with /.");
    }

    setSubmitting(true);
    try {
      const payload = toPayload(form);
      if (editingId) {
        await adminApi.updateProject(editingId, payload);
        setNotice(`Project updated and saved. ${publishNote()}`);
      } else {
        await adminApi.createProject(payload);
        setNotice(`Project added to the showcase. ${publishNote()}`);
      }
      setDrawerOpen(false);
      await load();
    } catch (err) {
      const detail = err.details?.map((d) => d.message).filter(Boolean).join(" ");
      setFormError(detail || err.message || "Failed to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleApproval = async (project) => {
    const id = project._id || project.id;
    const nextStatus = (project.status || "APPROVED") === "APPROVED" ? "HIDDEN" : "APPROVED";
    try {
      await adminApi.updateProject(id, { status: nextStatus });
      setNotice(`${nextStatus === "APPROVED" ? "Project approved for showcase." : "Project hidden from public showcase."} ${publishNote()}`);
      await load();
    } catch (err) {
      setListError(err.message || "Failed to update project status.");
    }
  };

  const remove = async (project) => {
    const id = project._id || project.id;
    if (!window.confirm(`Permanently delete project "${project.title}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteProject(id);
      setProjects((curr) => curr.filter((item) => (item._id || item.id) !== id));
      setNotice(`Project deleted. ${publishNote()}`);
      if (id === editingId) setDrawerOpen(false);
    } catch (err) {
      setListError(err.message || "Failed to delete project.");
    }
  };

  const editing = editingId ? projects.find((p) => (p._id || p.id) === editingId) : null;
  const live = projects.filter((p) => (p.status || "APPROVED") === "APPROVED").length;
  const waiting = projects.filter((p) => p.status === "PENDING").length;

  return (
    <>
      <PageHead
        title="Projects"
        sub={`${live} project${live === 1 ? "" : "s"} live on the website. ${waiting ? `${waiting} waiting for review.` : "None waiting for review."}`}
      >
        <button type="button" className="b p" onClick={openCreate}>
          <IconPlus /> Add project
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
        <div className="seg" role="group" aria-label="Filter by status">
          {[["", "All", projects.length], ...PROJECT_STATUSES.map((st) => [st, st.charAt(0) + st.slice(1).toLowerCase(), projects.filter((p) => (p.status || "APPROVED") === st).length])].map(([k, l, c]) => (
            <button key={l} type="button" className={statusFilter === k ? "on" : ""} aria-pressed={statusFilter === k} onClick={() => setStatusFilter(k)}>
              {l} <span className="c">{c}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {allCategories.length > 1 && (
            <select className="admin-filter" aria-label="Filter by category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
          <label className="srch">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m20 20-4.2-4.2" />
            </svg>
            <input type="search" placeholder="Search title, author, stack" aria-label="Search projects" value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
        </div>
      </div>

      <div className="grid c-ed">
        <section className="pn">
          {loading ? (
            <div className="admin-loading">
              <span className="admin-spinner light" />
              Loading projects…
            </div>
          ) : (
            <div className="tw">
              <div className="dt" role="table" aria-label="Projects" style={{ "--cols": "minmax(200px,1.6fr) minmax(100px,1fr) 56px 96px 210px" }}>
                <div className="dh" role="row">
                  <span role="columnheader">Project</span>
                  <span role="columnheader">Categories</span>
                  <span role="columnheader" className="num">Stack</span>
                  <span role="columnheader">Status</span>
                  <span role="columnheader">
                    <span className="sr">Actions</span>
                  </span>
                </div>
                {filtered.length === 0 ? (
                  <div className="dr" role="row" style={{ display: "block", padding: "28px 20px" }}>
                    <div role="cell" className="empty">
                      <p>{projects.length === 0 ? "No projects yet. Add one to feature student work on the Projects page." : "No projects match your filters."}</p>
                    </div>
                  </div>
                ) : (
                  filtered.map((project) => {
                    const id = project._id || project.id;
                    const status = project.status || "APPROVED";
                    return (
                      <div className={`dr${id === editingId ? " sel" : ""}`} role="row" key={id}>
                        <div role="cell" className="idc">
                          {project.imageUrl ? <img className="sq" src={previewSrc(cdn(project.imageUrl, 120))} alt="" width="40" height="40" loading="lazy" decoding="async" /> : <span className="ph" aria-hidden="true" />}
                          <div style={{ minWidth: 0 }}>
                            <b>{project.title}</b>
                            <span>{project.author}</span>
                          </div>
                        </div>
                        <span role="cell" style={{ color: "var(--muted)" }}>
                          {(project.categories || []).join(" · ") || "-"}
                        </span>
                        <span role="cell" className="num">
                          {(project.techStack || []).length}
                        </span>
                        <span role="cell">
                          <span className={`pl ${status === "APPROVED" ? "ok" : status === "PENDING" ? "wait" : "off"}`}>{status.charAt(0) + status.slice(1).toLowerCase()}</span>
                        </span>
                        <div role="cell" className="rowacts">
                          <button type="button" className="b sm q" onClick={() => openEdit(project)} aria-label={`Edit ${project.title}`}>
                            Edit
                          </button>
                          <button type="button" className="b sm q" onClick={() => toggleApproval(project)}>
                            {status === "APPROVED" ? "Hide" : "Approve"}
                          </button>
                          {project.githubUrl && (
                            <a className="b sm q" href={safeHref(project.githubUrl)} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub`}>
                              <IconGlobe />
                            </a>
                          )}
                          <button type="button" className="b sm q danger" onClick={() => remove(project)} aria-label={`Delete ${project.title}`}>
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
          <div className="pn-f">
            <span>Approved projects are shown on the Projects page.</span>
          </div>
        </section>

        {drawerOpen ? (
          <form className="drawer" onSubmit={submit} noValidate aria-label={editingId ? "Edit project" : "Add project"}>
            <div className="pn-h">
              <h2>{editingId ? form.title || "Edit project" : "New project"}</h2>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {editing && <span className={`pl ${form.status === "APPROVED" ? "ok" : form.status === "PENDING" ? "wait" : "off"}`}>{form.status.charAt(0) + form.status.slice(1).toLowerCase()}</span>}
                <button className="b sm q" type="button" onClick={() => setDrawerOpen(false)} aria-label="Close editor">
                  <IconClose />
                </button>
              </div>
            </div>
            <div className="pn-b" style={{ display: "grid", gap: 16 }}>
              {formError && (
                <div className="admin-alert error" role="alert">
                  {formError}
                </div>
              )}
              <ImageField id="proj-image" label="Cover image" value={form.imageUrl} onChange={(v) => set("imageUrl", v)} square />
              <div className="fld">
                <label htmlFor="proj-title">Title</label>
                <input id="proj-title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. SkillScanner" required />
              </div>
              <div className="fld">
                <label htmlFor="proj-author">Author or team</label>
                <input id="proj-author" value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="e.g. K Karthik" required />
              </div>
              <div className="fld">
                <label htmlFor="proj-desc">Description</label>
                <textarea id="proj-desc" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What it does, how it is built, and why it matters." required />
              </div>
              <div className="fld">
                <label htmlFor="proj-cats">Categories</label>
                <ChipInput id="proj-cats" label="Categories" value={splitTags(form.categoriesInput)} onChange={(v) => set("categoriesInput", v.join(", "))} placeholder="Web, AI, Backend…" />
              </div>
              <div className="fld">
                <label htmlFor="proj-stack">Tech stack</label>
                <ChipInput id="proj-stack" label="Tech stack" value={splitTags(form.techStackInput)} onChange={(v) => set("techStackInput", v.join(", "))} placeholder="React, Python…" />
              </div>
              <div className="fld">
                <label htmlFor="proj-github">GitHub link</label>
                <input id="proj-github" type="url" value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/user/repository" />
              </div>
              <div className="fld">
                <label htmlFor="proj-status">Status</label>
                <select id="proj-status" value={form.status} onChange={(e) => set("status", e.target.value)}>
                  {PROJECT_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st.charAt(0) + st.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="acts" style={{ justifyContent: "flex-end" }}>
                <button type="button" className="b" onClick={() => setDrawerOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="b p" disabled={submitting}>
                  {submitting ? <span className="admin-spinner" /> : editingId ? "Save" : "Add project"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <aside className="drawer" aria-label="Project editor">
            <div className="pn-b empty" style={{ padding: "40px 24px" }}>
              <p>Pick a project to edit it here, or add a new one.</p>
              <button type="button" className="b p sm" onClick={openCreate}>
                <IconPlus /> Add project
              </button>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
