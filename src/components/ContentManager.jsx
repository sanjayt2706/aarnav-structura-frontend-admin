import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../layouts/Layout";

/**
 * config = {
 *   endpoint: '/api/projects',
 *   title: 'Projects',
 *   imageField: 'cover_image',       // key that holds the uploaded file URL
 *   titleField: 'title',             // key used as card heading
 *   subField: 'category',            // key used as card subtitle
 *   fields: [ { key, label, type: 'text'|'textarea'|'number'|'select'|'checkbox', options?, required? } ]
 * }
 */
export default function ContentManager({ config }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { mode: 'create'|'edit', data: {} }
  const [file, setFile] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(config.endpoint);
      setItems(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [config.endpoint]);

  const openCreate = () => setModal({ mode: "create", data: {} });
  const openEdit = (item) => setModal({ mode: "edit", data: { ...item } });

  const remove = async (id) => {
    if (!confirm("Delete this item?")) return;
    await API.delete(`${config.endpoint}/${id}`);
    load();
  };

  const save = async (e) => {
    e.preventDefault();
    const form = new FormData();
    config.fields.forEach((f) => {
      const val = modal.data[f.key];
      if (f.type === "checkbox") form.append(f.key, val ? 1 : 0);
      else if (val !== undefined && val !== null) form.append(f.key, val);
    });
    if (file) form.append(config.imageField, file);

    if (modal.mode === "create") await API.post(config.endpoint, form, { headers: { "Content-Type": "multipart/form-data" } });
    else await API.put(`${config.endpoint}/${modal.data.id}`, form, { headers: { "Content-Type": "multipart/form-data" } });

    setModal(null);
    setFile(null);
    load();
  };

  const setField = (key, value) => setModal((m) => ({ ...m, data: { ...m.data, [key]: value } }));

  const imgSrc = (item) => {
    const path = item[config.imageField];
    if (!path) return null;
    return path.startsWith("http") ? path : `${API.defaults.baseURL}${path}`;
  };

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="page-title">{config.title}</h1>
          <p className="page-sub">{items.length} items</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add {config.title.replace(/s$/, "")}</button>
      </div>

      {loading && <div className="empty-state">Loading…</div>}
      {!loading && items.length === 0 && <div className="empty-state">Nothing here yet — add your first item.</div>}

      <div className="content-grid">
        {items.map((item) => (
          <div className="content-item" key={item.id}>
            {config.imageField && (imgSrc(item) ? <img src={imgSrc(item)} alt="" /> : <div style={{ height: 130, background: "#111418" }} />)}
            <div className="content-item-body">
              <div className="content-item-title">{item[config.titleField] || "Untitled"}</div>
              {config.subField && <div className="content-item-sub">{item[config.subField] || ""}</div>}
              <div className="content-item-actions">
                <button className="btn" onClick={() => openEdit(item)}>Edit</button>
                <button className="btn btn-danger" onClick={() => remove(item.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{modal.mode === "create" ? `Add ${config.title.replace(/s$/, "")}` : `Edit ${config.title.replace(/s$/, "")}`}</div>
            <form onSubmit={save}>
              <div className="form-grid">
                {config.fields.map((f) => (
                  <div className={`field ${f.wide ? "full" : ""}`} key={f.key}>
                    <label>{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea className="input" rows={3} style={{ width: "100%" }} value={modal.data[f.key] || ""} onChange={(e) => setField(f.key, e.target.value)} required={f.required} />
                    ) : f.type === "select" ? (
                      <select className="input" style={{ width: "100%" }} value={modal.data[f.key] || ""} onChange={(e) => setField(f.key, e.target.value)}>
                        <option value="">—</option>
                        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === "checkbox" ? (
                      <input type="checkbox" checked={!!modal.data[f.key]} onChange={(e) => setField(f.key, e.target.checked)} />
                    ) : (
                      <input className="input" style={{ width: "100%" }} type={f.type || "text"} value={modal.data[f.key] || ""} onChange={(e) => setField(f.key, e.target.value)} required={f.required} />
                    )}
                  </div>
                ))}
                {config.imageField && (
                  <div className="field full">
                    <label>{config.imageLabel || "Image"}</label>
                    <input className="input" style={{ width: "100%" }} type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn" onClick={() => setModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
