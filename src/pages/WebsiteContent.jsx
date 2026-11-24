import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import Layout from "../layouts/Layout";
import { SECTIONS } from "../content/schema";
import { MediaField } from "../components/MediaFields";
import { SITE_URL } from "../services/assets";

const clone = (v) => JSON.parse(JSON.stringify(v ?? null));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default function WebsiteContent() {
  const [params, setParams] = useSearchParams();
  const activeKey = params.get("section") || SECTIONS[0].key;
  const section = SECTIONS.find((s) => s.key === activeKey) || SECTIONS[0];

  const [all, setAll] = useState(null); // { content, meta, defaults }
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [saving, setSaving] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  useEffect(() => {
    API.get("/api/admin/content")
      .then(({ data }) => setAll({ content: data.data, meta: data.meta, defaults: data.defaults }))
      .catch((e) => setLoadErr(e.response?.data?.message || "Could not load website content. Is the backend running?"));
  }, []);

  useEffect(() => {
    if (all) setDraft(clone(all.content[section.key]));
    setStatus({ type: "", msg: "" });
  }, [all, section.key]);

  const dirty = all && draft && !same(draft, all.content[section.key]);

  // Warn before leaving with unsaved edits
  useEffect(() => {
    const h = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const pick = (key) => {
    if (dirty && !confirm("You have unsaved changes in this section. Leave without saving?")) return;
    setParams({ section: key });
  };

  const save = async () => {
    setSaving(true);
    setStatus({ type: "", msg: "" });
    try {
      const { data } = await API.put(`/api/admin/content/${section.key}`, draft);
      setAll((a) => ({ ...a, content: { ...a.content, [section.key]: data.data }, meta: { ...a.meta, [section.key]: data.meta } }));
      setStatus({ type: "ok", msg: "Saved — it's live on the website now." });
    } catch (e) {
      setStatus({ type: "err", msg: e.response?.data?.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm(`Reset “${section.label}” to the original default content? Your edits to this section will be removed.`)) return;
    setSaving(true);
    try {
      const { data } = await API.delete(`/api/admin/content/${section.key}`);
      setAll((a) => ({ ...a, content: { ...a.content, [section.key]: data.data }, meta: { ...a.meta, [section.key]: data.meta } }));
      setStatus({ type: "ok", msg: "Back to default." });
    } catch (e) {
      setStatus({ type: "err", msg: e.response?.data?.message || "Reset failed." });
    } finally {
      setSaving(false);
    }
  };

  const groups = useMemo(() => {
    const g = {};
    SECTIONS.forEach((s) => (g[s.group] ||= []).push(s));
    return Object.entries(g);
  }, []);

  const meta = all?.meta?.[section.key];

  return (
    <Layout>
      <h1 className="page-title">Website Content</h1>
      <p className="page-sub">Change text and photos on the public website. Every section starts with default content — once you save, your version replaces it. “Reset to default” brings the original back.</p>

      {loadErr && <div className="card error-text">{loadErr}</div>}

      <div className="wc">
        <nav className="wc-nav">
          {groups.map(([g, list]) => (
            <div key={g} className="wc-group">
              <div className="wc-group-title">{g}</div>
              {list.map((s) => (
                <button key={s.key} className={`wc-link ${s.key === section.key ? "active" : ""}`} onClick={() => pick(s.key)}>
                  <span>{s.label}</span>
                  {all?.meta?.[s.key]?.customized ? <i className="tag tag-edited">Edited</i> : <i className="tag">Default</i>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <section className="wc-main">
          <div className="wc-head">
            <div>
              <h2>{section.label}</h2>
              {section.help && <p className="help">{section.help}</p>}
              {meta?.customized && meta.updatedAt && (
                <p className="help">Last saved {new Date(meta.updatedAt).toLocaleString()}{meta.updatedBy ? ` by ${meta.updatedBy}` : ""}</p>
              )}
            </div>
            <a className="btn btn-sm" href={`${SITE_URL}${section.preview || "/"}`} target="_blank" rel="noreferrer">View on website ↗</a>
          </div>

          {!draft ? (
            <div className="empty-state">{loadErr ? "—" : "Loading…"}</div>
          ) : (
            <div className="wc-fields">
              {section.fields.map((f) => (
                <Field key={f.key} field={f} value={draft[f.key]} onChange={(v) => setDraft({ ...draft, [f.key]: v })} />
              ))}
            </div>
          )}

          <div className={`wc-bar ${dirty ? "is-dirty" : ""}`}>
            <span className="wc-bar-msg">
              {status.msg ? <span className={status.type === "ok" ? "ok-text" : "error-text"}>{status.msg}</span> : dirty ? "Unsaved changes" : meta?.customized ? "Showing your saved version" : "Showing default content"}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {dirty && <button className="btn" onClick={() => setDraft(clone(all.content[section.key]))} disabled={saving}>Discard</button>}
              {meta?.customized && <button className="btn btn-danger" onClick={reset} disabled={saving}>Reset to default</button>}
              <button className="btn btn-primary" onClick={save} disabled={saving || !dirty}>{saving ? "Saving…" : "Save & publish"}</button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

/* ---------- field renderer ---------- */
function Field({ field: f, value, onChange }) {
  return (
    <div className={`wc-field ${f.type === "list" ? "wc-field-list" : ""}`}>
      {f.type !== "checkbox" && <label className="wc-label">{f.label}</label>}
      <Control field={f} value={value} onChange={onChange} />
      {f.help && <div className="help">{f.help}</div>}
    </div>
  );
}

function Control({ field: f, value, onChange }) {
  switch (f.type) {
    case "textarea":
      return <textarea className="input" rows={f.rows || 3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "number":
      return <input className="input" type="number" min={f.min} max={f.max} value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} style={{ maxWidth: 160 }} />;
    case "checkbox":
      return (
        <label className="check">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {f.label}
        </label>
      );
    case "image":
    case "video":
      return <MediaField kind={f.type} value={value} onChange={onChange} />;
    case "list":
      return <ListControl field={f} value={Array.isArray(value) ? value : []} onChange={onChange} />;
    default:
      return <input className="input" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
}

function ListControl({ field: f, value, onChange }) {
  const [open, setOpen] = useState(value.length <= 1 ? 0 : -1);
  const set = (i, v) => onChange(value.map((x, j) => (j === i ? v : x)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(open === i ? j : open === j ? i : open);
  };
  const remove = (i) => {
    if (!confirm("Remove this item?")) return;
    onChange(value.filter((_, j) => j !== i));
    setOpen(-1);
  };
  const add = () => {
    onChange([...value, clone(f.newItem ?? "")]);
    setOpen(value.length);
  };

  // List of plain images (e.g. fallback photos): show as a grid
  if (f.primitive === "image") {
    return (
      <div className="img-list">
        {value.map((v, i) => (
          <div key={i} className="img-list-item">
            <MediaField value={v} onChange={(nv) => set(i, nv)} />
            <div className="row-tools">
              <button type="button" className="btn btn-sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" className="btn btn-sm" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move down">↓</button>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => remove(i)}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn add-btn" onClick={add}>+ Add photo</button>
      </div>
    );
  }

  return (
    <div className="list">
      {value.map((item, i) => (
        <div key={i} className={`list-item ${open === i ? "open" : ""}`}>
          <div className="list-head" onClick={() => setOpen(open === i ? -1 : i)}>
            <span className="list-caret">{open === i ? "▾" : "▸"}</span>
            <span className="list-title">{f.itemLabel ? f.itemLabel(item, i) : `Item ${i + 1}`}</span>
            <div className="row-tools" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="btn btn-sm" onClick={() => move(i, -1)} disabled={i === 0} title="Move up">↑</button>
              <button type="button" className="btn btn-sm" onClick={() => move(i, 1)} disabled={i === value.length - 1} title="Move down">↓</button>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => remove(i)}>Remove</button>
            </div>
          </div>
          {open === i && (
            <div className="list-body">
              {f.item.map((sub) => (
                <Field key={sub.key} field={sub} value={item?.[sub.key]} onChange={(v) => set(i, { ...item, [sub.key]: v })} />
              ))}
            </div>
          )}
        </div>
      ))}
      <button type="button" className="btn add-btn" onClick={add}>+ Add {f.label.replace(/s$/, "").toLowerCase()}</button>
    </div>
  );
}
