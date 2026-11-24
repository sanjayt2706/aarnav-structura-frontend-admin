import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import Layout from "../layouts/Layout";
import { uploadFiles } from "../components/MediaFields";
import { previewUrl, formatBytes } from "../services/assets";

export default function MediaLibrary() {
  const [items, setItems] = useState(null);
  const [type, setType] = useState("");
  const [busy, setBusy] = useState(0);
  const [drag, setDrag] = useState(false);
  const [msg, setMsg] = useState("");
  const input = useRef(null);

  const load = () =>
    API.get("/api/admin/media", { params: { type: type || undefined, limit: 200 } })
      .then(({ data }) => setItems(data.data))
      .catch(() => setItems([]));

  useEffect(() => { load(); }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  const upload = async (files) => {
    if (!files?.length) return;
    setMsg("");
    setBusy(1);
    try {
      const up = await uploadFiles(files, (p) => setBusy(Math.max(1, p)));
      setMsg(`Uploaded ${up.length} file${up.length > 1 ? "s" : ""}.`);
      load();
    } catch (e) {
      setMsg(e.response?.data?.message || "Upload failed.");
    } finally {
      setBusy(0);
    }
  };

  const remove = async (m) => {
    if (!confirm(`Delete “${m.name}”? If it's used on the website, that spot will show no image until you pick another.`)) return;
    await API.delete(`/api/admin/media/${m.id}`);
    load();
  };

  const copy = async (m) => {
    await navigator.clipboard?.writeText(previewUrl(m.id));
    setMsg("Link copied.");
  };

  return (
    <Layout>
      <h1 className="page-title">Media Library</h1>
      <p className="page-sub">Every photo and video you upload lives here. You can also upload straight from any image box in Website Content.</p>

      <div
        className={`dropzone dropzone-big ${drag ? "is-drag" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files); }}
        onClick={() => !busy && input.current?.click()}
      >
        <div className="dropzone-empty">
          <strong>{busy ? `Uploading… ${busy}%` : "Drop photos or videos here"}</strong>
          <span>or click to choose — JPG, PNG, WEBP, GIF, MP4, WEBM · up to 20 at once</span>
        </div>
        <input ref={input} type="file" hidden multiple accept="image/*,video/mp4,video/webm,video/quicktime" onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
      </div>

      <div className="toolbar" style={{ marginTop: 18 }}>
        <div className="chip-tabs" style={{ margin: 0 }}>
          {[["", "All"], ["image", "Images"], ["video", "Videos"]].map(([k, l]) => (
            <button key={k} className={`chip-tab ${type === k ? "active" : ""}`} onClick={() => setType(k)}>{l}</button>
          ))}
        </div>
        {msg && <span className="ok-text">{msg}</span>}
      </div>

      {items === null ? (
        <div className="empty-state">Loading…</div>
      ) : items.length === 0 ? (
        <div className="empty-state">No files yet.</div>
      ) : (
        <div className="media-grid">
          {items.map((m) => (
            <div key={m.id} className="media-tile">
              {m.contentType.startsWith("video/") ? <video src={previewUrl(m.id)} muted preload="metadata" controls /> : <img src={previewUrl(m.id)} alt="" loading="lazy" />}
              <span>{m.name}<small>{formatBytes(m.size)} · {new Date(m.uploadedAt).toLocaleDateString()}</small></span>
              <div className="row-tools" style={{ padding: "0 10px 10px" }}>
                <button className="btn btn-sm" onClick={() => copy(m)}>Copy link</button>
                <button className="btn btn-sm btn-danger" onClick={() => remove(m)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
