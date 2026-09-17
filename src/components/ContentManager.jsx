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
  const [files, setFiles] = useState({}); // { fieldName: File } or { fieldName: File[] }
  const [previews, setPreviews] = useState({}); // { fieldName: string } or { fieldName: string[] }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(config.endpoint);
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.rows)
        ? data.rows
        : Array.isArray(data)
        ? data
        : [];
      setItems(list);
    } catch (err) {
      console.error("Failed to load items:", err);
      setError(err.response?.data?.message || "Failed to load content.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [config.endpoint]);

  const openCreate = () => {
    setFiles({});
    setPreviews({});
    setError(null);
    setModal({ mode: "create", data: {} });
  };

  const openEdit = (item) => {
    setFiles({});
    setPreviews({});
    setError(null);
    setModal({
      mode: "edit",
      data: {
        ...item,
        id: item._id || item.id
      }
    });
  };

  const remove = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`${config.endpoint}/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete item.");
    }
  };

  const handleFileChange = (e, fieldName, multiple = false) => {
    const selectedFiles = multiple
      ? Array.from(e.target.files || [])
      : [e.target.files?.[0]].filter(Boolean);

    if (selectedFiles.length > 0) {
      setFiles((prev) => ({ ...prev, [fieldName]: multiple ? selectedFiles : selectedFiles[0] }));
      setPreviews((prev) => ({
        ...prev,
        [fieldName]: multiple
          ? selectedFiles.map((f) => URL.createObjectURL(f))
          : URL.createObjectURL(selectedFiles[0])
      }));
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const form = new FormData();
      config.fields.forEach((f) => {
        const val = modal.data[f.key];
        if (f.type === "checkbox") {
          form.append(f.key, val ? "true" : "false");
        } else if (val !== undefined && val !== null) {
          form.append(f.key, val);
        }
      });

      // Handle single image file
      if (config.imageField && files[config.imageField]) {
        form.append(config.imageField || "image", files[config.imageField]);
      }

      // Handle multiple files
      if (config.multipleFiles) {
        config.multipleFiles.forEach((mf) => {
          const uploadedFiles = files[mf.name];
          if (uploadedFiles) {
            if (Array.isArray(uploadedFiles)) {
              uploadedFiles.forEach((f) => form.append(mf.name, f));
            } else {
              form.append(mf.name, uploadedFiles);
            }
          }
        });
      }

      const id = modal.data._id || modal.data.id;
      if (modal.mode === "create") {
        await API.post(config.endpoint, form);
      } else {
        await API.put(`${config.endpoint}/${id}`, form);
      }

      setModal(null);
      setFiles({});
      setPreviews({});
      load();
    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.message || err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const setField = (key, value) =>
    setModal((m) => ({ ...m, data: { ...m.data, [key]: value } }));

  const imgSrc = (item) => {
    const path =
      item[config.imageField] ||
      item.cover_image ||
      item.photo ||
      item.image;
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
      return path;
    }
    const base = (API.defaults.baseURL || "http://localhost:5000").replace(/\/$/, "");
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="page-title">{config.title}</h1>
          <p className="page-sub">{items.length} items published</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add {config.title.replace(/s$/, "")}
        </button>
      </div>

      {error && !modal && (
        <div style={{ padding: "12px 16px", background: "rgba(220,53,69,0.15)", border: "1px solid #dc3545", color: "#ff6b6b", borderRadius: 4, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading && <div className="empty-state">Loading {config.title}…</div>}
      {!loading && items.length === 0 && (
        <div className="empty-state">
          No {config.title.toLowerCase()} added yet. Click &quot;+ Add {config.title.replace(/s$/, "")}&quot; to upload your first one.
        </div>
      )}

      <div className="content-grid">
        {items.map((item) => {
          const id = item._id || item.id;
          const image = imgSrc(item);
          return (
            <div className="content-item" key={id || Math.random()}>
              {image ? (
                <img
                  src={image}
                  alt={item[config.titleField] || ""}
                  style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={{ height: 160, background: "#151922", display: "flex", alignItems: "center", justifyContent: "center", color: "#666", fontSize: 13 }}>
                  No Image Uploaded
                </div>
              )}
              <div className="content-item-body">
                <div className="content-item-title">{item[config.titleField] || "Untitled"}</div>
                {config.subField && (
                  <div className="content-item-sub">{item[config.subField] || ""}</div>
                )}
                <div className="content-item-actions" style={{ marginTop: 12 }}>
                  <button className="btn" onClick={() => openEdit(item)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => remove(id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              {modal.mode === "create"
                ? `Add ${config.title.replace(/s$/, "")}`
                : `Edit ${config.title.replace(/s$/, "")}`}
            </div>

            {error && (
              <div style={{ padding: "8px 12px", background: "rgba(220,53,69,0.15)", border: "1px solid #dc3545", color: "#ff6b6b", borderRadius: 4, marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={save}>
              <div className="form-grid">
                {config.fields.map((f) => (
                  <div className={`field ${f.wide ? "full" : ""}`} key={f.key}>
                    <label>{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea
                        className="input"
                        rows={3}
                        style={{ width: "100%" }}
                        value={modal.data[f.key] || ""}
                        onChange={(e) => setField(f.key, e.target.value)}
                        required={f.required}
                      />
                    ) : f.type === "select" ? (
                      <select
                        className="input"
                        style={{ width: "100%" }}
                        value={modal.data[f.key] || ""}
                        onChange={(e) => setField(f.key, e.target.value)}
                      >
                        <option value="">—</option>
                        {f.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : f.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        checked={Boolean(modal.data[f.key])}
                        onChange={(e) => setField(f.key, e.target.checked)}
                      />
                    ) : (
                      <input
                        className="input"
                        style={{ width: "100%" }}
                        type={f.type || "text"}
                        value={modal.data[f.key] !== undefined && modal.data[f.key] !== null ? modal.data[f.key] : ""}
                        onChange={(e) => setField(f.key, e.target.value)}
                        required={f.required}
                      />
                    )}
                  </div>
                ))}

                {config.imageField && (
                  <div className="field full">
                    <label>{config.imageLabel || "File / Image"}</label>
                    <input
                      className="input"
                      style={{ width: "100%" }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, config.imageField, false)}
                    />

                    {/* Image Preview */}
                    {(previews[config.imageField] || imgSrc(modal.data)) && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Preview:</div>
                        <img
                          src={previews[config.imageField] || imgSrc(modal.data)}
                          alt="Preview"
                          style={{ maxHeight: 140, borderRadius: 4, objectFit: "cover", border: "1px solid #333" }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {config.multipleFiles &&
                  config.multipleFiles.map((mf) => (
                    <div className="field full" key={mf.name}>
                      <label>{mf.label}</label>
                      <input
                        className="input"
                        style={{ width: "100%" }}
                        type="file"
                        multiple
                        accept={mf.accept}
                        onChange={(e) => handleFileChange(e, mf.name, true)}
                      />
                      {previews[mf.name] && (
                        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {(Array.isArray(previews[mf.name]) ? previews[mf.name] : [previews[mf.name]]).map(
                            (p, i) => (
                              <img
                                key={i}
                                src={p}
                                alt={`Preview ${i}`}
                                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, border: "1px solid #333" }}
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/60?text=File";
                                }}
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
                <button type="button" className="btn" onClick={() => setModal(null)} disabled={saving}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
