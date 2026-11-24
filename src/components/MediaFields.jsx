import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import { previewUrl, formatBytes } from "../services/assets";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";
const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime";

/** Uploads files to the media library. Returns [{ id, url, name, ... }]. */
export async function uploadFiles(files, onProgress) {
  const fd = new FormData();
  [...files].forEach((f) => fd.append("files", f));
  const { data } = await API.post("/api/admin/media", fd, {
    onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100))
  });
  return data.data;
}

/**
 * Image or video picker used in every content form.
 * Stores a single string: an uploaded file id, a full URL, or a site path.
 */
export function MediaField({ value, onChange, kind = "image" }) {
  const input = useRef(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState("");
  const [picker, setPicker] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const src = previewUrl(value);
  const isVideo = kind === "video";

  const handle = async (files) => {
    if (!files?.length) return;
    setErr("");
    setBusy(1);
    try {
      const [item] = await uploadFiles([files[0]], (p) => setBusy(Math.max(1, p)));
      onChange(item.id);
    } catch (e) {
      setErr(e.response?.data?.message || "Upload failed. Check the file and try again.");
    } finally {
      setBusy(0);
    }
  };

  return (
    <div className="media-field">
      <div
        className={`dropzone ${drag ? "is-drag" : ""} ${src ? "has-file" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
        onClick={() => !busy && input.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
      >
        {src ? (
          isVideo ? <video src={src} muted playsInline preload="metadata" /> : <img src={src} alt="" />
        ) : (
          <div className="dropzone-empty">
            <strong>Drop {isVideo ? "a video" : "an image"} here</strong>
            <span>or click to choose a file</span>
          </div>
        )}
        {busy > 0 && (
          <div className="dropzone-busy">
            <div className="bar"><span style={{ width: `${busy}%` }} /></div>
            Uploading… {busy}%
          </div>
        )}
        <input ref={input} type="file" hidden accept={isVideo ? VIDEO_ACCEPT : IMAGE_ACCEPT} onChange={(e) => { handle(e.target.files); e.target.value = ""; }} />
      </div>

      <div className="media-actions">
        <button type="button" className="btn btn-sm" onClick={() => input.current?.click()} disabled={!!busy}>{src ? "Replace" : "Upload"}</button>
        <button type="button" className="btn btn-sm" onClick={() => setPicker(true)}>From library</button>
        <button type="button" className="btn btn-sm" onClick={() => setShowUrl((v) => !v)}>Paste link</button>
        {src && <button type="button" className="btn btn-sm btn-danger" onClick={() => onChange("")}>Remove</button>}
      </div>
      {showUrl && (
        <input className="input" style={{ width: "100%", marginTop: 8 }} placeholder="https://…" value={value || ""} onChange={(e) => onChange(e.target.value.trim())} />
      )}
      {err && <div className="error-text">{err}</div>}
      {picker && <MediaPicker kind={kind} onClose={() => setPicker(false)} onPick={(id) => { onChange(id); setPicker(false); }} />}
    </div>
  );
}

/** Modal grid of everything in the media library. */
export function MediaPicker({ kind = "image", onPick, onClose }) {
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(false);
  const input = useRef(null);

  const load = () => API.get("/api/admin/media", { params: { type: kind, limit: 200 } }).then(({ data }) => setItems(data.data)).catch(() => setItems([]));
  useEffect(() => { load(); }, [kind]); // eslint-disable-line react-hooks/exhaustive-deps

  const upload = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      await uploadFiles(files);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 }}>
          <div className="modal-title" style={{ margin: 0 }}>Choose from media library</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={() => input.current?.click()} disabled={busy}>{busy ? "Uploading…" : "Upload new"}</button>
            <button className="btn btn-sm" onClick={onClose}>Close</button>
          </div>
          <input ref={input} type="file" hidden multiple accept={kind === "video" ? VIDEO_ACCEPT : IMAGE_ACCEPT} onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
        </div>
        {items === null ? (
          <div className="empty-state">Loading…</div>
        ) : items.length === 0 ? (
          <div className="empty-state">Nothing uploaded yet. Click “Upload new”.</div>
        ) : (
          <div className="media-grid">
            {items.map((m) => (
              <button key={m.id} className="media-tile" onClick={() => onPick(m.id)} title={m.name}>
                {m.contentType.startsWith("video/") ? <video src={previewUrl(m.id)} muted preload="metadata" /> : <img src={previewUrl(m.id)} alt="" loading="lazy" />}
                <span>{m.name}<small>{formatBytes(m.size)}</small></span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
